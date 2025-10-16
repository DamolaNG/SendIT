/**
 * Order Controller
 * 
 * This controller handles delivery order operations:
 * - Creating delivery orders
 * - Tracking orders
 * - Updating order status (admin)
 * - Managing order destinations
 */

import { Request, Response } from 'express';
import { OrderModel } from '../models/Order';
import { CreateOrderRequest, UpdateOrderDestinationRequest, UpdateOrderStatusRequest } from '../types';

export class OrderController {
  private orderModel: OrderModel;

  constructor() {
    this.orderModel = new OrderModel();
  }

  /**
   * Create a new delivery order
   * POST /api/orders
   */
  createOrder = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
        return;
      }

      const orderData: CreateOrderRequest = req.body;

      // Validate required fields
      if (!orderData.parcelId || !orderData.pickupLocation || !orderData.destinationLocation) {
        res.status(400).json({
          success: false,
          message: 'Parcel ID, pickup location, and destination location are required'
        });
        return;
      }

      const order = await this.orderModel.createOrder(userId, orderData);

      res.status(201).json({
        success: true,
        data: order,
        message: 'Order created successfully'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to create order'
      });
    }
  };

  /**
   * Get all orders for the authenticated user
   * GET /api/orders
   */
  getOrders = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
        return;
      }

      const orders = await this.orderModel.getOrdersByUser(userId);

      res.status(200).json({
        success: true,
        data: orders,
        message: 'Orders retrieved successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve orders'
      });
    }
  };

  /**
   * Get a specific order by ID
   * GET /api/orders/:id
   */
  getOrderById = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.userId;
      const orderId = req.params.id;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
        return;
      }

      const order = await this.orderModel.getOrderById(orderId);

      if (!order) {
        res.status(404).json({
          success: false,
          message: 'Order not found'
        });
        return;
      }

      // Check if order belongs to user (unless admin)
      if (order.userId !== userId && req.user?.role !== 'admin') {
        res.status(403).json({
          success: false,
          message: 'Access denied'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: order,
        message: 'Order retrieved successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve order'
      });
    }
  };

  /**
   * Track order by tracking number
   * GET /api/orders/track/:trackingNumber
   */
  trackOrder = async (req: Request, res: Response): Promise<void> => {
    try {
      const trackingNumber = req.params.trackingNumber;

      const order = await this.orderModel.getOrderByTrackingNumber(trackingNumber);

      if (!order) {
        res.status(404).json({
          success: false,
          message: 'Order not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: order,
        message: 'Order tracking information retrieved successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to track order'
      });
    }
  };

  /**
   * Update order destination
   * PUT /api/orders/:id/destination
   */
  updateOrderDestination = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.userId;
      const orderId = req.params.id;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
        return;
      }

      const order = await this.orderModel.getOrderById(orderId);

      if (!order) {
        res.status(404).json({
          success: false,
          message: 'Order not found'
        });
        return;
      }

      // Check if order belongs to user
      if (order.userId !== userId) {
        res.status(403).json({
          success: false,
          message: 'Access denied'
        });
        return;
      }

      const destinationData: UpdateOrderDestinationRequest = req.body;

      if (!destinationData.destinationLocation) {
        res.status(400).json({
          success: false,
          message: 'Destination location is required'
        });
        return;
      }

      const updatedOrder = await this.orderModel.updateOrderDestination(
        orderId, 
        destinationData.destinationLocation
      );

      if (!updatedOrder) {
        res.status(500).json({
          success: false,
          message: 'Failed to update order destination'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: updatedOrder,
        message: 'Order destination updated successfully'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to update order destination'
      });
    }
  };

  /**
   * Cancel an order
   * PUT /api/orders/:id/cancel
   */
  cancelOrder = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.userId;
      const orderId = req.params.id;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
        return;
      }

      const order = await this.orderModel.getOrderById(orderId);

      if (!order) {
        res.status(404).json({
          success: false,
          message: 'Order not found'
        });
        return;
      }

      // Check if order belongs to user
      if (order.userId !== userId) {
        res.status(403).json({
          success: false,
          message: 'Access denied'
        });
        return;
      }

      const cancelledOrder = await this.orderModel.cancelOrder(orderId);

      if (!cancelledOrder) {
        res.status(500).json({
          success: false,
          message: 'Failed to cancel order'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: cancelledOrder,
        message: 'Order cancelled successfully'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to cancel order'
      });
    }
  };

  /**
   * Update order status (admin only)
   * PUT /api/orders/:id/status
   */
  updateOrderStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      const orderId = req.params.id;
      const statusData: UpdateOrderStatusRequest = req.body;

      if (!statusData.status) {
        res.status(400).json({
          success: false,
          message: 'Status is required'
        });
        return;
      }

      const updatedOrder = await this.orderModel.updateOrderStatus(
        orderId,
        statusData.status,
        statusData.currentLocation
      );

      if (!updatedOrder) {
        res.status(404).json({
          success: false,
          message: 'Order not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: updatedOrder,
        message: 'Order status updated successfully'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to update order status'
      });
    }
  };

  /**
   * Get all orders (admin only)
   * GET /api/orders/all
   */
  getAllOrders = async (_req: Request, res: Response): Promise<void> => {
    try {
      const orders = await this.orderModel.getAllOrders();

      res.status(200).json({
        success: true,
        data: orders,
        message: 'All orders retrieved successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve orders'
      });
    }
  };
}
