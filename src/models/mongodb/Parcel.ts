/**
 * MongoDB Parcel Model
 * 
 * This file defines the Parcel schema for MongoDB using Mongoose.
 */

import mongoose, { Document, Schema } from 'mongoose';
import { Parcel } from '../../types';

export interface IParcel extends Parcel, Document {}

const ParcelSchema = new Schema<IParcel>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500
  },
  weight: {
    type: Number,
    required: true,
    min: 0.1,
    max: 100
  },
  dimensions: {
    length: {
      type: Number,
      required: true,
      min: 1,
      max: 150
    },
    width: {
      type: Number,
      required: true,
      min: 1,
      max: 150
    },
    height: {
      type: Number,
      required: true,
      min: 1,
      max: 150
    }
  },
  value: {
    type: Number,
    required: true,
    min: 0
  },
  fragile: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  collection: 'parcels'
});

// Indexes
ParcelSchema.index({ userId: 1 });
ParcelSchema.index({ createdAt: -1 });
ParcelSchema.index({ weight: 1 });

// Virtual for volume calculation
ParcelSchema.virtual('volume').get(function() {
  return this.dimensions.length * this.dimensions.width * this.dimensions.height;
});

// Virtual for weight category
ParcelSchema.virtual('weightCategory').get(function() {
  if (this.weight <= 5) return 'light';
  if (this.weight <= 20) return 'medium';
  if (this.weight <= 50) return 'heavy';
  return 'extra_heavy';
});

// Pre-save validation
ParcelSchema.pre('save', function(next) {
  // Check if parcel is oversized
  const maxDimension = Math.max(this.dimensions.length, this.dimensions.width, this.dimensions.height);
  if (maxDimension > 150) {
    return next(new Error('Parcel dimensions exceed maximum allowed size (150cm)'));
  }
  next();
});

// Static method to find parcels by user
ParcelSchema.statics.findByUser = function(userId: string) {
  return this.find({ userId }).sort({ createdAt: -1 });
};

// Static method to find parcels by weight category
ParcelSchema.statics.findByWeightCategory = function(category: string) {
  const weightRanges = {
    light: { $lte: 5 },
    medium: { $gt: 5, $lte: 20 },
    heavy: { $gt: 20, $lte: 50 },
    extra_heavy: { $gt: 50 }
  };
  
  return this.find({ weight: weightRanges[category as keyof typeof weightRanges] });
};

export const ParcelModel = mongoose.model<IParcel>('Parcel', ParcelSchema);
