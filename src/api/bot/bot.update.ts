import { InjectModel } from '@nestjs/mongoose';
import { Memorize, MemorizeDocument, User, UserDocument } from '@/core';

export class BotUpdate {
  constructor(
    @InjectModel(User.name) private readonly userModel: UserDocument,
    @InjectModel(Memorize.name)
    private readonly memorizeModel: MemorizeDocument,
  ) {}
}
