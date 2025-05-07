import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Memorize, MemorizeSchema, User, UserSchema } from '@/core';
import { AskKeyAgainScene, AskKeyScene, BeginScene } from './user.scene';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Memorize.name, schema: MemorizeSchema },
    ]),
  ],
  providers: [BeginScene, AskKeyScene, AskKeyAgainScene],
})
export class UserSceneModule {}
