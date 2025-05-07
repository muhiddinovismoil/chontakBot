import { NestFactory } from '@nestjs/core';
import * as express from 'express';
import * as path from 'path';
import { config } from '@/config';
import { AppModule } from '@/api/app.module';
import { ConsoleLogger, Logger } from '@nestjs/common';
import { Telegraf } from 'telegraf';

export class Application {
  static async main(): Promise<void> {
    const logger = new Logger();
    const app = await NestFactory.create(AppModule, {
      logger: new ConsoleLogger({
        prefix: 'Chontak Bot',
        logLevels: ['log', 'warn', 'debug', 'error'],
      }),
    });
    // const telegrafBot = app.get(Telegraf);
    // await telegrafBot.telegram.setWebhook(
    //   `${config.PUBLIC_URL}/telegraf/webhook`,
    // );
    logger.warn(`SERVER IS RUNNING ON PORT ${config.API_PORT}`);
    logger.warn(`BOT IS RUNNING ON https://t.me/${config.BOT_USERNAME}`);
    app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));
    app.listen(config.API_PORT || 3000);
  }
}
