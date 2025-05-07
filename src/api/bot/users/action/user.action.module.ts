import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Memorize, MemorizeSchema, User, UserSchema } from '@/core';
import { UserActionService } from './user.action.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Memorize.name, schema: MemorizeSchema },
    ]),
  ],
  providers: [UserActionService],
})
export class UserActionModule {}
