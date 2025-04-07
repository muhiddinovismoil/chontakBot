import {
  askContentAcceptMsg,
  askContentMsg,
  ContextType,
  TemplateI,
  createTemplate,
  acceptationKeyboard,
  askContentKeyMsg,
} from '@/common';
import { Ctx, On, Scene, SceneEnter } from 'nestjs-telegraf';

@Scene('BeginScene')
export class BeginScene {
  @SceneEnter()
  async onEnter(ctx: ContextType) {
    ctx.reply(askContentMsg, {
      reply_markup: {
        remove_keyboard: true,
      },
    });
  }
  @On('text')
  async onTextHandler(@Ctx() ctx: ContextType) {
    const message = ctx.message?.message_id;
    ctx.session.lastText = (ctx.update as any).message.text;
    ctx.session.lastMessage = message;
    ctx.scene.enter('AskKeyScene');
  }
}
@Scene('AskKeyScene')
export class AskKeyScene {
  @SceneEnter()
  async onEnter(ctx: ContextType) {
    ctx.reply(askContentKeyMsg, {
      parse_mode: 'HTML',
      reply_parameters: {
        message_id: ctx.session.lastMessage,
      },
    });
  }

  @On('text')
  async onTextHandler(@Ctx() ctx: ContextType) {
    const lastMsg = ctx.session.lastText;
    const message = (ctx.update as any).message.text;
    const obj: TemplateI = {
      content: lastMsg,
      key: message,
    };
    const templateMsg = createTemplate(obj);
    await ctx.reply(templateMsg, { parse_mode: 'HTML' });
    await ctx.reply(askContentAcceptMsg, {
      reply_markup: acceptationKeyboard,
    });
    ctx.scene.leave();
  }
}
