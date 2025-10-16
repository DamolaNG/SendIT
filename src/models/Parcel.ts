/**
 * Parcel Model
 * 
 * This class handles parcel-related operations:
 * - Creating and managing parcels
 * - Validating parcel data
 * - Calculating dimensions and weight categories
 */

import { v4 as uuidv4 } from 'uuid';
import { Parcel, CreateParcelRequest, WeightCategory } from '../types';

export class ParcelModel {
  private parcels: Map<string, Parcel> = new Map();

  /**
   * Create a new parcel
   * @param userId - ID of the user creating the parcel
   * @param parcelData - Parcel data
   * @returns Promise<Parcel> - Created parcel
   */
  async createParcel(userId: string, parcelData: CreateParcelRequest): Promise<Parcel> {
    // Validate parcel data
    this.validateParcelData(parcelData);

    const parcel: Parcel = {
      id: uuidv4(),
      userId,
      description: parcelData.description,
      weight: parcelData.weight,
      dimensions: parcelData.dimensions,
      value: parcelData.value,
      fragile: parcelData.fragile,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.parcels.set(parcel.id, parcel);
    return parcel;
  }

  /**
   * Get parcel by ID
   * @param id - Parcel ID
   * @returns Promise<Parcel | null>
   */
  async getParcelById(id: string): Promise<Parcel | null> {
    return this.parcels.get(id) || null;
  }

  /**
   * Get all parcels for a user
   * @param userId - User ID
   * @returns Promise<Parcel[]>
   */
  async getParcelsByUser(userId: string): Promise<Parcel[]> {
    return Array.from(this.parcels.values()).filter(
      parcel => parcel.userId === userId
    );
  }

  /**
   * Update parcel
   * @param id - Parcel ID
   * @param updates - Partial parcel data to update
   * @returns Promise<Parcel | null>
   */
  async updateParcel(id: string, updates: Partial<Omit<Parcel, 'id' | 'userId' | 'createdAt'>>): Promise<Parcel | null> {
    const parcel = this.parcels.get(id);
    if (!parcel) {
      return null;
    }

    const updatedParcel: Parcel = {
      ...parcel,
      ...updates,
      updatedAt: new Date()
    };

    this.parcels.set(id, updatedParcel);
    return updatedParcel;
  }

  /**
   * Delete parcel
   * @param id - Parcel ID
   * @returns Promise<boolean>
   */
  async deleteParcel(id: string): Promise<boolean> {
    return this.parcels.delete(id);
  }

  /**
   * Get weight category for a parcel
   * @param weight - Weight in kg
   * @returns WeightCategory
   */
  getWeightCategory(weight: number): WeightCategory {
    if (weight <= 5) return WeightCategory.LIGHT;
    if (weight <= 20) return WeightCategory.MEDIUM;
    if (weight <= 50) return WeightCategory.HEAVY;
    return WeightCategory.EXTRA_HEAVY;
  }

  /**
   * Calculate total volume of parcel
   * @param dimensions - Parcel dimensions
   * @returns number - Volume in cubic cm
   */
  calculateVolume(dimensions: { length: number; width: number; height: number }): number {
    return dimensions.length * dimensions.width * dimensions.height;
  }

  /**
   * Check if parcel is oversized
   * @param dimensions - Parcel dimensions
   * @returns boolean
   */
  isOversized(dimensions: { length: number; width: number; height: number }): boolean {
    const maxDimension = Math.max(dimensions.length, dimensions.width, dimensions.height);
    const maxSize = 150; // cm - maximum allowed dimension
    return maxDimension > maxSize;
  }

  /**
   * Validate parcel data
   * @param parcelData - Parcel data to validate
   * @throws Error if validation fails
   */
  private validateParcelData(parcelData: CreateParcelRequest): void {
    // Validate weight
    if (parcelData.weight <= 0) {
      throw new Error('Weight must be greater than 0');
    }
    if (parcelData.weight > 100) {
      throw new Error('Weight cannot exceed 100kg');
    }

    // Validate dimensions
    const { length, width, height } = parcelData.dimensions;
    if (length <= 0 || width <= 0 || height <= 0) {
      throw new Error('All dimensions must be greater than 0');
    }

    // Check for oversized parcel
    if (this.isOversized(parcelData.dimensions)) {
      throw new Error('Parcel dimensions exceed maximum allowed size');
    }

    // Validate value
    if (parcelData.value < 0) {
      throw new Error('Parcel value cannot be negative');
    }

    // Validate description
    if (!parcelData.description || parcelData.description.trim().length === 0) {
      throw new Error('Description is required');
    }
    if (parcelData.description.length > 500) {
      throw new Error('Description cannot exceed 500 characters');
    }
  }
}
