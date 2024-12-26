import mongoose from "mongoose";
const UserSchema = new mongoose.Schema({
    user_id: String,
    first_name: String,
    last_name: String,
    username: String,
});
export const User = mongoose.model("users", UserSchema);
const MemorizeSchema = new mongoose.Schema(
    {
        user_id: {
            type: String,
            required: true,
        },
        text: {
            type: String,
        },
        key: {
            type: String,
        },
    },
    { timestamps: true }
);
export const Memorize = mongoose.model("memorize", MemorizeSchema);
