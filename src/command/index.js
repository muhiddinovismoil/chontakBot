import { bot } from "../bot/index.js";
import { menuKeyboard } from "../keyboard/index.js";
import { User } from "../model/index.js";
// import { replyMessage } from "../action/index.js";
// import { memorySave } from "../action/index.js";
import { InlineKeyboard, session } from "grammy";
import { conversations, createConversation } from "@grammyjs/conversations";
bot.use(session({ initial: () => ({}) }));
bot.use(conversations());
bot.use(createConversation(conversationFunc));
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
async function conversationFunc(conversation, ctx) {
    const msg =
        "Endi kalit so'z yuboring! \nAynan shu kalit so'z orqali bu ma'lumotni chatda jo'natasiz. Shuning uchun, kalit so'zni eslab qoling!";

    const messageId = ctx.msg.message_id;

    await ctx.reply(msg, { reply_to_message_id: messageId });
    const { message } = await conversation.wait();

    const obj = `
    Kalit so'zi :${ctx.msg.text}

Tekst :${message.text}
    
    `;

    await ctx.reply(obj);

    const inlinekeyboard = new InlineKeyboard()
        .text("tasdiqlash ✅", "tasdiqlash")
        .text("tahrirlash ✏️", "tahrirlash");

    const newmsg = "Endi ma'lumot va kalit so'zini tasdiqlang!!!";
    await ctx.reply(newmsg, { reply_markup: inlinekeyboard });
}
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
getMenuBar();
