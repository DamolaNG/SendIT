/**
 * Parcel Controller
 * 
 * This controller handles parcel-related operations:
 * - Creating parcels
 * - Retrieving parcel information
 * - Updating parcel details
 * - Deleting parcels
 */

import { Request, Response } from 'express';
import { ParcelModel } from '../models/Parcel';
import { CreateParcelRequest, ApiResponse } from '../types';

export class ParcelController {
  private parcelModel: ParcelModel;

  constructor() {
    this.parcelModel = new ParcelModel();
  }

  /**
   * Create a new parcel
   * POST /api/parcels
   */
  createParcel = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
        return;
      }

      const parcelData: CreateParcelRequest = req.body;

      // Validate required fields
      if (!parcelData.description || !parcelData.weight || !parcelData.dimensions) {
        res.status(400).json({
          success: false,
          message: 'Description, weight, and dimensions are required'
        });
        return;
      }

      const parcel = await this.parcelModel.createParcel(userId, parcelData);

      res.status(201).json({
        success: true,
        data: parcel,
        message: 'Parcel created successfully'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to create parcel'
      });
    }
  };

  /**
   * Get all parcels for the authenticated user
   * GET /api/parcels
   */
  getParcels = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
        return;
      }

      const parcels = await this.parcelModel.getParcelsByUser(userId);

      res.status(200).json({
        success: true,
        data: parcels,
        message: 'Parcels retrieved successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve parcels'
      });
    }
  };

  /**
   * Get a specific parcel by ID
   * GET /api/parcels/:id
   */
  getParcelById = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.userId;
      const parcelId = req.params.id;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
        return;
      }

      const parcel = await this.parcelModel.getParcelById(parcelId);

      if (!parcel) {
        res.status(404).json({
          success: false,
          message: 'Parcel not found'
        });
        return;
      }

      // Check if parcel belongs to user
      if (parcel.userId !== userId) {
        res.status(403).json({
          success: false,
          message: 'Access denied'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: parcel,
        message: 'Parcel retrieved successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve parcel'
      });
    }
  };

  /**
   * Update a parcel
   * PUT /api/parcels/:id
   */
  updateParcel = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.userId;
      const parcelId = req.params.id;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
        return;
      }

      const parcel = await this.parcelModel.getParcelById(parcelId);

      if (!parcel) {
        res.status(404).json({
          success: false,
          message: 'Parcel not found'
        });
        return;
      }

      // Check if parcel belongs to user
      if (parcel.userId !== userId) {
        res.status(403).json({
          success: false,
          message: 'Access denied'
        });
        return;
      }

      const updates = req.body;
      const updatedParcel = await this.parcelModel.updateParcel(parcelId, updates);

      if (!updatedParcel) {
        res.status(500).json({
          success: false,
          message: 'Failed to update parcel'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: updatedParcel,
        message: 'Parcel updated successfully'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to update parcel'
      });
    }
  };

  /**
   * Delete a parcel
   * DELETE /api/parcels/:id
   */
  deleteParcel = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.userId;
      const parcelId = req.params.id;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
        return;
      }

      const parcel = await this.parcelModel.getParcelById(parcelId);

      if (!parcel) {
        res.status(404).json({
          success: false,
          message: 'Parcel not found'
        });
        return;
      }

      // Check if parcel belongs to user
      if (parcel.userId !== userId) {
        res.status(403).json({
          success: false,
          message: 'Access denied'
        });
        return;
      }

      const deleted = await this.parcelModel.deleteParcel(parcelId);

      if (!deleted) {
        res.status(500).json({
          success: false,
          message: 'Failed to delete parcel'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Parcel deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to delete parcel'
      });
    }
  };
}
