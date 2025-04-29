import { Update, Ctx, Command } from 'nestjs-telegraf';
import {
  askWhichDataToDeleteMsg,
  ContextType,
  helpMessage,
  noDataToDeleteMsg,
  startMessage,
  keyboardBuilder,
} from '@/common';
import { Memorize, MemorizeDocument, User, UserDocument } from '@/core';
import { InjectModel } from '@nestjs/mongoose';

@Update()
export class BotService {
  constructor(
    @InjectModel(User.name) private readonly userModel: UserDocument,
    @InjectModel(Memorize.name)
    private readonly memorizeModel: MemorizeDocument,
  ) {}
  @Command('start')
  async start(@Ctx() ctx: ContextType) {
    const tg_id = ctx.from?.id;
    const user = await this.userModel.findOne({
      telegram_id: tg_id?.toString(),
    });
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
    await ctx.reply(startMessage, {
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
  async help(@Ctx() ctx: ContextType) {
    await ctx.reply(helpMessage);
  }

  @Command('add')
  async add(@Ctx() ctx: ContextType) {
    await ctx.scene.enter('BeginScene');
  }

  @Command('delete')
  async delete(@Ctx() ctx: ContextType) {
    const allData = await this.memorizeModel
      .find({
        user_id: `${ctx.from?.id}`,
      })
      .select('key _id');
    if (allData.length == 0) {
      await ctx.reply(noDataToDeleteMsg);
      return;
    }
    await ctx.reply(askWhichDataToDeleteMsg, {
      reply_markup: {
        inline_keyboard: keyboardBuilder(allData),
      },
    });
  }
}
