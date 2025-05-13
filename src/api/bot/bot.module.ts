import { Module } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';
import { MongooseModule } from '@nestjs/mongoose';
import { Memorize, MemorizeSchema, User, UserSchema } from '@/core';
import { options } from '@/config';
import { BotService } from './bot.service';
import { UsersModule } from './users/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Memorize.name, schema: MemorizeSchema },
    ]),
    TelegrafModule.forRootAsync(options()),
    UsersModule,
  ],
  providers: [BotService],
  exports: [TelegrafModule],
})
export class BotModule {}
