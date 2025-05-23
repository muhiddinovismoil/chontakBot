import { Update, Ctx, Command, On } from 'nestjs-telegraf';
import { InjectModel } from '@nestjs/mongoose';
import { Memorize, MemorizeDocument, User, UserDocument } from '@/core';
import * as general from '@/common';
import { InlineQueryResult } from 'telegraf/typings/core/types/typegram';

@Update()
export class BotService {
  constructor(
    @InjectModel(User.name) private readonly userModel: UserDocument,
    @InjectModel(Memorize.name)
    private readonly memorizeModel: MemorizeDocument,
  ) {}

  @Command('start')
  async start(@Ctx() ctx: general.ContextType) {
    const tg_id = ctx.from?.id;
    const user = await this.userModel.findOne({
      telegram_id: tg_id?.toString(),
    });
    ctx.session.adding = false;
    ctx.session.deleting = false;
    if (!user) {
      const newUser = new this.userModel({
        telegram_id: tg_id?.toString(),
        first_name: ctx.from?.first_name,
        last_name: ctx.from?.last_name,
      });
      await newUser.save();
    }
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

  @Command('help')
  async help(@Ctx() ctx: general.ContextType) {
    await ctx.reply(general.helpMessage);
  }

  @Command('add')
  async add(@Ctx() ctx: general.ContextType) {
    ctx.session.adding = true;
    await ctx.scene.enter('BeginScene');
  }

  @Command('delete')
  async delete(@Ctx() ctx: general.ContextType) {
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
  private async handleInlineQuery(
    ctx: general.ContextType,
    query: string,
  ): Promise<InlineQueryResult[]> {
    const userId = ctx.from?.id;
    const getAll = await this.memorizeModel.find({ user_id: userId });
    const filteredResults = query
      ? getAll.filter((item) =>
          item.key.toLowerCase().includes(query.toLowerCase()),
        )
      : getAll;

    const results = filteredResults
      .map((item, index) => general.mapToInlineResult(item, `${index + 1}`))
      .filter((r): r is InlineQueryResult => r !== null);

    return results;
  }

  @On('inline_query')
  async onInlineQuery(@Ctx() ctx: general.ContextType) {
    if (ctx.inlineQuery && 'query' in ctx.inlineQuery) {
      const query = ctx.inlineQuery.query.trim();
      const results = await this.handleInlineQuery(ctx, query);
      await ctx.answerInlineQuery(results, { cache_time: 0 });
    }
  }
}
