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
export declare class ParcelController {
    private parcelModel;
    constructor();
    /**
     * Create a new parcel
     * POST /api/parcels
     */
    createParcel: (req: Request, res: Response) => Promise<void>;
    /**
     * Get all parcels for the authenticated user
     * GET /api/parcels
     */
    getParcels: (req: Request, res: Response) => Promise<void>;
    /**
     * Get a specific parcel by ID
     * GET /api/parcels/:id
     */
    getParcelById: (req: Request, res: Response) => Promise<void>;
    /**
     * Update a parcel
     * PUT /api/parcels/:id
     */
    updateParcel: (req: Request, res: Response) => Promise<void>;
    /**
     * Delete a parcel
     * DELETE /api/parcels/:id
     */
    deleteParcel: (req: Request, res: Response) => Promise<void>;
}
//# sourceMappingURL=ParcelController.d.ts.map