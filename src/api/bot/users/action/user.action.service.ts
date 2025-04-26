import { ContextType, dataSavedMsg } from '@/common';
import { MemorizeEntity, MemorizeRepository, UserRepository } from '@/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Action, Ctx, Hears, Update } from 'nestjs-telegraf';

@Update()
export class UserActionService {
  constructor(
    @InjectRepository(MemorizeEntity) memorizeRepo: MemorizeRepository,
  ) {}
  @Hears("Qo'shish +")
  async onHear(@Ctx() ctx: ContextType) {
    ctx.scene.enter('BeginScene');
  }

  @Action(/acceptBtn/)
  async onAccept(@Ctx() ctx: ContextType) {
    ctx.reply(dataSavedMsg, {
      parse_mode: 'HTML',
    });
  }

  @Action(/editBtn/)
  async onEdit(@Ctx() ctx: ContextType) {}
}
