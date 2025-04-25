import { ContextType } from '@/common';
import { Action, Ctx, Hears, Update } from 'nestjs-telegraf';

@Update()
export class UserActionService {
  @Hears("Qo'shish +")
  async onHear(@Ctx() ctx: ContextType) {
    ctx.scene.enter('BeginScene');
  }

  @Action(/acceptBtn/)
  async onAccept(@Ctx() ctx: ContextType) {
    ctx.reply('accept');
  }

  @Action(/editBtn/)
  async onEdit(@Ctx() ctx: ContextType) {
    ctx.reply('edit');
  }
}
