/**
 * MongoDB Parcel Model
 *
 * This file defines the Parcel schema for MongoDB using Mongoose.
 */
import mongoose, { Document } from 'mongoose';
import { Parcel } from '../../types';
export interface IParcel extends Omit<Parcel, 'id'>, Document {
}
export declare const ParcelModel: mongoose.Model<IParcel, {}, {}, {}, mongoose.Document<unknown, {}, IParcel, {}, {}> & IParcel & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=Parcel.d.ts.map