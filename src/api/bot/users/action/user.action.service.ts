import { Action, Ctx, Hears, Update } from 'nestjs-telegraf';
import { InjectRepository } from '@nestjs/typeorm';
import { ContextType, dataSavedMsg, Media } from '@/common';
import { MemorizeEntity, MemorizeRepository } from '@/core';

@Update()
export class UserActionService {
  constructor(
    @InjectRepository(MemorizeEntity)
    private readonly memorizeRepo: MemorizeRepository,
  ) {}
  @Hears("Qo'shish +")
  async onHear(@Ctx() ctx: ContextType) {
    ctx.scene.enter('BeginScene');
  }

  @Action(/acceptBtn/)
  async onAccept(@Ctx() ctx: ContextType) {
    const newData = this.memorizeRepo.create({
      key: ctx.session.key,
      content: ctx.session.lastText,
      type: ctx.session.media_type as Media,
      user_id: `${ctx.from?.id}`,
    });
    await this.memorizeRepo.save(newData);
    await ctx.reply(dataSavedMsg, {
      parse_mode: 'HTML',
    });
  }

  @Action(/editBtn/)
  async onEdit(@Ctx() ctx: ContextType) {}
}
