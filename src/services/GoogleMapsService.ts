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

import { Location, DistanceMatrixResponse, GoogleMapsConfig } from '../types';

export class GoogleMapsService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    // In production, get these from environment variables
    this.apiKey = process.env.GOOGLE_MAPS_API_KEY || 'your-google-maps-api-key';
    this.baseUrl = 'https://maps.googleapis.com/maps/api';
  }

  /**
   * Geocode an address to get coordinates
   * @param address - Address to geocode
   * @returns Promise<Location> - Location with coordinates
   */
  async geocodeAddress(address: string): Promise<Location> {
    try {
      const encodedAddress = encodeURIComponent(address);
      const url = `${this.baseUrl}/geocode/json?address=${encodedAddress}&key=${this.apiKey}`;
      
      const response = await fetch(url);
      const data = await response.json();

      if (data.status !== 'OK' || !data.results || data.results.length === 0) {
        throw new Error(`Geocoding failed: ${data.status}`);
      }

      const result = data.results[0];
      const location = result.geometry.location;
      const addressComponents = result.address_components;

      // Parse address components
      let city = '';
      let state = '';
      let country = '';
      let postalCode = '';

      addressComponents.forEach((component: any) => {
        const types = component.types;
        if (types.includes('locality')) city = component.long_name;
        if (types.includes('administrative_area_level_1')) state = component.short_name;
        if (types.includes('country')) country = component.long_name;
        if (types.includes('postal_code')) postalCode = component.long_name;
      });

      return {
        latitude: location.lat,
        longitude: location.lng,
        address: result.formatted_address,
        city,
        state,
        country,
        postalCode
      };
    } catch (error) {
      console.error('Geocoding error:', error);
      throw new Error('Failed to geocode address');
    }
  }

  /**
   * Calculate distance and duration between two locations
   * @param origin - Origin location
   * @param destination - Destination location
   * @returns Promise<DistanceMatrixResponse> - Distance and duration data
   */
  async calculateDistance(origin: Location, destination: Location): Promise<DistanceMatrixResponse> {
    try {
      const originStr = `${origin.latitude},${origin.longitude}`;
      const destinationStr = `${destination.latitude},${destination.longitude}`;
      
      const url = `${this.baseUrl}/distancematrix/json?origins=${originStr}&destinations=${destinationStr}&units=metric&key=${this.apiKey}`;
      
      const response = await fetch(url);
      const data = await response.json();

      if (data.status !== 'OK' || !data.rows || data.rows.length === 0) {
        throw new Error(`Distance calculation failed: ${data.status}`);
      }

      const element = data.rows[0].elements[0];
      
      if (element.status !== 'OK') {
        throw new Error(`Distance calculation failed: ${element.status}`);
      }

      return {
        distance: {
          text: element.distance.text,
          value: element.distance.value // in meters
        },
        duration: {
          text: element.duration.text,
          value: element.duration.value // in seconds
        }
      };
    } catch (error) {
      console.error('Distance calculation error:', error);
      throw new Error('Failed to calculate distance');
    }
  }

  /**
   * Get directions between two locations
   * @param origin - Origin location
   * @param destination - Destination location
   * @returns Promise<string> - Directions URL
   */
  getDirectionsUrl(origin: Location, destination: Location): string {
    const originStr = `${origin.latitude},${origin.longitude}`;
    const destinationStr = `${destination.latitude},${destination.longitude}`;
    
    return `https://www.google.com/maps/dir/${originStr}/${destinationStr}`;
  }

  /**
   * Generate map embed URL
   * @param center - Center location
   * @param zoom - Zoom level (1-20)
   * @returns string - Map embed URL
   */
  getMapEmbedUrl(center: Location, zoom: number = 10): string {
    return `https://www.google.com/maps/embed/v1/view?key=${this.apiKey}&center=${center.latitude},${center.longitude}&zoom=${zoom}`;
  }

  /**
   * Generate static map image URL
   * @param locations - Array of locations to mark
   * @param size - Map size (widthxheight)
   * @returns string - Static map URL
   */
  getStaticMapUrl(locations: Location[], size: string = '600x400'): string {
    const markers = locations.map((loc, index) => 
      `markers=color:${index === 0 ? 'red' : 'blue'}|${loc.latitude},${loc.longitude}`
    ).join('&');
    
    const center = locations[0]; // Use first location as center
    return `${this.baseUrl}/staticmap?center=${center.latitude},${center.longitude}&zoom=10&size=${size}&${markers}&key=${this.apiKey}`;
  }

  /**
   * Validate if coordinates are within reasonable bounds
   * @param latitude - Latitude
   * @param longitude - Longitude
   * @returns boolean - Whether coordinates are valid
   */
  validateCoordinates(latitude: number, longitude: number): boolean {
    return (
      latitude >= -90 && latitude <= 90 &&
      longitude >= -180 && longitude <= 180
    );
  }

  /**
   * Calculate distance using Haversine formula (fallback when Google Maps is unavailable)
   * @param origin - Origin location
   * @param destination - Destination location
   * @returns number - Distance in kilometers
   */
  calculateHaversineDistance(origin: Location, destination: Location): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(destination.latitude - origin.latitude);
    const dLon = this.toRadians(destination.longitude - origin.longitude);
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(this.toRadians(origin.latitude)) * 
              Math.cos(this.toRadians(destination.latitude)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  /**
   * Convert degrees to radians
   * @param degrees - Degrees
   * @returns number - Radians
   */
  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }
}
