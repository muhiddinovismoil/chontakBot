import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { config, options } from '@/config';
import { BotModule } from '@/api/bot/bot.module';
import { TelegrafModule } from 'nestjs-telegraf';
@Module({
  imports: [
    TelegrafModule.forRootAsync(options()),
    MongooseModule.forRoot(config.DB_URI),
    BotModule,
  ],
})
export class AppModule {}
