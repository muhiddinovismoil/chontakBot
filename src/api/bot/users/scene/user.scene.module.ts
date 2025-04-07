import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MemorizeEntity, UserEntity } from '@/core';
import { AskKeyScene, BeginScene } from './user.scene';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, MemorizeEntity])],
  providers: [BeginScene, AskKeyScene],
})
export class UserSceneModule {}
