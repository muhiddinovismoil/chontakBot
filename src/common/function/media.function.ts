import * as general from '@/common';
import { Markup } from 'telegraf';
export async function replyMedia(
  ctx: general.ContextType,
  mediaType: any,
  lastMsg: string,
  messageText: string,
  buttonText?: string,
  buttonCallback?: string,
) {
  const caption = general.KeyWordTemplate(messageText);
  const replyOptions: any = { parse_mode: 'HTML' };
  if (buttonText && buttonCallback) {
    replyOptions.reply_markup = {
      inline_keyboard: [[{ text: buttonText, callback_data: buttonCallback }]],
    };
  }

  switch (mediaType) {
    case general.Media.TEXT: {
      const templateMsg = general.createTemplate({
        key: messageText,
        content: lastMsg,
      });
      await ctx.reply(templateMsg, { ...replyOptions });
      break;
    }
    case general.Media.VOICE:
      await ctx.replyWithVoice(lastMsg, { caption, ...replyOptions });
      break;
    case general.Media.PHOTO:
      await ctx.replyWithPhoto(lastMsg, { caption, ...replyOptions });
      break;
    case general.Media.VIDEO:
      await ctx.replyWithVideo(lastMsg, { caption, ...replyOptions });
      break;
    case general.Media.AUDIO:
      await ctx.replyWithAudio(lastMsg, { caption, ...replyOptions });
      break;
    case general.Media.ANIMATION:
      await ctx.replyWithAnimation(lastMsg, { caption, ...replyOptions });
      break;
    case general.Media.DOCUMENT:
      await ctx.replyWithDocument(lastMsg, { caption, ...replyOptions });
      break;
    case general.Media.LOCATION: {
      if (lastMsg.length !== undefined) {
        const [latitude, longitude] = lastMsg.split('_');
        await ctx.replyWithLocation(Number(latitude), Number(longitude));
        await ctx.reply(caption, replyOptions);
      }
      break;
    }
    case general.Media.STICKER:
      await ctx.replyWithSticker(lastMsg);
      await ctx.reply(caption, replyOptions);
      break;
    default:
      await ctx.reply(general.incorrectMediaInputMsg);
      break;
  }
}
