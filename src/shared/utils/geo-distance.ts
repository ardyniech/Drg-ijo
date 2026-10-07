export interface GeoCoord {
  lat: number;
  lng: number;
}

export function calculateDistanceMeters(point1: GeoCoord, point2: GeoCoord): number {
  if (
    !point1 ||
    !point2 ||
    typeof point1.lat !== "number" ||
    typeof point1.lng !== "number" ||
    typeof point2.lat !== "number" ||
    typeof point2.lng !== "number" ||
    Number.isNaN(point1.lat) ||
    Number.isNaN(point1.lng) ||
    Number.isNaN(point2.lat) ||
    Number.isNaN(point2.lng)
  ) {
    return 0;
  }

  const R = 6371e3; // Earth radius in meters
  const phi1 = (point1.lat * Math.PI) / 180;
  const phi2 = (point2.lat * Math.PI) / 180;
  const deltaPhi = ((point2.lat - point1.lat) * Math.PI) / 180;
  const deltaLambda = ((point2.lng - point1.lng) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

export function formatDistanceDisplay(meters: number): string {
  if (!meters || Number.isNaN(meters) || meters <= 0) {
    return "0 meter";
  }
  if (meters < 1000) {
    return `${meters} meter`;
  }
  return `${(meters / 1000).toFixed(1)} km`;
}

export interface NearestShelterResult {
  shelterId: string;
  shelterName: string;
  distanceMeters: number;
  isWithinRadius: boolean;
}

export function findNearestShelter(
  userPos: GeoCoord,
  shelters: Array<{ id: string; nama: string; lat: number; lng: number }>,
  maxRadiusMeters: number = 250,
): NearestShelterResult | null {
  if (!shelters || shelters.length === 0) return null;

  let minDistance = Infinity;
  let nearest = shelters[0];

  for (const s of shelters) {
    const dist = calculateDistanceMeters(userPos, { lat: s.lat, lng: s.lng });
    if (dist < minDistance) {
      minDistance = dist;
      nearest = s;
    }
  }

  return {
    shelterId: nearest.id,
    shelterName: nearest.nama,
    distanceMeters: minDistance,
    isWithinRadius: minDistance <= maxRadiusMeters,
  };
}
