import mongoose from "mongoose";

const clientSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
}, { timestamps: true });

export const Client = mongoose.model("Client", clientSchema);
