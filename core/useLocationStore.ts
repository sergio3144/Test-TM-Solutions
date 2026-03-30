import { getCurrentLocation, watchCurrentPosition } from "@/actions/location/location";
import { LatLng } from "@/infraestructure/interface/lat-lng";
import { LocationSubscription } from "expo-location";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { calculateDistance } from "./utils/distance";
import { FLUID_REVERSED_MEDELLIN_ROUTE, REVERSED_ROUTE_DISTANCE, END_COORDS } from "./utils/simulation";

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
  simulationIntervalId: any | null;

  isTracking: boolean;
  totalDistance: number;
  routesHistory: Route[];

  getLocation: () => Promise<LatLng>;
  watchLocation: () => Promise<void>;
  clearWatchLocation: () => void;

  startTracking: () => void;
  stopTracking: () => void;
  clearHistory: () => void;
}

export const useLocationStore = create<LocationState>()(
  persist(
    (set, get) => ({
      laskKnowLocation: null,
      userLocationList: [],
      watchSubscriptionId: null,
      simulationIntervalId: null,

      isTracking: false,
      totalDistance: 0,
      routesHistory: [],

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
          // In simulation mode, we don't want real GPS to interfere with the polyline
          const { isTracking, simulationIntervalId } = get();
          if (isTracking && simulationIntervalId) return;

          set({
            laskKnowLocation: latLng,
            userLocationList: get().isTracking ? [...get().userLocationList, latLng] : [latLng],
          });
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

      startTracking: () => {
        // Clear any existing simulation
        if (get().simulationIntervalId) {
          clearInterval(get().simulationIntervalId!);
        }

        const simulatedPoints = FLUID_REVERSED_MEDELLIN_ROUTE;
        const routeDistance = REVERSED_ROUTE_DISTANCE;

        set({
          isTracking: true,
          userLocationList: [simulatedPoints[0]],
          totalDistance: 0,
          currentRouteTotalDistance: routeDistance,
          laskKnowLocation: simulatedPoints[0],
        });

        let currentIndex = 0;
        const intervalId = setInterval(() => {
          const { userLocationList, totalDistance, isTracking } = get();
          
          if (!isTracking || currentIndex >= simulatedPoints.length - 1) {
            clearInterval(intervalId);
            set({ simulationIntervalId: null });
            return;
          }

          currentIndex++;
          const nextPoint = simulatedPoints[currentIndex];
          const lastPoint = userLocationList[userLocationList.length - 1];
          const distanceIncrement = calculateDistance(lastPoint, nextPoint);

          set({
            laskKnowLocation: nextPoint,
            userLocationList: [...userLocationList, nextPoint],
            totalDistance: totalDistance + distanceIncrement,
          });
        }, 1000); // 1.0 second interval (fluid)

        set({ simulationIntervalId: intervalId });
      },

      stopTracking: () => {
        const { userLocationList, totalDistance, routesHistory, isTracking, simulationIntervalId } = get();
        
        if (!isTracking) return;

        // Clear simulation
        if (simulationIntervalId) {
          clearInterval(simulationIntervalId);
        }

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
            simulationIntervalId: null,
          });
        } else {
          set({ isTracking: false, simulationIntervalId: null });
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