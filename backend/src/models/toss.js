import mongoose from "mongoose";

const tossSchema = mongoose.Schema({
  userId: { type: String, required: true },
  toss: { type: String, required: true },
  wager: { type: Number, required: true },
  win: { type: Boolean, required: true },
  id: { type: String },
}, { timestamps: true } );

export default mongoose.model("Toss", tossSchema);