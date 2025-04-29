import { HydratedDocument } from 'mongoose';
import { User } from '../schema';

export type UserDocument = HydratedDocument<User>;
