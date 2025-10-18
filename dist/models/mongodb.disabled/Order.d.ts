/**
 * MongoDB Order Model
 *
 * This file defines the DeliveryOrder schema for MongoDB using Mongoose.
 */
import mongoose, { Document } from 'mongoose';
import { DeliveryOrder } from '../../types';
export interface IOrder extends Omit<DeliveryOrder, 'id'>, Document {
}
export declare const OrderModel: mongoose.Model<IOrder, {}, {}, {}, mongoose.Document<unknown, {}, IOrder, {}, {}> & IOrder & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=Order.d.ts.map