import { Ctx, Hears, On, Scene, SceneEnter } from 'nestjs-telegraf';
import * as general from '@/common';
import { Memorize, MemorizeDocument, User, UserDocument } from '@/core';
import { InjectModel } from '@nestjs/mongoose';

@Scene('BeginScene')
export class BeginScene {
  constructor(
    @InjectModel(Memorize.name)
    private readonly memorizeModel: MemorizeDocument,
    @InjectModel(User.name)
    private readonly userModel: UserDocument,
  ) {}
  @SceneEnter()
  async onEnter(ctx: general.ContextType) {
    const isEditing = ctx.session.isEditing;
    if (!isEditing) {
      ctx.reply(general.askContentMsg, {
        reply_markup: {
          remove_keyboard: true,
        },
      });
    } else {
      ctx.reply(general.editAskContentMsg, {
        reply_markup: {
          remove_keyboard: true,
        },
      });
    }
  }

  @Hears('/start')
  async onStart(@Ctx() ctx: general.ContextType) {
    ctx.session.adding = false;
    ctx.session.deleting = false;
    const user = await this.userModel.findOne({
      telegram_id: `${ctx.from?.id}`,
    });
    await ctx.reply(
      `Assalamu alaykum, ${ctx.from?.first_name ?? user?.first_name}${user?.last_name != undefined ? ' ' + user.last_name + ' ' : ' '}🎉`,
    );
    await ctx.reply(general.startMessage, {
      reply_markup: {
        keyboard: [["Qo'shish +"]],
        resize_keyboard: true,
        force_reply: true,
        one_time_keyboard: true,
      },
      parse_mode: 'HTML',
    });
  }

  @Hears('/help')
  async onHelp(@Ctx() ctx: general.ContextType) {
    await ctx.reply(general.helpMessage);
  }

  @Hears('/add')
  async onAdd(@Ctx() ctx: general.ContextType) {
    ctx.session.adding = true;
    await ctx.scene.enter('BeginScene');
  }

  @Hears('/delete')
  async onDelete(@Ctx() ctx: general.ContextType) {
    ctx.session.deleting = true;
    const allData = await this.memorizeModel
      .find({
        user_id: `${ctx.from?.id}`,
      })
      .select('key _id');
    if (allData.length == 0) {
      await ctx.reply(general.noDataToDeleteMsg);
      return;
    }
    await ctx.reply(general.askWhichDataToDeleteMsg, {
      reply_markup: {
        inline_keyboard: general.keyboardBuilder(allData),
      },
    });
  }

  @On('text')
  async onTextHandler(@Ctx() ctx: general.ContextType) {
    const message = ctx.message?.message_id;
    ctx.session.lastText = `${(ctx.update as any).message.text}`;
    ctx.session.lastMessage = message;
    ctx.session.media_type = general.Media.TEXT;
    ctx.scene.enter('AskKeyScene');
  }

  @On('photo')
  async onPhotoHandler(@Ctx() ctx: general.ContextType) {
    const photo = (ctx.update as any).message.photo;
    ctx.session.lastMessage = ctx.message?.message_id;
    ctx.session.lastText = photo[photo.length - 1]?.file_id;
    ctx.session.media_type = general.Media.PHOTO;
    ctx.scene.enter('AskKeyScene');
  }

  @On('audio')
  async onAudioHandler(@Ctx() ctx: general.ContextType) {
    const audio = (ctx.update as any).message.audio;
    ctx.session.lastMessage = ctx.message?.message_id;
    ctx.session.lastText = audio?.file_id;
    ctx.session.media_type = general.Media.AUDIO;
    ctx.scene.enter('AskKeyScene');
  }
  @On('animation')
  async onAnimationHandler(@Ctx() ctx: general.ContextType) {
    const animation = (ctx.update as any).message.animation;
    ctx.session.lastMessage = ctx.message?.message_id;
    ctx.session.lastText = animation?.file_id;
    ctx.session.media_type = general.Media.ANIMATION;
    ctx.scene.enter('AskKeyScene');
  }

