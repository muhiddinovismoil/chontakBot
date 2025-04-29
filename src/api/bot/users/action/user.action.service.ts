import { Action, Ctx, Hears, On, Update } from 'nestjs-telegraf';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ContextType,
  dataSavedMsg,
  Media,
  replyDeletingDataTemplate,
} from '@/common';
import { MemorizeEntity, MemorizeRepository } from '@/core';
import { ObjectId } from 'mongodb';
import { Markup } from 'telegraf';

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

  @On('callback_query')
  async handleCallBackQuery(@Ctx() ctx: ContextType) {
    const callback = ctx.callbackQuery;
    if (callback && 'data' in callback) {
      const data = callback.data;
      console.log(data);
      if (data.startsWith('delete_')) {
        const id = new ObjectId(data.replace('delete_', ''));
        console.log(await this.memorizeRepo.find());
        const memorized = await this.memorizeRepo.findOne({
          where: {
            id,
          },
        });

        console.log(memorized);
        // ctx.reply(
        //   replyDeletingDataTemplate(
        //     memorized?.key as string,
        //     memorized?.content as string,
        //   ),
        //   {
        //     reply_markup: {
        //       inline_keyboard: [
        //         [Markup.button.callback("o'chirish", 'deleteItem')],
        //       ],
        //     },
        //   },
        // );
      }
    }
  }
  @Action(/deleteItem/)
  async onDelete(@Ctx() ctx: ContextType) {}
}
