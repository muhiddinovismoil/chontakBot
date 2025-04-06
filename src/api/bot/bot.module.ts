import { Module } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';
import { options } from 'src/config';
import { BotService } from './bot.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([]),
    TelegrafModule.forRootAsync(options()),
  ],
  providers: [BotService],
})
export class BotModule {}
