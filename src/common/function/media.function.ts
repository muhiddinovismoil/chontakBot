import * as general from '@/common';
export async function replyMedia(ctx, mediaType, lastMsg, messageText) {
  const caption = general.KeyWordTemplate(messageText);

  switch (mediaType) {
    case general.Media.TEXT: {
      const templateMsg = general.createTemplate({
        key: messageText,
        content: lastMsg,
      });
      await ctx.reply(templateMsg, { parse_mode: 'HTML' });
      break;
    }
    case general.Media.VOICE:
      await ctx.replyWithVoice(lastMsg, { caption, parse_mode: 'HTML' });
      break;
    case general.Media.PHOTO:
      await ctx.replyWithPhoto(lastMsg, { caption, parse_mode: 'HTML' });
      break;
    case general.Media.VIDEO:
      await ctx.replyWithVideo(lastMsg, { caption, parse_mode: 'HTML' });
      break;
    case general.Media.AUDIO:
      await ctx.replyWithAudio(lastMsg, { caption, parse_mode: 'HTML' });
      break;
    case general.Media.ANIMATION:
      await ctx.replyWithAnimation(lastMsg, { caption, parse_mode: 'HTML' });
      break;
    case general.Media.DOCUMENT:
      await ctx.replyWithDocument(lastMsg, { caption, parse_mode: 'HTML' });
      break;
    case general.Media.LOCATION: {
      if (lastMsg.length !== undefined) {
        const [latitude, longitude] = lastMsg.split('_');
        await ctx.replyWithLocation(Number(latitude), Number(longitude));
        await ctx.reply(caption);
      }
      break;
    }
    case general.Media.STICKER:
      await ctx.replyWithSticker(lastMsg);
      await ctx.reply(caption);
      break;
    default:
      await ctx.reply(general.incorrectMediaInputMsg);
      break;
  }
}
