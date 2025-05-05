import { Action, Ctx, Hears, On, Update } from 'nestjs-telegraf';
import { InjectModel } from '@nestjs/mongoose';
import { Memorize, MemorizeDocument } from '@/core';
import * as general from '@/common';

@Update()
export class UserActionService {
  private readonly keyboardOptions = {
    reply_markup: {
      keyboard: [["Qo'shish +"]],
      resize_keyboard: true,
      force_reply: true,
      one_time_keyboard: true,
    },
    parse_mode: general.ParseMode.HTML,
  };

  constructor(
    @InjectModel(Memorize.name)
    private readonly memorizeModel: MemorizeDocument,
  ) {}

  // Helper method to handle the 'deleting' check and sending reply
  private handleDeletingState(ctx: general.ContextType) {
    if (ctx.session.deleting && !ctx.session.adding) {
      ctx.reply(general.askToPressAddButtonMsg, this.keyboardOptions);
    }
  }

  // Helper method for handling media input
  private async handleMediaInput(ctx: general.ContextType, mediaType: string) {
    if (!ctx.session.adding) return;

    const media = (ctx.update as any).message[mediaType];
    ctx.session.lastMessage = ctx.message?.message_id;
    ctx.session.lastText = media?.file_id;
    ctx.session.media_type = general.Media[mediaType.toUpperCase()];
    ctx.scene.enter('AskKeyScene');
  }

  @Hears("Qo'shish +")
  async onHear(@Ctx() ctx: general.ContextType) {
    ctx.session.adding = true;
    ctx.scene.enter('BeginScene');
  }

  @On('text')
  async onTextHandler(@Ctx() ctx: general.ContextType) {
    this.handleDeletingState(ctx);
    if (!ctx.session.adding) return;
    ctx.session.lastText = `${(ctx.update as any).message.text}`;
    ctx.session.lastMessage = ctx.message?.message_id;
    ctx.session.media_type = general.Media.TEXT;
    ctx.scene.enter('AskKeyScene');
  }

  @On('photo')
  async onPhotoHandler(@Ctx() ctx: general.ContextType) {
    this.handleDeletingState(ctx);
    await this.handleMediaInput(ctx, 'photo');
  }

  @On('audio')
  async onAudioHandler(@Ctx() ctx: general.ContextType) {
    this.handleDeletingState(ctx);
    await this.handleMediaInput(ctx, 'audio');
  }

  @On('animation')
  async onAnimationHandler(@Ctx() ctx: general.ContextType) {
    this.handleDeletingState(ctx);
    await this.handleMediaInput(ctx, 'animation');
  }

  @On('document')
  async onFileHandler(@Ctx() ctx: general.ContextType) {
    this.handleDeletingState(ctx);
    await this.handleMediaInput(ctx, 'document');
  }

  @On('video')
  async onVideoHandler(@Ctx() ctx: general.ContextType) {
    this.handleDeletingState(ctx);
    await this.handleMediaInput(ctx, 'video');
  }

  @On('sticker')
  async onStickerHandler(@Ctx() ctx: general.ContextType) {
    this.handleDeletingState(ctx);
    await this.handleMediaInput(ctx, 'sticker');
  }

  @On('video_note')
  async onVideoNote(@Ctx() ctx: general.ContextType) {
    this.handleDeletingState(ctx);
    ctx.reply(general.incorrectDataInputMsg);
  }

  @On('voice')
  async onVoiceHandler(@Ctx() ctx: general.ContextType) {
    this.handleDeletingState(ctx);
    await this.handleMediaInput(ctx, 'voice');
  }

  @On('location')
  async onLocationHandler(@Ctx() ctx: general.ContextType) {
    this.handleDeletingState(ctx);
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
    await ctx.reply(general.dataSavedMsg, { parse_mode: 'HTML' });
  }

  @Action(/editBtn/)
  async onEdit(@Ctx() ctx: general.ContextType) {
    ctx.session.isEditing = true;
    ctx.scene.enter('BeginScene');
  }

  @On('callback_query')
  async onCallbackQuery(@Ctx() ctx: general.CallbackContextType) {
    const callback = ctx.callbackQuery;
    if (!callback || !('data' in callback)) return;

    const data = callback.data;
    ctx.session.adding = false;

    if (data.startsWith('delete_')) {
      const id = data.replace('delete_', '');
      const memorized = await this.memorizeModel.findById(id);
      if (memorized) {
        await general.replyMedia(
          ctx,
          memorized.type,
          memorized.content,
          memorized.key,
          "o'chirish",
          `deleteItem_${id}`,
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
