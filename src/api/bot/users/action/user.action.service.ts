import { Action, Ctx, Hears, On, Update } from 'nestjs-telegraf';
import { InjectModel } from '@nestjs/mongoose';
import { Markup } from 'telegraf';
import * as general from '@/common';
import { Memorize, MemorizeDocument } from '@/core';

interface CallbackContextType extends general.ContextType {
  match: RegExpExecArray | null;
}

@Update()
export class UserActionService {
  constructor(
    @InjectModel(Memorize.name)
    private readonly memorizeModel: MemorizeDocument,
  ) {}
  @Hears("Qo'shish +")
  async onHear(@Ctx() ctx: general.ContextType) {
    ctx.session.adding = true;
    ctx.scene.enter('BeginScene');
  }
  @On('text')
  async onTextHandler(@Ctx() ctx: general.ContextType) {
    if (!ctx.session.adding) return;
    const message = ctx.message?.message_id;
    ctx.session.lastText = `${(ctx.update as any).message.text}`;
    ctx.session.lastMessage = message;
    ctx.session.media_type = general.Media.TEXT;
    ctx.scene.enter('AskKeyScene');
  }

  @On('photo')
  async onPhotoHandler(@Ctx() ctx: general.ContextType) {
    if (!ctx.session.adding) return;
    const photo = (ctx.update as any).message.photo;
    ctx.session.lastMessage = ctx.message?.message_id;
    ctx.session.lastText = photo[photo.length - 1]?.file_id;
    ctx.session.media_type = general.Media.PHOTO;
    ctx.scene.enter('AskKeyScene');
  }

  @On('audio')
  async onAudioHandler(@Ctx() ctx: general.ContextType) {
    if (!ctx.session.adding) return;
    const audio = (ctx.update as any).message.audio;
    ctx.session.lastMessage = ctx.message?.message_id;
    ctx.session.lastText = audio?.file_id;
    ctx.session.media_type = general.Media.AUDIO;
    ctx.scene.enter('AskKeyScene');
  }
  @On('animation')
  async onAnimationHandler(@Ctx() ctx: general.ContextType) {
    if (!ctx.session.adding) return;
    const animation = (ctx.update as any).message.animation;
    ctx.session.lastMessage = ctx.message?.message_id;
    ctx.session.lastText = animation?.file_id;
    ctx.session.media_type = general.Media.ANIMATION;
    ctx.scene.enter('AskKeyScene');
  }

  @On('document')
  async onFileHandler(@Ctx() ctx: general.ContextType) {
    if (!ctx.session.adding) return;
    const document = (ctx.update as any).message.document;
    ctx.session.lastMessage = ctx.message?.message_id;
    ctx.session.lastText = document?.file_id;
    ctx.session.media_type = general.Media.DOCUMENT;
    ctx.scene.enter('AskKeyScene');
  }

  @On('video')
  async onVideoHandler(@Ctx() ctx: general.ContextType) {
    if (!ctx.session.adding) return;
    const video = (ctx.update as any).message.video;
    ctx.session.lastMessage = ctx.message?.message_id;
    ctx.session.lastText = video.file_id;
    ctx.session.media_type = general.Media.VIDEO;
    ctx.scene.enter('AskKeyScene');
  }

  @On('sticker')
  async onStickerHandler(@Ctx() ctx: general.ContextType) {
    if (!ctx.session.adding) return;
    const sticker = (ctx.update as any).message.sticker;
    ctx.session.lastMessage = ctx.message?.message_id;
    ctx.session.lastText = sticker?.file_id;
    ctx.session.media_type = general.Media.STICKER;
    ctx.scene.enter('AskKeyScene');
  }

  @On('video_note')
  async onVideoNote(@Ctx() ctx: general.ContextType) {
    if (!ctx.session.adding) return;
    ctx.reply(general.incorrectDataInputMsg);
  }

  @On('voice')
  async onVoiceHandler(@Ctx() ctx: general.ContextType) {
    if (!ctx.session.adding) return;
    const voice = (ctx.update as any).message.voice;
    ctx.session.lastMessage = ctx.message?.message_id;
    ctx.session.lastText = voice?.file_id;
    ctx.session.media_type = general.Media.VOICE;
    ctx.scene.enter('AskKeyScene');
  }

  @On('location')
  async onLocationHandler(@Ctx() ctx: general.ContextType) {
    if (!ctx.session.adding) return;
    const location = (ctx.update as any).message.location;
    const { latitude, longitude }: general.LocationI = location;
    ctx.session.lastText = `${latitude}_${longitude}`;
    ctx.session.lastMessage = ctx.message?.message_id;
    ctx.session.media_type = general.Media.LOCATION;
    ctx.scene.enter('AskKeyScene');
  }

  @Action(/acceptBtn/)
  async onAccept(@Ctx() ctx: general.ContextType) {
    const newData = new this.memorizeModel({
      key: ctx.session.key,
      content: ctx.session.lastText,
      type: ctx.session.media_type as general.Media,
      user_id: `${ctx.from?.id}`,
    });
    await newData.save();
    await ctx.reply(general.dataSavedMsg, {
      parse_mode: 'HTML',
    });
  }

  @Action(/editBtn/)
  async onEdit(@Ctx() ctx: general.ContextType) {
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
          general.replyDeletingDataTemplate(memorized.key, memorized.content),
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
      await ctx.reply(general.afterDeletionTemplate());
    }
  }
}
