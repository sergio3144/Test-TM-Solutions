import { getCurrentLocation, watchCurrentPosition } from "@/actions/location/location";
import { LatLng } from "@/infraestructure/interface/lat-lng";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LocationSubscription } from "expo-location";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { calculateDistance } from "./utils/distance";
import {
  fetchRoadRoute
} from "./utils/route";

const SIMULATION_START: LatLng = { latitude: 6.190481, longitude: -75.583225 }; /* Inicio */
const SIMULATION_END: LatLng = { latitude: 6.158941, longitude: -75.619540 }; /* Final */

const SIMULATION_INTERVAL_MS = 3000;
/* const SIMULATION_STEP_METERS = 10; */

export interface Route {
  id: string;
  points: LatLng[];
  distance: number;
  date: number;
}

interface LocationState {
  laskKnowLocation: LatLng | null;
  userLocationList: LatLng[];
  watchSubscriptionId: LocationSubscription | null;

  isTracking: boolean;
  isSimulating: boolean;
  isLoadingRoute: boolean;
  totalDistance: number;
  routesHistory: Route[];

  simulationRoute: LatLng[];
  simulationDistanceMeters: number;
  simulationTimerId: ReturnType<typeof setInterval> | null;

  getLocation: () => Promise<LatLng>;
  watchLocation: () => Promise<void>;
  clearWatchLocation: () => void;

  startTracking: () => Promise<void>;
  stopTracking: () => void;
  clearHistory: () => void;
}

export const useLocationStore = create<LocationState>()(
  persist(
    (set, get) => ({
      laskKnowLocation: null,
      userLocationList: [],
      watchSubscriptionId: null,

      isTracking: false,
      isSimulating: false,
      isLoadingRoute: false,
      totalDistance: 0,
      routesHistory: [],

      simulationRoute: [],
      simulationDistanceMeters: 0,
      simulationTimerId: null,

      getLocation: async () => {
        const location = await getCurrentLocation();
        set({ laskKnowLocation: location });
        return location;
      },

      watchLocation: async () => {
        const oldSubscription = get().watchSubscriptionId;
        if (oldSubscription !== null) {
          get().clearWatchLocation();
        }

        const watchSuscription = await watchCurrentPosition((latLng) => {
          const { isTracking, isSimulating } = get();

          if (isSimulating) return;

          if (isTracking) {
            const { userLocationList, totalDistance } = get();
            const lastPoint = userLocationList[userLocationList.length - 1];
            const distanceIncrement = lastPoint
              ? calculateDistance(lastPoint, latLng)
              : 0;

            set({
              laskKnowLocation: latLng,
              userLocationList: [...userLocationList, latLng],
              totalDistance: totalDistance + distanceIncrement,
            });
          } else {
            set({
              laskKnowLocation: latLng,
              userLocationList: [latLng],
            });
          }
        });

        set({ watchSubscriptionId: watchSuscription });
      },

      clearWatchLocation: () => {
        const subscription = get().watchSubscriptionId;
        if (subscription !== null) {
          subscription.remove();
        }
        set({ watchSubscriptionId: null });
      },

      startTracking: async () => {
        const existingTimer = get().simulationTimerId;
        if (existingTimer !== null) {
          clearInterval(existingTimer);
        }

        const route = await fetchRoadRoute(SIMULATION_START, SIMULATION_END);

        let currentIndex = 0;

        set({
          isTracking: true,
          isSimulating: true,
          isLoadingRoute: false,
          simulationRoute: route,
          simulationDistanceMeters: 0,
          userLocationList: [route[0]],
          laskKnowLocation: route[0],
          totalDistance: 0,
        });

        const timerId = setInterval(() => {
          const { simulationRoute, userLocationList, totalDistance, isTracking } = get();

          if (!isTracking || simulationRoute.length === 0) {
            clearInterval(timerId);
            return;
          }

          currentIndex++;

          if (currentIndex >= simulationRoute.length) {
            clearInterval(timerId);
            get().stopTracking();
            return;
          }

          const newPosition = simulationRoute[currentIndex];
          const lastPoint = userLocationList[userLocationList.length - 1];
          const distanceIncrement = lastPoint
            ? calculateDistance(lastPoint, newPosition)
            : 0;

          set({
            simulationDistanceMeters: get().simulationDistanceMeters + (distanceIncrement * 1000),
            laskKnowLocation: newPosition,
            userLocationList: [...userLocationList, newPosition],
            totalDistance: totalDistance + distanceIncrement,
          });
        }, SIMULATION_INTERVAL_MS);

        set({ simulationTimerId: timerId });
      },

      stopTracking: () => {
        const { userLocationList, totalDistance, routesHistory, isTracking, simulationTimerId } =
          get();

        if (simulationTimerId !== null) {
          clearInterval(simulationTimerId);
        }

        if (!isTracking) return;

        if (userLocationList.length > 1) {
          const newRoute: Route = {
            id: Date.now().toString(),
            points: [...userLocationList],
            distance: totalDistance,
            date: Date.now(),
          };

          set({
            routesHistory: [newRoute, ...routesHistory],
            isTracking: false,
            isSimulating: false,
            simulationTimerId: null,
            simulationRoute: [],
            simulationDistanceMeters: 0,
          });
        } else {
          set({
            isTracking: false,
            isSimulating: false,
            simulationTimerId: null,
            simulationRoute: [],
            simulationDistanceMeters: 0,
          });
        }
      },

      clearHistory: () => {
        set({ routesHistory: [] });
      },
    }),
    {
      name: "location-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ routesHistory: state.routesHistory }),
    }
  )
);