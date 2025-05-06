import * as general from '@/common';
import { InlineQueryResult } from 'telegraf/typings/core/types/typegram';

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

export function mapToInlineResult(item: any, id: string): InlineQueryResult | null {
  const base = { id, title: item.key };

  switch (item.type) {
    case general.Media.TEXT:
      return {
        type: 'article',
        ...base,
        input_message_content: {
          message_text: item.content,
        },
      };

    case general.Media.PHOTO:
      return {
        type: 'photo',
        ...base,
        photo_file_id: item.content,
      };

    case general.Media.AUDIO:
      return {
        type: 'audio',
        ...base,
        audio_file_id: item.content,
      };

    case general.Media.DOCUMENT:
      return {
        type: 'document',
        ...base,
        document_file_id: item.content,
      };

    case general.Media.LOCATION:
      const [lat, lon] = item.content.split('_');
      if (!lat || !lon) return null;
      return {
        type: 'location',
        ...base,
        latitude: parseFloat(lat),
        longitude: parseFloat(lon),
      };

    case general.Media.ANIMATION:
      return {
        type: 'gif',
        ...base,
        gif_file_id: item.content,
      };

    case general.Media.STICKER:
      return {
        type: 'sticker',
        ...base,
        sticker_file_id: item.content,
      };

    case general.Media.VIDEO:
      return {
        type: 'video',
        ...base,
        video_file_id: item.content,
      };

    case general.Media.VOICE:
      return {
        type: 'voice',
        ...base,
        voice_file_id: item.content,
      };

    default:
      return null;
  }
}
