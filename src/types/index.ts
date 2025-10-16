/**
 * TypeScript Type Definitions for SendIT Parcel Tracker
 * 
 * This file contains all the type definitions for our application.
 * In commercial-grade applications, having well-defined types is crucial for:
 * 1. Type safety - prevents runtime errors
 * 2. Better IDE support - autocomplete, refactoring
 * 3. Documentation - types serve as living documentation
 * 4. Team collaboration - clear contracts between modules
 */

// User-related types
export interface User {
  id: string;
  email: string;
  password: string; // In production, this would be hashed
  firstName: string;
  lastName: string;
  phone: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin'
}

// Authentication types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
}

export interface AuthResponse {
  token: string;
  user: Omit<User, 'password'>; // Exclude password from response
}

// Location types
export interface Location {
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

// Parcel types
export interface Parcel {
  id: string;
  userId: string;
  description: string;
  weight: number; // in kg
  dimensions: {
    length: number; // in cm
    width: number;  // in cm
    height: number; // in cm
  };
  value: number; // in USD
  fragile: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Delivery Order types
export interface DeliveryOrder {
  id: string;
  userId: string;
  parcelId: string;
  pickupLocation: Location;
  destinationLocation: Location;
  status: OrderStatus;
  currentLocation?: Location; // Optional, set by admin
  estimatedDelivery: Date;
  actualDelivery?: Date; // Optional, set when delivered
  distance?: number; // in km, calculated from Google Maps
  duration?: number; // in minutes, calculated from Google Maps
  price: number; // calculated based on weight and distance
  trackingNumber: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum OrderStatus {
  PENDING = 'pending',
  PICKED_UP = 'picked_up',
  IN_TRANSIT = 'in_transit',
  OUT_FOR_DELIVERY = 'out_for_delivery',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled'
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Request/Response types for different endpoints
export interface CreateParcelRequest {
  description: string;
  weight: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  value: number;
  fragile: boolean;
}

export interface CreateOrderRequest {
  parcelId: string;
  pickupLocation: Location;
  destinationLocation: Location;
}

export interface UpdateOrderDestinationRequest {
  destinationLocation: Location;
}

export interface UpdateOrderStatusRequest {
  status: OrderStatus;
  currentLocation?: Location;
}

// Weight categories for pricing
export enum WeightCategory {
  LIGHT = 'light',      // 0-5kg
  MEDIUM = 'medium',    // 5-20kg
  HEAVY = 'heavy',      // 20-50kg
  EXTRA_HEAVY = 'extra_heavy' // 50kg+
}

// Pricing configuration
export interface PricingConfig {
  basePrice: number;
  pricePerKm: number;
  weightMultipliers: {
    [WeightCategory.LIGHT]: number;
    [WeightCategory.MEDIUM]: number;
    [WeightCategory.HEAVY]: number;
    [WeightCategory.EXTRA_HEAVY]: number;
  };
}

// Google Maps integration types
export interface GoogleMapsConfig {
  apiKey: string;
  distanceMatrixUrl: string;
}

export interface DistanceMatrixResponse {
  distance: {
    text: string;
    value: number; // in meters
  };
  duration: {
    text: string;
    value: number; // in seconds
  };
}

// Email notification types
export interface EmailNotification {
  to: string;
  subject: string;
  body: string;
  orderId: string;
}

// Database types (for in-memory storage in this example)
export interface Database {
  users: Map<string, User>;
  parcels: Map<string, Parcel>;
  orders: Map<string, DeliveryOrder>;
}

// JWT payload type
export interface JWTPayload {
  userId: string;
  email: string;
  role: UserRole;
  iat: number;
  exp: number;
}
