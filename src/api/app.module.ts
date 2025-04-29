import { Module } from '@nestjs/common';
import { config } from '@/config';
import { BotModule } from './bot/bot.module';
import { MongooseModule } from '@nestjs/mongoose';
@Module({
  imports: [MongooseModule.forRoot(config.DB_URI), BotModule],
})
export class AppModule {}
