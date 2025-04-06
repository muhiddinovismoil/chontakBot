import { Repository } from 'typeorm';
import { UserEntity } from '@/core';

export type UserRepository = Repository<UserEntity>;
