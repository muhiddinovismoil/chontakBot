import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MemorizeEntity, UserEntity } from '@/core';
import { UserActionService } from './user.action.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, MemorizeEntity])],
  providers: [UserActionService],
})
export class UserActionModule {}
