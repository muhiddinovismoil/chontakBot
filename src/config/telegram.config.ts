import {
  TelegrafModuleOptions,
  TelegrafModuleAsyncOptions,
} from 'nestjs-telegraf';
import { session } from 'telegraf';
import { config } from './index';

const telegrafModuleOptions = (): TelegrafModuleOptions => {
  return {
    token: config.BOT_TOKEN,
    middlewares: [
      session(),
      async (ctx, next) => {
        if (!ctx.session) {
          ctx.session = {};
        }
        await next();
      },
    ],
  };
};

export const options = (): TelegrafModuleAsyncOptions => {
  return {
    useFactory: () => telegrafModuleOptions(),
  };
};
