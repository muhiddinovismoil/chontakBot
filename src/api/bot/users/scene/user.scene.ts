import { Ctx, On, Scene, SceneEnter } from 'nestjs-telegraf';
import * as general from '@/common';

@Scene('BeginScene')
export class BeginScene {
  @SceneEnter()
  async onEnter(ctx: general.ContextType) {
    ctx.reply(general.askContentMsg, {
      reply_markup: {
        remove_keyboard: true,
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
    console.log(voice);
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
  @SceneEnter()
  async onEnter(ctx: general.ContextType) {
    ctx.reply(general.askContentKeyMsg, {
      parse_mode: 'HTML',
      reply_parameters: {
        message_id: ctx.session.lastMessage,
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
    // switch (ctx.session.media_type) {
    //   case general.Media.TEXT:
    //     const templateMsg = general.createTemplate({
    //       key: message.text,
    //       content: lastMsg,
    //     });
    //     return await ctx.reply(templateMsg, { parse_mode: 'HTML' });
    //   case general.Media.PHOTO:
    //     await ctx.replyWithPhoto(lastMsg, {
    //       caption: general.KeyWordTemplate(message.text),
    //       parse_mode: 'HTML',
    //     });
    //     break;
    //   case general.Media.VIDEO:
    //     await ctx.replyWithVideo(lastMsg, {
    //       caption: message.text,
    //       parse_mode: 'HTML',
    //     });
    //     break;
    //   case general.Media.AUDIO:
    //     await ctx.replyWithAudio(lastMsg, {
    //       caption: message.text,
    //       parse_mode: 'HTML',
    //     });
    //     break;
    //   case general.Media.ANIMATION:
    //     await ctx.replyWithAnimation(lastMsg, {
    //       caption: message.text,
    //       parse_mode: 'HTML',
    //     });
    //     break;
    //   case general.Media.DOCUMENT:
    //     await ctx.replyWithDocument(lastMsg, {
    //       caption: message.text,
    //       parse_mode: 'HTML',
    //     });
    //     break;
    //   case general.Media.LOCATION:
    //     if (lastMsg.length != undefined) {
    //       const [latitude, longitude] = lastMsg.split('_');
    //       await ctx.replyWithLocation(Number(latitude), Number(longitude));
    //       await ctx.reply(general.KeyWordTemplate(message.text));
    //     }
    //     break;
    //   case general.Media.STICKER:
    //     await ctx.replyWithSticker(lastMsg);
    //     await ctx.reply(general.KeyWordTemplate(message.text));
    //     break;
    //   default:
    //     return await ctx.reply(general.incorrectMediaInputMsg);
    // }
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
  @SceneEnter()
  async onEnter(ctx: general.ContextType) {
    ctx.reply(general.incorrectKeyInputMsg, { parse_mode: 'HTML' });
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
    const templateMsg = general.createTemplate(obj);
    await ctx.reply(templateMsg, { parse_mode: 'HTML' });
    await ctx.reply(general.askContentAcceptMsg, {
      reply_markup: general.acceptationKeyboard,
    });
    ctx.scene.leave();
  }
}
