import { Keyboard, InlineKeyboard } from "grammy";
export const menuKeyboard = new Keyboard().text("Qo'shish +").resized();
export const confirmationKeyboard = new InlineKeyboard()
    .text("tasdiqlash ✅", "accept")
    .text("tahrirlash ✏️", "reset");
