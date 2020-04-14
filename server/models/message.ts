import { Schema, Document, model } from "mongoose";

export interface IMessage extends Document {
  text: string;
  createdAt: string;
}

const MessageSchema: Schema = new Schema({
  text: { type: String, required: true },
  createdAt: { type: Date, required: true, default: Date.now },
});

export default model<IMessage>("Message", MessageSchema);