  @On('document')
  async onFileHandler(@Ctx() ctx: general.ContextType) {
    const document = (ctx.update as any).message.document;
    ctx.session.lastMessage = ctx.message?.message_id;
    ctx.session.lastText = document?.file_id;
    ctx.session.media_type = general.Media.DOCUMENT;
    ctx.scene.enter('AskKeyScene');
  }

  @On('video')
  async onVideoHandler(@Ctx() ctx: general.ContextType) {
    const video = (ctx.update as any).message.video;
    ctx.session.lastMessage = ctx.message?.message_id;
    ctx.session.lastText = video.file_id;
    ctx.session.media_type = general.Media.VIDEO;
    ctx.scene.enter('AskKeyScene');
  }

  @On('sticker')
  async onStickerHandler(@Ctx() ctx: general.ContextType) {
    const sticker = (ctx.update as any).message.sticker;
    ctx.session.lastMessage = ctx.message?.message_id;
    ctx.session.lastText = sticker?.file_id;
    ctx.session.media_type = general.Media.STICKER;
    ctx.scene.enter('AskKeyScene');
  }

  @On('video_note')
  async onVideoNote(@Ctx() ctx: general.ContextType) {
    ctx.reply(general.incorrectDataInputMsg);
  }

  @On('voice')
  async onVoiceHandler(@Ctx() ctx: general.ContextType) {
    const voice = (ctx.update as any).message.voice;
    ctx.session.lastMessage = ctx.message?.message_id;
    ctx.session.lastText = voice?.file_id;
    ctx.session.media_type = general.Media.VOICE;
    ctx.scene.enter('AskKeyScene');
  }

  @On('location')
  async onLocationHandler(@Ctx() ctx: general.ContextType) {
    const location = (ctx.update as any).message.location;
    const { latitude, longitude }: general.LocationI = location;
    ctx.session.lastText = `${latitude}_${longitude}`;
    ctx.session.lastMessage = ctx.message?.message_id;
    ctx.session.media_type = general.Media.LOCATION;
    ctx.scene.enter('AskKeyScene');
  }
}
@Scene('AskKeyScene')
export class AskKeyScene {
  constructor(
    @InjectModel(Memorize.name)
    private readonly memorizeModel: MemorizeDocument,
    @InjectModel(User.name)
    private readonly userModel: UserDocument,
  ) {}
  @SceneEnter()
  async onEnter(ctx: general.ContextType) {
    ctx.reply(general.askContentKeyMsg, {
      parse_mode: 'HTML',
      reply_parameters: {
        message_id: ctx.session.lastMessage,
      },
    });
  }

  @Hears('/start')
  async onStart(@Ctx() ctx: general.ContextType) {
    ctx.session.adding = false;
    ctx.session.deleting = false;
    const user = await this.userModel.findOne({
      telegram_id: `${ctx.from?.id}`,
    });
    await ctx.reply(
      `Assalamu alaykum, ${ctx.from?.first_name ?? user?.first_name}${user?.last_name != undefined ? ' ' + user.last_name + ' ' : ' '}🎉`,
    );
    await ctx.reply(general.startMessage, {
      reply_markup: {
        keyboard: [["Qo'shish +"]],
        resize_keyboard: true,
        force_reply: true,
        one_time_keyboard: true,
      },
      parse_mode: 'HTML',
    });
  }

  @Hears('/help')
  async onHelp(@Ctx() ctx: general.ContextType) {
    await ctx.reply(general.helpMessage);
  }

  @Hears('/add')
  async onAdd(@Ctx() ctx: general.ContextType) {
    ctx.session.adding = true;
    await ctx.scene.enter('BeginScene');
  }

