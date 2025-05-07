import { Model } from 'mongoose';
import { User } from '../schema';

export type UserDocument = Model<User>;
