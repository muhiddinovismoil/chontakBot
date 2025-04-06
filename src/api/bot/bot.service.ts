import { ContextType } from 'src/common';
import { Update, Ctx, Command, Action } from 'nestjs-telegraf';

@Update()
export class BotService {
  constructor() {}
  @Command('start')
  async start(@Ctx() ctx: ContextType) {
    ctx.reply('Salom');
  }
  @Action('uz')
  async setLangUz(@Ctx() ctx: ContextType) {
    ctx.session.lang = 'uz';
  }

  @Action('ru')
  async setLangRu(@Ctx() ctx: ContextType) {
    ctx.session.lang = 'ru';
  }

  @Action('en')
  async setLangEn(@Ctx() ctx: ContextType) {
    ctx.session.lang = 'en';
  }
}
