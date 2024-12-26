import express from "express";
import mongoose from "mongoose";
import { bot } from "./src/bot/index.js";
import "./src/command/index.js";
const app = express();
app.use(express.json());
app.listen(process.env.PORT, () => {
    mongoose.connect(process.env.MONGO_URI);
    bot.start();
    console.log(`Server is running on PORT: ${process.env.PORT}`);
    console.log(`MONGOOSE CONNECTION SUCCESS`);
    console.log(`BOT STARTED SUCCESSFULLY`);
});
