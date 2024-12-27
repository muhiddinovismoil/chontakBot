import { Bot } from "grammy";
if (!process.env.BOT_TOKEN) {
    console.error(
        "Error: BOT_TOKEN is not defined in the environment variables."
    );
    process.exit(1);
}
export const bot = new Bot(process.env.BOT_TOKEN);
bot.catch((err) => {
    console.error("Error in bot operation:", err.message);
});
