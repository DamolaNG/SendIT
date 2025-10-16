"use strict";
/**
 * Parcel Model
 *
 * This class handles parcel-related operations:
 * - Creating and managing parcels
 * - Validating parcel data
 * - Calculating dimensions and weight categories
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParcelModel = void 0;
const uuid_1 = require("uuid");
const types_1 = require("../types");
class ParcelModel {
    constructor() {
        this.parcels = new Map();
    }
    /**
     * Create a new parcel
     * @param userId - ID of the user creating the parcel
     * @param parcelData - Parcel data
     * @returns Promise<Parcel> - Created parcel
     */
    async createParcel(userId, parcelData) {
        // Validate parcel data
        this.validateParcelData(parcelData);
        const parcel = {
            id: (0, uuid_1.v4)(),
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
    async getParcelById(id) {
        return this.parcels.get(id) || null;
    }
    /**
     * Get all parcels for a user
     * @param userId - User ID
     * @returns Promise<Parcel[]>
     */
    async getParcelsByUser(userId) {
        return Array.from(this.parcels.values()).filter(parcel => parcel.userId === userId);
    }
    /**
     * Update parcel
     * @param id - Parcel ID
     * @param updates - Partial parcel data to update
     * @returns Promise<Parcel | null>
     */
    async updateParcel(id, updates) {
        const parcel = this.parcels.get(id);
        if (!parcel) {
            return null;
        }
        const updatedParcel = {
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
    async deleteParcel(id) {
        return this.parcels.delete(id);
    }
    /**
     * Get weight category for a parcel
     * @param weight - Weight in kg
     * @returns WeightCategory
     */
    getWeightCategory(weight) {
        if (weight <= 5)
            return types_1.WeightCategory.LIGHT;
        if (weight <= 20)
            return types_1.WeightCategory.MEDIUM;
        if (weight <= 50)
            return types_1.WeightCategory.HEAVY;
        return types_1.WeightCategory.EXTRA_HEAVY;
    }
    /**
     * Calculate total volume of parcel
     * @param dimensions - Parcel dimensions
     * @returns number - Volume in cubic cm
     */
    calculateVolume(dimensions) {
        return dimensions.length * dimensions.width * dimensions.height;
    }
    /**
     * Check if parcel is oversized
     * @param dimensions - Parcel dimensions
     * @returns boolean
     */
    isOversized(dimensions) {
        const maxDimension = Math.max(dimensions.length, dimensions.width, dimensions.height);
        const maxSize = 150; // cm - maximum allowed dimension
        return maxDimension > maxSize;
    }
    /**
     * Validate parcel data
     * @param parcelData - Parcel data to validate
     * @throws Error if validation fails
     */
    validateParcelData(parcelData) {
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
exports.ParcelModel = ParcelModel;
//# sourceMappingURL=Parcel.js.map