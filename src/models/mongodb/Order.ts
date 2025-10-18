/**
 * MongoDB Order Model
 * 
 * This file defines the DeliveryOrder schema for MongoDB using Mongoose.
 */

import mongoose, { Document, Schema } from 'mongoose';
import { DeliveryOrder, OrderStatus, Location } from '../../types';

export interface IOrder extends Document {
  userId: mongoose.Types.ObjectId;
  parcelId: mongoose.Types.ObjectId;
  pickupLocation: Location;
  destinationLocation: Location;
  currentLocation?: Location;
  status: OrderStatus;
  estimatedDelivery: Date;
  actualDelivery?: Date;
  distance?: number;
  duration?: number;
  price: number;
  trackingNumber: string;
  createdAt: Date;
  updatedAt: Date;
}

const LocationSchema = new Schema<Location>({
  latitude: {
    type: Number,
    required: true,
    min: -90,
    max: 90
  },
  longitude: {
    type: Number,
    required: true,
    min: -180,
    max: 180
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  city: {
    type: String,
    required: true,
    trim: true
  },
  state: {
    type: String,
    required: true,
    trim: true
  },
  country: {
    type: String,
    required: true,
    trim: true
  },
  postalCode: {
    type: String,
    required: true,
    trim: true
  }
}, { _id: false });

const OrderSchema = new Schema<IOrder>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  parcelId: {
    type: Schema.Types.ObjectId,
    ref: 'Parcel',
    required: true
  },
  pickupLocation: {
    type: LocationSchema,
    required: true
  },
  destinationLocation: {
    type: LocationSchema,
    required: true
  },
  currentLocation: {
    type: LocationSchema,
    required: false
  },
  status: {
    type: String,
    enum: Object.values(OrderStatus),
    default: OrderStatus.PENDING,
    index: true
  },
  estimatedDelivery: {
    type: Date,
    required: true
  },
  actualDelivery: {
    type: Date,
    required: false
  },
  distance: {
    type: Number,
    min: 0
  },
  duration: {
    type: Number,
    min: 0
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  trackingNumber: {
    type: String,
    required: true,
    unique: true,
    index: true
  }
}, {
  timestamps: true,
  collection: 'orders'
});

// Indexes for better query performance
OrderSchema.index({ userId: 1, createdAt: -1 });
OrderSchema.index({ status: 1 });
OrderSchema.index({ trackingNumber: 1 });
OrderSchema.index({ estimatedDelivery: 1 });
OrderSchema.index({ createdAt: -1 });

// Virtual for order age in days
OrderSchema.virtual('ageInDays').get(function() {
  return Math.floor((Date.now() - this.createdAt.getTime()) / (1000 * 60 * 60 * 24));
});

// Virtual for delivery status
OrderSchema.virtual('isDelivered').get(function() {
  return this.status === OrderStatus.DELIVERED;
});

// Pre-save middleware to generate tracking number
OrderSchema.pre('save', function(next) {
  if (this.isNew && !this.trackingNumber) {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    this.trackingNumber = `SIT${timestamp}${random}`.toUpperCase();
  }
  next();
});

// Static method to find orders by user
OrderSchema.statics.findByUser = function(userId: string) {
  return this.find({ userId }).sort({ createdAt: -1 });
};

// Static method to find orders by status
OrderSchema.statics.findByStatus = function(status: OrderStatus) {
  return this.find({ status }).sort({ createdAt: -1 });
};

// Static method to find orders by tracking number
OrderSchema.statics.findByTrackingNumber = function(trackingNumber: string) {
  return this.findOne({ trackingNumber });
};

// Static method to get order statistics
OrderSchema.statics.getStatistics = function() {
  return this.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalRevenue: { $sum: '$price' }
      }
    }
  ]);
};

// Instance method to update status
OrderSchema.methods.updateStatus = function(newStatus: OrderStatus, currentLocation?: Location) {
  this.status = newStatus;
  if (currentLocation) {
    this.currentLocation = currentLocation;
  }
  if (newStatus === OrderStatus.DELIVERED) {
    this.actualDelivery = new Date();
  }
  return this.save();
};

export const OrderModel = mongoose.model<IOrder>('Order', OrderSchema);
