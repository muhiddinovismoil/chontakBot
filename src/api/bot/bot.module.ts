import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';
import { options } from '@/config';
import { BotService } from './bot.service';
import { MemorizeEntity, UserEntity } from '@/core';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, MemorizeEntity]),
    TelegrafModule.forRootAsync(options()),
  ],
  providers: [BotService],
})
export class BotModule {}
