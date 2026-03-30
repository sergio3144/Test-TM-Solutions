import { LatLng } from "@/infraestructure/interface/lat-lng";
import { calculateDistance } from "./distance";
import { MEDELLIN_ROUTE_POINTS } from "./medellinRoute";

export const START_COORDS: LatLng = { latitude: 6.27771, longitude: -75.568791 };  /* Aranjuez (Norte) */
export const END_COORDS: LatLng = { latitude: 6.15769, longitude: -75.64317 };  /* Itagüí (Sur) */

/**
 * Generates a fluid route by interpolating additional points every 15 meters
 * along the reversed road path from Aranjuez to Itagüí.
 */
export const FLUID_REVERSED_MEDELLIN_ROUTE = (() => {
  const reversedSource = [...MEDELLIN_ROUTE_POINTS].reverse();
  const fluidPoints: LatLng[] = [reversedSource[0]];
  const STEP_METERS = 0.015; // 15 meters = 0.015 km

  for (let i = 1; i < reversedSource.length; i++) {
    const start = reversedSource[i - 1];
    const end = reversedSource[i];
    const segmentDistance = calculateDistance(start, end);

    if (segmentDistance > STEP_METERS) {
      const steps = Math.floor(segmentDistance / STEP_METERS);
      for (let j = 1; j <= steps; j++) {
        const lat = start.latitude + (end.latitude - start.latitude) * (j / (steps + 1));
        const lng = start.longitude + (end.longitude - start.longitude) * (j / (steps + 1));
        fluidPoints.push({ latitude: lat, longitude: lng });
      }
    }
    fluidPoints.push(end);
  }

  return fluidPoints;
})();

export const REVERSED_ROUTE_DISTANCE = (() => {
  let total = 0;
  for (let i = 1; i < MEDELLIN_ROUTE_POINTS.length; i++) {
    total += calculateDistance(MEDELLIN_ROUTE_POINTS[i-1], MEDELLIN_ROUTE_POINTS[i]);
  }
  return total;
})();
