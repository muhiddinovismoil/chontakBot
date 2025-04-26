import {
  MemorizeEntity,
  MemorizeRepository,
  UserEntity,
  UserRepository,
} from '@/core';
import { InjectRepository } from '@nestjs/typeorm';

export class BotUpdate {
  constructor(
    @InjectRepository(UserEntity) userRepo: UserRepository,
    @InjectRepository(MemorizeEntity) memorizeRepo: MemorizeRepository,
  ) {}
}
