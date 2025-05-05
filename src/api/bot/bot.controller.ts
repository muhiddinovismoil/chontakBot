// import { Controller, Post, Req, Res } from '@nestjs/common';
// import { Request, Response } from 'express';
// import { BotService } from './bot.service';

// @Controller('telegram')
// export class BotController {
//   constructor(private readonly botService: BotService) {}

//   @Post()
//   async handleUpdate(@Req() req: Request, @Res() res: Response) {
//     const handler = this.botService.bot.webhookCallback('/telegram');
//     return handler(req, res);
//   }
// }
