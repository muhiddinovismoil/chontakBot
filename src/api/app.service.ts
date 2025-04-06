import { NestFactory } from '@nestjs/core';
import * as express from 'express';
import * as path from 'path';
import { config } from '@/config';
import { AppModule } from './app.module';

export class Application {
  static async main(): Promise<void> {
    const app = await NestFactory.create(AppModule);
    app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));
    app.listen(config.API_PORT || 3000);
  }
}
