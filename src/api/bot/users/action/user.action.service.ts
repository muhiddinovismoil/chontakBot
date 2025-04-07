import { ContextType } from '@/common';
import { Ctx, Hears, Update } from 'nestjs-telegraf';

@Update()
export class UserActionService {
  @Hears("Qo'shish +")
  async onHear(@Ctx() ctx: ContextType) {
    ctx.scene.enter('BeginScene');
  }
}
