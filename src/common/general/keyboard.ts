import { Markup } from 'telegraf';
import { InlineKeyboardMarkup } from 'telegraf/typings/core/types/typegram';

export const acceptationKeyboard: InlineKeyboardMarkup = {
  inline_keyboard: [
    [
      Markup.button.callback('tasdiqlash ✅', 'acceptBtn'),
      Markup.button.callback('tahrirlash ✏️', 'editBtn'),
    ],
  ],
};
export const deleteKeyboard: InlineKeyboardMarkup = {
  inline_keyboard: [[Markup.button.callback(`o'chirish`, 'deleteBtn')]],
};
