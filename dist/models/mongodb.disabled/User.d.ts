/**
 * MongoDB User Model
 *
 * This file defines the User schema for MongoDB using Mongoose.
 * Replaces the in-memory User model with persistent storage.
 */
import mongoose, { Document } from 'mongoose';
import { User } from '../../types';
export interface IUser extends Omit<User, 'id'>, Document {
}
export declare const UserModel: mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser, {}, {}> & IUser & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=User.d.ts.map