import { bot } from "../bot/index.js";
import { menuKeyboard } from "../keyboard/index.js";
import { User, Memorize } from "../model/index.js";
import { session, InlineKeyboard } from "grammy";
import { confirmationKeyboard } from "../keyboard/index.js";
import { conversations, createConversation } from "@grammyjs/conversations";
bot.use(
    session({
        initial: () => ({}),
        getSessionKey: (ctx) => (ctx.chat ? `chat:${ctx.chat.id}` : null), // chatga tayyorlangan session key
    })
);
bot.use(conversations());
bot.use(createConversation(conversationFunc, "conversationFunc"));
bot.command("start", async (ctx) => {
    const userId = ctx.from.id;
    const first_name = ctx.from.first_name;
    const last_name = ctx.from.last_name;
    const username = ctx.from.username;
    const findUser = await User.findOne({ user_id: userId });
    if (!findUser) {
        await User.create({
            user_id: userId,
            first_name: first_name,
            last_name: last_name,
            username: username,
        });
    }
    await ctx.reply(`Assalamu alaykum, ${first_name}! 🎉`);
    await ctx.reply(
        `<b>Cho'ntak bot</b> orqali siz har qanday ma'lumotni saqlab, uni telegramdagi ixtiyoriy chatga tezlik bilan jo'natish imkoniga ega bo'lasiz!\n\nMa'lumot qo'shish uchun pastdagi <b>'Qo'shish'</b> tugmasini bosing va kalit so'z bering.`,
        { parse_mode: "HTML", reply_markup: menuKeyboard }
    );
});
bot.command("help", (ctx) => {
    ctx.reply(
        "Buyruqlar:\n/start - Botni qayta ishga tushirish\n/help - Yordam\n/add - Yangi ma'lumot qo'shish\n/delete - Ma'lumot o'chirish"
    );
});
bot.command("add", (ctx) => {
    ctx.reply("Istagan ma'lumot turini menga jo'nating...");
});
bot.command("delete", (ctx) => {
    ctx.reply("botga malumotni o'chiramiz");
});
bot.callbackQuery("accept", async (ctx) => {
    await ctx.answerCallbackQuery({
        text: "Siz bu yordamchi so'zlaringizni saqladingiz",
    });
    await ctx.editMessageReplyMarkup(null);
    await ctx.reply(
        "Ma'lumot muvaffaqiyatli qo'shildi! 🥳 \n\n@simple_first_new_bot kalit so'z👈 \nshu jumlani Telegramdagi istagan chatga yozish orqali saqlangan ma'lumotni jo'natishingiz mumkin!"
    );
});
bot.callbackQuery("reset", async (ctx) => {
    await ctx.answerCallbackQuery({
        text: "Tahrirlash amalga oshirishingiz mumkin.",
    });
    await ctx.editMessageReplyMarkup(null);
    const allData = await Memorize.find({ user_id: ctx.from.id });
    const index = allData.length - 1;
    const data = allData[index];
    await Memorize.deleteOne({ _id: data._id });
    await ctx.reply(
        "Qaytadan boshlaymizmi? \n\nOk! \n\nIstagan ma'lumot turini menga jo'nating 🙂..."
    );
});
async function conversationFunc(conversation, ctx) {
    const msg =
        "Endi kalit so'z yuboring! \nAynan shu kalit so'z orqali bu ma'lumotni chatda jo'natasiz. Shuning uchun, kalit so'zni eslab qoling!";
    const userId = ctx.from.id;
    const messageId = ctx.msg.message_id;
    await ctx.reply(msg, { reply_to_message_id: messageId });
    const { message } = await conversation.wait();
    await Memorize.create({
        user_id: userId,
        key: message.text,
        text: ctx.message.text,
    });
    const obj = `
    Kalit so'zi :${ctx.msg.text}
Tekst :${message.text}
    `;
    await ctx.reply(obj);
    const newmsg = "Endi ma'lumot va kalit so'zini tasdiqlang!!!";
    await ctx.reply(newmsg, { reply_markup: confirmationKeyboard });
}
export function getMenuBar() {
    try {
        bot.api.setMyCommands([
            {
                command: "start",
                description: "Botni ishga tushurish",
            },
            {
                command: "help",
                description: "Yordam",
            },
            {
                command: "add",
                description: "Yangi ma'lumot qo'shish",
            },
            {
                command: "delete",
                description: "Ma'lumotni o'chirish",
            },
        ]);
        console.log("Menu bar commands set successfully.");
    } catch (error) {
        console.error("Error setting menu bar:", error.message);
    }
}
bot.hears("Qo'shish +", (ctx) => {
    ctx.reply(`Istagan ma'lumot turini menga jo'nating 🙂...`, {
        reply_markup: { remove_keyboard: true },
    });
});
bot.on("message", async (ctx) => {
    await ctx.conversation.enter("conversationFunc");
});
bot.on("inline_query", async (ctx) => {
    const query = ctx.inlineQuery.query;
    if (query) {
        const results = await handleInlineQuery(ctx, query);
        await ctx.answerInlineQuery(results);
    }
});
async function handleInlineQuery(ctx, query) {
    const userId = ctx.from.id;
    const getAll = await Memorize.find({ user_id: userId });
    if (!query) return [];
    const results = getAll.map((item, index) => ({
        type: "article",
        id: String(index + 1),
        title: item.key,
        input_message_content: {
            message_text: item.text,
        },
    }));
    return results;
}
getMenuBar();
