import { Ctx, On, Scene, SceneEnter } from 'nestjs-telegraf';
import * as general from '@/common';
import { LocationI } from '@/common/types/other.type';

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
    ctx.session.lastText = (ctx.update as any).message.text;
    ctx.session.lastMessage = message;
    ctx.scene.enter('AskKeyScene');
  }
  @On('audio')
  async onAudioHandler(@Ctx() ctx: general.ContextType) {
    ctx.reply('audio');
  }
  @On('animation')
  async onAnimationHandler(@Ctx() ctx: general.ContextType) {
    ctx.reply('video');
  }

  @On('document')
  async onFileHandler(@Ctx() ctx: general.ContextType) {
    ctx.reply('file');
  }

  @On('video')
  async onVideoHandler(@Ctx() ctx: general.ContextType) {
    ctx.reply('video');
  }

  @On('sticker')
  async onStickerHandler(@Ctx() ctx: general.ContextType) {
    ctx.reply('sticker');
  }

  @On('voice')
  async onVoiceHandler(@Ctx() ctx: general.ContextType) {
    ctx.reply('voice');
  }

  @On('location')
  async onLocationHandler(@Ctx() ctx: general.ContextType) {
    const location = (ctx.update as any).message.location;
    const { latitude, longitude }: LocationI = location;
    console.log()
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

@Scene('AskKeyAgainScene')
export class AskKeyAgainScene {
  @SceneEnter()
  async onEnter(ctx: general.ContextType) {
    ctx.reply(
      "Kalit so'z faqatgina tekst formatida bo'lishi mumkin!\n\nIltimos, faqatgina teks jo'nating!",
      { parse_mode: 'HTML' },
    );
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
