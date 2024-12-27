import { Keyboard, InlineKeyboard } from "grammy";
export const menuKeyboard = new Keyboard().text("Qo'shish +").resized();
export const confirmationKeyboard = new InlineKeyboard()
    .text("tasdiqlash ✅", "accept")
    .text("tahrirlash ✏️", "reset");
export function createInlineKeyboard(data) {
    return data.map((item) => [
        {
            text: item.key,
            callback_data: item._id.toString(),
        },
    ]);
}
export const ochiruvchiKeyboard = new InlineKeyboard().text(
    "o'chirish",
    "o'chirish"
);
