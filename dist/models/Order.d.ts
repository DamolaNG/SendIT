/**
 * Order Model
 *
 * This class handles delivery order operations:
 * - Creating and managing delivery orders
 * - Tracking order status
 * - Calculating pricing
 * - Generating tracking numbers
 */
import { DeliveryOrder, CreateOrderRequest, OrderStatus, Location } from '../types';
export declare class OrderModel {
    private orders;
    private parcelModel;
    private pricingConfig;
    constructor();
    /**
     * Create a new delivery order
     * @param userId - ID of the user creating the order
     * @param orderData - Order data
     * @returns Promise<DeliveryOrder> - Created order
     */
    createOrder(userId: string, orderData: CreateOrderRequest): Promise<DeliveryOrder>;
    /**
     * Get order by ID
     * @param id - Order ID
     * @returns Promise<DeliveryOrder | null>
     */
    getOrderById(id: string): Promise<DeliveryOrder | null>;
    /**
     * Get order by tracking number
     * @param trackingNumber - Tracking number
     * @returns Promise<DeliveryOrder | null>
     */
    getOrderByTrackingNumber(trackingNumber: string): Promise<DeliveryOrder | null>;
    /**
     * Get all orders for a user
     * @param userId - User ID
     * @returns Promise<DeliveryOrder[]>
     */
    getOrdersByUser(userId: string): Promise<DeliveryOrder[]>;
    /**
     * Get all orders (admin only)
     * @returns Promise<DeliveryOrder[]>
     */
    getAllOrders(): Promise<DeliveryOrder[]>;
    /**
     * Update order status
     * @param id - Order ID
     * @param status - New status
     * @param currentLocation - Optional current location
     * @returns Promise<DeliveryOrder | null>
     */
    updateOrderStatus(id: string, status: OrderStatus, currentLocation?: Location): Promise<DeliveryOrder | null>;
    /**
     * Update order destination
     * @param id - Order ID
     * @param destinationLocation - New destination
     * @returns Promise<DeliveryOrder | null>
     */
    updateOrderDestination(id: string, destinationLocation: Location): Promise<DeliveryOrder | null>;
    /**
     * Cancel order
     * @param id - Order ID
     * @returns Promise<DeliveryOrder | null>
     */
    cancelOrder(id: string): Promise<DeliveryOrder | null>;
    /**
     * Calculate distance between two locations (Haversine formula)
     * @param location1 - First location
     * @param location2 - Second location
     * @returns number - Distance in kilometers
     */
    private calculateDistance;
    /**
     * Convert degrees to radians
     * @param degrees - Degrees
     * @returns number - Radians
     */
    private toRadians;
    /**
     * Calculate estimated duration based on distance
     * @param distance - Distance in kilometers
     * @returns number - Duration in minutes
     */
    private calculateDuration;
    /**
     * Calculate price based on weight and distance
     * @param weight - Weight in kg
     * @param distance - Distance in km
     * @returns number - Price in USD
     */
    private calculatePrice;
    /**
     * Get weight category for pricing
     * @param weight - Weight in kg
     * @returns WeightCategory
     */
    private getWeightCategory;
    /**
     * Generate unique tracking number
     * @returns string - Tracking number
     */
    private generateTrackingNumber;
    /**
     * Validate location data
     * @param location - Location to validate
     * @throws Error if validation fails
     */
    private validateLocation;
}
//# sourceMappingURL=Order.d.ts.map