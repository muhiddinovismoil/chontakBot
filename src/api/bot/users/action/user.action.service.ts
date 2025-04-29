import { Action, Ctx, Hears, On, Update } from 'nestjs-telegraf';
import { InjectModel } from '@nestjs/mongoose';
import { Markup } from 'telegraf';
import {
  ContextType,
  dataSavedMsg,
  Media,
  replyDeletingDataTemplate,
} from '@/common';
import { Memorize, MemorizeDocument } from '@/core';

interface CallbackContextType extends ContextType {
  match: RegExpExecArray | null;
}

@Update()
export class UserActionService {
  constructor(
    @InjectModel(Memorize.name)
    private readonly memorizeModel: MemorizeDocument,
  ) {}
  @Hears("Qo'shish +")
  async onHear(@Ctx() ctx: ContextType) {
    ctx.scene.enter('BeginScene');
  }

  @Action(/acceptBtn/)
  async onAccept(@Ctx() ctx: ContextType) {
    const newData = new this.memorizeModel({
      key: ctx.session.key,
      content: ctx.session.lastText,
      type: ctx.session.media_type as Media,
      user_id: `${ctx.from?.id}`,
    });
    await newData.save();
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
      if (data.startsWith('delete_')) {
        const id = data.replace('delete_', '');
        const memorized = await this.memorizeModel.findById(id);
        ctx.reply(
          replyDeletingDataTemplate(
            memorized?.key as string,
            memorized?.content as string,
          ),
          {
            reply_markup: {
              inline_keyboard: [
                [Markup.button.callback("o'chirish", `deleteItem_${id}`)],
              ],
            },
          },
        );
      }
    }
  }
  @Action(/deleteItem_(\w+)/)
  async onDelete(@Ctx() ctx: CallbackContextType) {
    if (ctx.match && Array.isArray(ctx.match)) {
      const id = ctx.match[1];
      const memorized = await this.memorizeModel.findByIdAndDelete(id);
      ctx.reply(
        `O'chirish muvaffaqiyatli amalga oshdi!\n\nMa'lumot qo'shish uchun : /add\n\nMa'lumot o'chirish uchun : /delete\n\n Yordam olish uchun : /help`,
      );
    }
  }
}
