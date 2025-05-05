import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { config } from '@/config';
import { BotModule } from './bot/bot.module';
@Module({
  imports: [MongooseModule.forRoot(config.DB_URI), BotModule],
})
export class AppModule {}
