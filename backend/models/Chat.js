import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema({
  senderId: { type: String, required: true },
  receiverId: { type: String, required: true },
  messages: [
    {
      type: { type: String, required: true },
      message: { type: String, required: true, trim: true },
      time: { type: String, required: true, default: Date.now() },
    }
  ]
});

const ChatModel =  mongoose.model("chat", ChatSchema) ;

export default ChatModel ;