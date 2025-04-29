import { InjectRepository } from '@nestjs/typeorm';
import {
  MemorizeEntity,
  MemorizeRepository,
  UserEntity,
  UserRepository,
} from '@/core';

export class BotUpdate {
  constructor(
    @InjectRepository(UserEntity) userRepo: UserRepository,
    @InjectRepository(MemorizeEntity) memorizeRepo: MemorizeRepository,
  ) {}
}
