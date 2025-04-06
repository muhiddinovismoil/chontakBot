import { Module } from '@nestjs/common';
import { config } from 'src/config';
import { BotModule } from './bot/bot.module';
import { TypeOrmModule } from '@nestjs/typeorm';
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
