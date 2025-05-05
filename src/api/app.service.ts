import { NestFactory } from '@nestjs/core';
import * as express from 'express';
import * as path from 'path';
import { config } from '@/config';
import { AppModule } from '@/api/app.module';
import { ConsoleLogger } from '@nestjs/common';

export class Application {
  static async main(): Promise<void> {
    const app = await NestFactory.create(AppModule, {
      logger: new ConsoleLogger({
        prefix: 'Chontak Bot',
        logLevels: ['log', 'warn', 'debug', 'error'],
      }),
    });
    app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));
    app.listen(config.API_PORT || 3000);
  }
}
