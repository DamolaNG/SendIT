"use strict";
/**
 * Order Model
 *
 * This class handles delivery order operations:
 * - Creating and managing delivery orders
 * - Tracking order status
 * - Calculating pricing
 * - Generating tracking numbers
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderModel = void 0;
const uuid_1 = require("uuid");
const types_1 = require("../types");
const Parcel_1 = require("./Parcel");
class OrderModel {
    constructor() {
        this.orders = new Map();
        // Pricing configuration
        this.pricingConfig = {
            basePrice: 10, // Base price in USD
            pricePerKm: 0.5, // Price per kilometer
            weightMultipliers: {
                [types_1.WeightCategory.LIGHT]: 1.0,
                [types_1.WeightCategory.MEDIUM]: 1.2,
                [types_1.WeightCategory.HEAVY]: 1.5,
                [types_1.WeightCategory.EXTRA_HEAVY]: 2.0
            }
        };
        this.parcelModel = new Parcel_1.ParcelModel();
    }
    /**
     * Create a new delivery order
     * @param userId - ID of the user creating the order
     * @param orderData - Order data
     * @returns Promise<DeliveryOrder> - Created order
     */
    async createOrder(userId, orderData) {
        // Validate parcel exists and belongs to user
        const parcel = await this.parcelModel.getParcelById(orderData.parcelId);
        if (!parcel) {
            throw new Error('Parcel not found');
        }
        if (parcel.userId !== userId) {
            throw new Error('Parcel does not belong to user');
        }
        // Validate locations
        this.validateLocation(orderData.pickupLocation);
        this.validateLocation(orderData.destinationLocation);
        // Calculate distance and duration (mock values for now)
        const distance = this.calculateDistance(orderData.pickupLocation, orderData.destinationLocation);
        const duration = this.calculateDuration(distance);
        // Calculate price
        const price = this.calculatePrice(parcel.weight, distance);
        // Generate tracking number
        const trackingNumber = this.generateTrackingNumber();
        const order = {
            id: (0, uuid_1.v4)(),
            userId,
            parcelId: orderData.parcelId,
            pickupLocation: orderData.pickupLocation,
            destinationLocation: orderData.destinationLocation,
            status: types_1.OrderStatus.PENDING,
            estimatedDelivery: new Date(Date.now() + duration * 60 * 1000), // Add duration in minutes
            distance,
            duration,
            price,
            trackingNumber,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        this.orders.set(order.id, order);
        return order;
    }
    /**
     * Get order by ID
     * @param id - Order ID
     * @returns Promise<DeliveryOrder | null>
     */
    async getOrderById(id) {
        return this.orders.get(id) || null;
    }
    /**
     * Get order by tracking number
     * @param trackingNumber - Tracking number
     * @returns Promise<DeliveryOrder | null>
     */
    async getOrderByTrackingNumber(trackingNumber) {
        return Array.from(this.orders.values()).find(order => order.trackingNumber === trackingNumber) || null;
    }
    /**
     * Get all orders for a user
     * @param userId - User ID
     * @returns Promise<DeliveryOrder[]>
     */
    async getOrdersByUser(userId) {
        return Array.from(this.orders.values()).filter(order => order.userId === userId);
    }
    /**
     * Get all orders (admin only)
     * @returns Promise<DeliveryOrder[]>
     */
    async getAllOrders() {
        return Array.from(this.orders.values());
    }
    /**
     * Update order status
     * @param id - Order ID
     * @param status - New status
     * @param currentLocation - Optional current location
     * @returns Promise<DeliveryOrder | null>
     */
    async updateOrderStatus(id, status, currentLocation) {
        const order = this.orders.get(id);
        if (!order) {
            return null;
        }
        const updatedOrder = {
            ...order,
            status,
            currentLocation,
            updatedAt: new Date()
        };
        // Set actual delivery date if status is DELIVERED
        if (status === types_1.OrderStatus.DELIVERED) {
            updatedOrder.actualDelivery = new Date();
        }
        this.orders.set(id, updatedOrder);
        return updatedOrder;
    }
    /**
     * Update order destination
     * @param id - Order ID
     * @param destinationLocation - New destination
     * @returns Promise<DeliveryOrder | null>
     */
    async updateOrderDestination(id, destinationLocation) {
        const order = this.orders.get(id);
        if (!order) {
            return null;
        }
        // Can only change destination if order is still pending
        if (order.status !== types_1.OrderStatus.PENDING) {
            throw new Error('Cannot change destination for orders that are already in progress');
        }
        // Validate new location
        this.validateLocation(destinationLocation);
        // Recalculate distance and duration
        const distance = this.calculateDistance(order.pickupLocation, destinationLocation);
        const duration = this.calculateDuration(distance);
        // Get parcel to recalculate price
        const parcel = await this.parcelModel.getParcelById(order.parcelId);
        if (!parcel) {
            throw new Error('Parcel not found');
        }
        const price = this.calculatePrice(parcel.weight, distance);
        const updatedOrder = {
            ...order,
            destinationLocation,
            distance,
            duration,
            price,
            estimatedDelivery: new Date(Date.now() + duration * 60 * 1000),
            updatedAt: new Date()
        };
        this.orders.set(id, updatedOrder);
        return updatedOrder;
    }
    /**
     * Cancel order
     * @param id - Order ID
     * @returns Promise<DeliveryOrder | null>
     */
    async cancelOrder(id) {
        const order = this.orders.get(id);
        if (!order) {
            return null;
        }
        // Can only cancel if order is pending or picked up
        if (order.status === types_1.OrderStatus.DELIVERED || order.status === types_1.OrderStatus.CANCELLED) {
            throw new Error('Cannot cancel order that is already delivered or cancelled');
        }
        return this.updateOrderStatus(id, types_1.OrderStatus.CANCELLED);
    }
    /**
     * Calculate distance between two locations (Haversine formula)
     * @param location1 - First location
     * @param location2 - Second location
     * @returns number - Distance in kilometers
     */
    calculateDistance(location1, location2) {
        const R = 6371; // Earth's radius in kilometers
        const dLat = this.toRadians(location2.latitude - location1.latitude);
        const dLon = this.toRadians(location2.longitude - location1.longitude);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.toRadians(location1.latitude)) *
                Math.cos(this.toRadians(location2.latitude)) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
    /**
     * Convert degrees to radians
     * @param degrees - Degrees
     * @returns number - Radians
     */
    toRadians(degrees) {
        return degrees * (Math.PI / 180);
    }
    /**
     * Calculate estimated duration based on distance
     * @param distance - Distance in kilometers
     * @returns number - Duration in minutes
     */
    calculateDuration(distance) {
        // Assume average speed of 50 km/h for delivery
        return Math.ceil((distance / 50) * 60);
    }
    /**
     * Calculate price based on weight and distance
     * @param weight - Weight in kg
     * @param distance - Distance in km
     * @returns number - Price in USD
     */
    calculatePrice(weight, distance) {
        const weightCategory = this.getWeightCategory(weight);
        const weightMultiplier = this.pricingConfig.weightMultipliers[weightCategory];
        return this.pricingConfig.basePrice +
            (distance * this.pricingConfig.pricePerKm * weightMultiplier);
    }
    /**
     * Get weight category for pricing
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
     * Generate unique tracking number
     * @returns string - Tracking number
     */
    generateTrackingNumber() {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substring(2, 8);
        return `SIT${timestamp}${random}`.toUpperCase();
    }
    /**
     * Validate location data
     * @param location - Location to validate
     * @throws Error if validation fails
     */
    validateLocation(location) {
        if (!location.latitude || !location.longitude) {
            throw new Error('Latitude and longitude are required');
        }
        if (location.latitude < -90 || location.latitude > 90) {
            throw new Error('Invalid latitude');
        }
        if (location.longitude < -180 || location.longitude > 180) {
            throw new Error('Invalid longitude');
        }
        if (!location.address || location.address.trim().length === 0) {
            throw new Error('Address is required');
        }
    }
}
exports.OrderModel = OrderModel;
//# sourceMappingURL=Order.js.map