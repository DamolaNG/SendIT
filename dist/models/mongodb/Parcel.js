"use strict";
/**
 * MongoDB Parcel Model
 *
 * This file defines the Parcel schema for MongoDB using Mongoose.
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
exports.ParcelModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const ParcelSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
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
ParcelSchema.virtual('volume').get(function () {
    return this.dimensions.length * this.dimensions.width * this.dimensions.height;
});
// Virtual for weight category
ParcelSchema.virtual('weightCategory').get(function () {
    if (this.weight <= 5)
        return 'light';
    if (this.weight <= 20)
        return 'medium';
    if (this.weight <= 50)
        return 'heavy';
    return 'extra_heavy';
});
// Pre-save validation
ParcelSchema.pre('save', function (next) {
    // Check if parcel is oversized
    const maxDimension = Math.max(this.dimensions.length, this.dimensions.width, this.dimensions.height);
    if (maxDimension > 150) {
        return next(new Error('Parcel dimensions exceed maximum allowed size (150cm)'));
    }
    next();
});
// Static method to find parcels by user
ParcelSchema.statics.findByUser = function (userId) {
    return this.find({ userId }).sort({ createdAt: -1 });
};
// Static method to find parcels by weight category
ParcelSchema.statics.findByWeightCategory = function (category) {
    const weightRanges = {
        light: { $lte: 5 },
        medium: { $gt: 5, $lte: 20 },
        heavy: { $gt: 20, $lte: 50 },
        extra_heavy: { $gt: 50 }
    };
    return this.find({ weight: weightRanges[category] });
};
exports.ParcelModel = mongoose_1.default.model('Parcel', ParcelSchema);
//# sourceMappingURL=Parcel.js.map