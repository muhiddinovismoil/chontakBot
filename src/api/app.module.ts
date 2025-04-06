import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from '@/config';
import { BotModule } from './bot/bot.module';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mongodb',
      url: config.DB_URI,
      entities: [__dirname + '/core/entity/*.entity{.ts,.js}'],
      autoLoadEntities: true,
      synchronize: config.NODE_ENV == 'dev' ? true : false,
    }),
    BotModule,
  ],
})
export class AppModule {}