  @Hears('/delete')
  async onDelete(@Ctx() ctx: general.ContextType) {
    ctx.session.deleting = true;
    const allData = await this.memorizeModel
      .find({
        user_id: `${ctx.from?.id}`,
      })
      .select('key _id');
    if (allData.length == 0) {
      await ctx.reply(general.noDataToDeleteMsg);
      return;
    }
    await ctx.reply(general.askWhichDataToDeleteMsg, {
      reply_markup: {
        inline_keyboard: general.keyboardBuilder(allData),
      },
    });
  }

  @On('message')
  async onTextHandler(@Ctx() ctx: general.ContextType) {
    const lastMsg = ctx.session.lastText;
    const message = (ctx.update as any).message;
    if (!('text' in message)) {
      return ctx.scene.enter('AskKeyAgainScene');
    }
    ctx.session.key = message.text;
    await general.replyMedia(
      ctx,
      ctx.session.media_type,
      lastMsg,
      message.text,
    );
    await ctx.reply(general.askContentAcceptMsg, {
      reply_markup: general.acceptationKeyboard,
    });
    ctx.scene.leave();
  }
}

@Scene('AskKeyAgainScene')
export class AskKeyAgainScene {
  constructor(
    @InjectModel(Memorize.name)
    private readonly memorizeModel: MemorizeDocument,
    @InjectModel(User.name)
    private readonly userModel: UserDocument,
  ) {}
  @SceneEnter()
  async onEnter(ctx: general.ContextType) {
    ctx.reply(general.incorrectKeyInputMsg, { parse_mode: 'HTML' });
  }
  @Hears('/start')
  async onStart(@Ctx() ctx: general.ContextType) {
    ctx.session.adding = false;
    ctx.session.deleting = false;
    const user = await this.userModel.findOne({
      telegram_id: `${ctx.from?.id}`,
    });
    await ctx.reply(
      `Assalamu alaykum, ${ctx.from?.first_name ?? user?.first_name}${user?.last_name != undefined ? ' ' + user.last_name + ' ' : ' '}🎉`,
    );
    await ctx.reply(general.startMessage, {
      reply_markup: {
        keyboard: [["Qo'shish +"]],
        resize_keyboard: true,
        force_reply: true,
        one_time_keyboard: true,
      },
      parse_mode: 'HTML',
    });
  }

  @Hears('/help')
  async onHelp(@Ctx() ctx: general.ContextType) {
    await ctx.reply(general.helpMessage);
  }

  @Hears('/add')
  async onAdd(@Ctx() ctx: general.ContextType) {
    ctx.session.adding = true;
    await ctx.scene.enter('BeginScene');
  }

  @Hears('/delete')
  async onDelete(@Ctx() ctx: general.ContextType) {
    ctx.session.deleting = true;
    const allData = await this.memorizeModel
      .find({
        user_id: `${ctx.from?.id}`,
      })
      .select('key _id');
    if (allData.length == 0) {
      await ctx.reply(general.noDataToDeleteMsg);
      return;
    }
    await ctx.reply(general.askWhichDataToDeleteMsg, {
      reply_markup: {
        inline_keyboard: general.keyboardBuilder(allData),
      },
    });
  }
  @On('message')
  async onTextHandler(@Ctx() ctx: general.ContextType) {
    const lastMsg = ctx.session.lastText;
    const message = (ctx.update as any).message;
    if (!('text' in message)) {
      return ctx.scene.reenter();
    }
    const obj: general.TemplateI = {
      content: lastMsg,
      key: message.text,
    };
    await general.replyMedia(
      ctx,
      ctx.session.media_type,
      lastMsg,
      message.text,
    );
    const templateMsg = general.createTemplate(obj);
    await ctx.reply(templateMsg, { parse_mode: 'HTML' });
    await ctx.reply(general.askContentAcceptMsg, {
      reply_markup: general.acceptationKeyboard,
    });
    ctx.scene.leave();
  }
}
