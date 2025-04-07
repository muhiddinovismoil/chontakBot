import { Update, Ctx, Command } from 'nestjs-telegraf';
import { ContextType, helpMessage, startMessage } from '@/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity, UserRepository } from '@/core';

@Update()
export class BotService {
  constructor(
    @InjectRepository(UserEntity) private readonly userRepo: UserRepository,
  ) {}
  @Command('start')
  async start(@Ctx() ctx: ContextType) {
    const tg_id = ctx.from?.id;
    const user = await this.userRepo.findOne({
      where: { telegram_id: tg_id?.toString() },
    });
    if (!user) {
      const newUser = this.userRepo.create({
        telegram_id: tg_id?.toString(),
        first_name: ctx.from?.first_name,
        last_name: ctx.from?.last_name,
      });
      await this.userRepo.save(newUser);
    }
    await ctx.reply(
      `Assalamu alaykum, ${user?.first_name}${user?.last_name != undefined ? ' ' + user.last_name + ' ' : ' '}🎉`,
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
    // await ctx.scene.enter()
  }

  @Command('delete')
  async delete(@Ctx() ctx: ContextType) {}
}
