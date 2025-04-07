import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';
import { options } from '@/config';
import { BotService } from './bot.service';
import { MemorizeEntity, UserEntity } from '@/core';
import { UsersModule } from './users/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, MemorizeEntity]),
    TelegrafModule.forRootAsync(options()),
    UsersModule,
  ],
  providers: [BotService],
})
export class BotModule {}
