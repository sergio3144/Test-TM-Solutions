import { LatLng } from "@/infraestructure/interface/lat-lng";

/**
 * Calculates the distance between two points in kilometers using the Haversine formula.
 */
export const calculateDistance = (point1: LatLng, point2: LatLng): number => {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(point2.latitude - point1.latitude);
  const dLon = toRad(point2.longitude - point1.longitude);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(point1.latitude)) *
      Math.cos(toRad(point2.latitude)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance;
};

const toRad = (value: number) => {
  return (value * Math.PI) / 180;
};

/**
 * Formats a distance (in km) to a readable string.
 */
export const formatDistance = (km: number): string => {
  if (km < 1) {
    return `${(km * 1000).toFixed(0)} m`;
  }
  return `${km.toFixed(2)} km`;
};
