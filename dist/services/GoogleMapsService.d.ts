/**
 * Google Maps Service
 *
 * This service handles Google Maps integration:
 * - Geocoding (address to coordinates)
 * - Distance calculation using Distance Matrix API
 * - Map rendering and marker placement
 *
 * In production, you would need to:
 * 1. Get a Google Maps API key
 * 2. Enable the required APIs (Maps, Geocoding, Distance Matrix)
 * 3. Set up billing (Google Maps requires payment after free tier)
 */
import { Location, DistanceMatrixResponse } from '../types';
export declare class GoogleMapsService {
    private apiKey;
    private baseUrl;
    constructor();
    /**
     * Geocode an address to get coordinates
     * @param address - Address to geocode
     * @returns Promise<Location> - Location with coordinates
     */
    geocodeAddress(address: string): Promise<Location>;
    /**
     * Calculate distance and duration between two locations
     * @param origin - Origin location
     * @param destination - Destination location
     * @returns Promise<DistanceMatrixResponse> - Distance and duration data
     */
    calculateDistance(origin: Location, destination: Location): Promise<DistanceMatrixResponse>;
    /**
     * Get directions between two locations
     * @param origin - Origin location
     * @param destination - Destination location
     * @returns Promise<string> - Directions URL
     */
    getDirectionsUrl(origin: Location, destination: Location): string;
    /**
     * Generate map embed URL
     * @param center - Center location
     * @param zoom - Zoom level (1-20)
     * @returns string - Map embed URL
     */
    getMapEmbedUrl(center: Location, zoom?: number): string;
    /**
     * Generate static map image URL
     * @param locations - Array of locations to mark
     * @param size - Map size (widthxheight)
     * @returns string - Static map URL
     */
    getStaticMapUrl(locations: Location[], size?: string): string;
    /**
     * Validate if coordinates are within reasonable bounds
     * @param latitude - Latitude
     * @param longitude - Longitude
     * @returns boolean - Whether coordinates are valid
     */
    validateCoordinates(latitude: number, longitude: number): boolean;
    /**
     * Calculate distance using Haversine formula (fallback when Google Maps is unavailable)
     * @param origin - Origin location
     * @param destination - Destination location
     * @returns number - Distance in kilometers
     */
    calculateHaversineDistance(origin: Location, destination: Location): number;
    /**
     * Convert degrees to radians
     * @param degrees - Degrees
     * @returns number - Radians
     */
    private toRadians;
}
//# sourceMappingURL=GoogleMapsService.d.ts.map