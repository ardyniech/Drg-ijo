import { describe, it, expect } from "vitest";
import { calculateDistanceMeters, formatDistanceDisplay, findNearestShelter } from "./geo-distance";

describe("Geo Distance Utility", () => {
  it("calculates distance between Suhat and Dinoyo accurately", () => {
    const suhat = { lat: -7.9485, lng: 112.6175 };
    const dinoyo = { lat: -7.9395, lng: 112.6078 };
    const dist = calculateDistanceMeters(suhat, dinoyo);
    // Approximate distance is around 1440m
    expect(dist).toBeGreaterThan(1200);
    expect(dist).toBeLessThan(1700);
  });

  it("formats distance strings properly", () => {
    expect(formatDistanceDisplay(85)).toBe("85 meter");
    expect(formatDistanceDisplay(1500)).toBe("1.5 km");
  });

  it("finds nearest shelter and evaluates geofence radius", () => {
    const shelters = [
      { id: "sh-01", nama: "Suhat", lat: -7.9485, lng: 112.6175 },
      { id: "sh-02", nama: "Dinoyo", lat: -7.9395, lng: 112.6078 },
    ];
    // User is 50m from Suhat
    const userPos = { lat: -7.9486, lng: 112.6176 };
    const result = findNearestShelter(userPos, shelters, 250);

    expect(result).not.toBeNull();
    expect(result?.shelterId).toBe("sh-01");
    expect(result?.isWithinRadius).toBe(true);
    expect(result?.distanceMeters).toBeLessThan(100);
  });
});
