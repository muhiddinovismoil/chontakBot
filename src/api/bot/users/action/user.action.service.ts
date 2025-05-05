import { Action, Ctx, Hears, On, Update } from 'nestjs-telegraf';
import { InjectModel } from '@nestjs/mongoose';
import { Markup } from 'telegraf';
import {
  afterDeletionTemplate,
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
  async onEdit(@Ctx() ctx: ContextType) {
    ctx.session.isEditing = true;
    ctx.scene.enter('BeginScene');
  }

  @On('callback_query')
  async onCallbackQuery(@Ctx() ctx: CallbackContextType) {
    const callback = ctx.callbackQuery;
    if (!callback || !('data' in callback)) return;
    const data = callback.data;
    if (data.startsWith('delete_')) {
      const id = data.replace('delete_', '');
      const memorized = await this.memorizeModel.findById(id);
      if (memorized) {
        await ctx.reply(
          replyDeletingDataTemplate(memorized.key, memorized.content),
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
    if (data.startsWith('deleteItem_')) {
      const id = data.replace('deleteItem_', '');
      await this.memorizeModel.findByIdAndDelete(id);
      await ctx.reply(afterDeletionTemplate());
    }
  }
}
