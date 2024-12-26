import mongoose from "mongoose";
import { bot } from "./src/bot/index.js";
import "./src/command/index.js";
mongoose.connect(process.env.MONGO_URI);
bot.start();
