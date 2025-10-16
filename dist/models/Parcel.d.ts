/**
 * Parcel Model
 *
 * This class handles parcel-related operations:
 * - Creating and managing parcels
 * - Validating parcel data
 * - Calculating dimensions and weight categories
 */
import { Parcel, CreateParcelRequest, WeightCategory } from '../types';
export declare class ParcelModel {
    private parcels;
    /**
     * Create a new parcel
     * @param userId - ID of the user creating the parcel
     * @param parcelData - Parcel data
     * @returns Promise<Parcel> - Created parcel
     */
    createParcel(userId: string, parcelData: CreateParcelRequest): Promise<Parcel>;
    /**
     * Get parcel by ID
     * @param id - Parcel ID
     * @returns Promise<Parcel | null>
     */
    getParcelById(id: string): Promise<Parcel | null>;
    /**
     * Get all parcels for a user
     * @param userId - User ID
     * @returns Promise<Parcel[]>
     */
    getParcelsByUser(userId: string): Promise<Parcel[]>;
    /**
     * Update parcel
     * @param id - Parcel ID
     * @param updates - Partial parcel data to update
     * @returns Promise<Parcel | null>
     */
    updateParcel(id: string, updates: Partial<Omit<Parcel, 'id' | 'userId' | 'createdAt'>>): Promise<Parcel | null>;
    /**
     * Delete parcel
     * @param id - Parcel ID
     * @returns Promise<boolean>
     */
    deleteParcel(id: string): Promise<boolean>;
    /**
     * Get weight category for a parcel
     * @param weight - Weight in kg
     * @returns WeightCategory
     */
    getWeightCategory(weight: number): WeightCategory;
    /**
     * Calculate total volume of parcel
     * @param dimensions - Parcel dimensions
     * @returns number - Volume in cubic cm
     */
    calculateVolume(dimensions: {
        length: number;
        width: number;
        height: number;
    }): number;
    /**
     * Check if parcel is oversized
     * @param dimensions - Parcel dimensions
     * @returns boolean
     */
    isOversized(dimensions: {
        length: number;
        width: number;
        height: number;
    }): boolean;
    /**
     * Validate parcel data
     * @param parcelData - Parcel data to validate
     * @throws Error if validation fails
     */
    private validateParcelData;
}
//# sourceMappingURL=Parcel.d.ts.map