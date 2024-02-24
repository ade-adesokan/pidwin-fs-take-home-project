import mongoose from "mongoose";

const tokenSchema = mongoose.Schema({
  userId: { type: String, required: true },
  token: { type: Number, required: true },
  winningStreak: { type: Number, required: true },
  id: { type: String },
});

export default mongoose.model("Token", tokenSchema);