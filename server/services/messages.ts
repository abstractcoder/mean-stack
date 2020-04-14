import Message from "../models/message";

export function listMessages() {
  return Message.find().sort({createdAt: -1});
}

export function createMessage(text: String) {
  let m = new Message({text: text});
  return m.save();
}

export function deleteMessage(id: String) {
  return Message.findByIdAndDelete(id);
}
