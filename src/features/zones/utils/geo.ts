import { GeoJSONPolygon } from '../types/zones.types';

// Approximate radius of earth in km
const EARTH_RADIUS_KM = 6371;

/**
 * Validates if the polygon is structured correctly according to GeoJSON spec:
 * - Must be an array of rings
 * - Exterior ring must have at least 4 positions (3 points + closing point)
 * - First and last positions must be equivalent
 */
export const isValidPolygon = (polygon: GeoJSONPolygon): boolean => {
    if (!polygon || !polygon.coordinates || polygon.coordinates.length === 0) return false;
    const ring = polygon.coordinates[0];
    if (!ring || ring.length < 4) return false;

    // Check closure
    const first = ring[0];
    const last = ring[ring.length - 1];
    return first[0] === last[0] && first[1] === last[1];
};

/**
 * Ensures a ring is closed. If not, pushes the first point to the end.
 */
export const closeRing = (ring: number[][]): number[][] => {
    if (ring.length === 0) return [];
    const first = ring[0];
    const last = ring[ring.length - 1];
    if (first[0] !== last[0] || first[1] !== last[1]) {
        return [...ring, first];
    }
    return ring;
};

/**
 * Converts degrees to radians
 */
const toRad = (value: number) => (value * Math.PI) / 180;

/**
 * Calculates approximate area in square kilometers for a spherical polygon
 * using the Shoelace formula on spherical coordinates (simplified).
 */
export const calculatePolygonAreaSqKm = (polygon: GeoJSONPolygon): number => {
    if (!isValidPolygon(polygon)) return 0;

    const ring = polygon.coordinates[0];
    let area = 0;

    if (ring.length > 2) {
        for (let i = 0; i < ring.length - 1; i++) {
            const [lng1, lat1] = ring[i];
            const [lng2, lat2] = ring[i + 1];

            area += toRad(lng2 - lng1) * (2 + Math.sin(toRad(lat1)) + Math.sin(toRad(lat2)));
        }
        area = (area * EARTH_RADIUS_KM * EARTH_RADIUS_KM) / 2.0;
    }

    return Math.abs(area);
};

/**
 * Simple Ray Casting algorithm to check if a point is inside a polygon.
 * Note: Only handles exterior ring (no holes) for this simplified version.
 */
export const isPointInPolygon = (lat: number, lng: number, polygon: GeoJSONPolygon): boolean => {
    if (!isValidPolygon(polygon)) return false;

    // GeoJSON coordinates are [lng, lat]
    const ring = polygon.coordinates[0];
    let isInside = false;

    for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
        const [xi, yi] = ring[i];
        const [xj, yj] = ring[j];

        // Check intersection with ray cast from point
        // yi, yj are latitudes; xi, xj are longitudes
        const intersect = ((yi > lat) !== (yj > lat))
            && (lng < (xj - xi) * (lat - yi) / (yj - yi) + xi);

        if (intersect) isInside = !isInside;
    }

    return isInside;
};
