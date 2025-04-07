import { Module } from '@nestjs/common';
import { UserActionModule } from './action/user.action.module';
import { UserSceneModule } from './scene/user.scene.module';

@Module({
  imports: [UserActionModule, UserSceneModule],
  providers: [],
})
export class UsersModule {}
