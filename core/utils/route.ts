import { HARDCODED_ROUTE } from "@/data/route";
import { LatLng } from "@/infraestructure/interface/lat-lng";
import { calculateDistance } from "./distance";




export const fetchRoadRoute = async (
  _start: LatLng,
  _end: LatLng
): Promise<LatLng[]> => {
  return HARDCODED_ROUTE; /* Lo podríamos cambiar por una petición a una API, pero constante se cae, actualmente esa informacion está hardcodeada */
};

export const getPointAtDistance = (
  points: LatLng[],
  distanceInMeters: number
): LatLng => {
  if (points.length === 0) throw new Error("Empty points array");
  if (points.length === 1 || distanceInMeters <= 0) return points[0];

  let accumulatedDistance = 0;
  const targetKm = distanceInMeters / 1000;

  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i];
    const p2 = points[i + 1];
    const segmentDistance = calculateDistance(p1, p2);

    if (accumulatedDistance + segmentDistance >= targetKm) {
      const remainingDistance = targetKm - accumulatedDistance;
      const fraction = remainingDistance / segmentDistance;

      return {
        latitude: p1.latitude + (p2.latitude - p1.latitude) * fraction,
        longitude: p1.longitude + (p2.longitude - p1.longitude) * fraction,
      };
    }

    accumulatedDistance += segmentDistance;
  }

  return points[points.length - 1];
};

export const calculateTotalRouteDistance = (points: LatLng[]): number => {
  let total = 0;
  for (let i = 0; i < points.length - 1; i++) {
    total += calculateDistance(points[i], points[i + 1]);
  }
  return total;
};
