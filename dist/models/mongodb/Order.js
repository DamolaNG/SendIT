"use strict";
/**
 * MongoDB Order Model
 *
 * This file defines the DeliveryOrder schema for MongoDB using Mongoose.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const types_1 = require("../../types");
const LocationSchema = new mongoose_1.Schema({
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
const OrderSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    parcelId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Parcel',
        required: true,
        index: true
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
        enum: Object.values(types_1.OrderStatus),
        default: types_1.OrderStatus.PENDING,
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
OrderSchema.virtual('ageInDays').get(function () {
    return Math.floor((Date.now() - this.createdAt.getTime()) / (1000 * 60 * 60 * 24));
});
// Virtual for delivery status
OrderSchema.virtual('isDelivered').get(function () {
    return this.status === types_1.OrderStatus.DELIVERED;
});
// Pre-save middleware to generate tracking number
OrderSchema.pre('save', function (next) {
    if (this.isNew && !this.trackingNumber) {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substring(2, 8);
        this.trackingNumber = `SIT${timestamp}${random}`.toUpperCase();
    }
    next();
});
// Static method to find orders by user
OrderSchema.statics.findByUser = function (userId) {
    return this.find({ userId }).sort({ createdAt: -1 });
};
// Static method to find orders by status
OrderSchema.statics.findByStatus = function (status) {
    return this.find({ status }).sort({ createdAt: -1 });
};
// Static method to find orders by tracking number
OrderSchema.statics.findByTrackingNumber = function (trackingNumber) {
    return this.findOne({ trackingNumber });
};
// Static method to get order statistics
OrderSchema.statics.getStatistics = function () {
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
OrderSchema.methods.updateStatus = function (newStatus, currentLocation) {
    this.status = newStatus;
    if (currentLocation) {
        this.currentLocation = currentLocation;
    }
    if (newStatus === types_1.OrderStatus.DELIVERED) {
        this.actualDelivery = new Date();
    }
    return this.save();
};
exports.OrderModel = mongoose_1.default.model('Order', OrderSchema);
//# sourceMappingURL=Order.js.map