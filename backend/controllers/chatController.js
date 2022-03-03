import ChatModel from "../models/Chat.js";

class ChatController {
  // get all messages
  static getAllMessages = (req, res) => {
    req.io.on("connection", (socket) => {
      console.log("socket socket");
      socket.on("send-message", (data) => {
        console.log("hello world");
        console.log(data);
      });
    });
    res.send("Hello all messages");
  };
  // send message
  static sendMessage = (req, res) => {
    console.log(req.body);
    const { senderId, receiverId, time, message } = req.body.messageToSend;
    // function
    if(senderId && receiverId) {
        const messageSubDoc1 = { message, time, type: "sent" };
        const messageSubDoc2 = { message, time, type: "received" };
        this.sendToSpecificChat(senderId, receiverId, messageSubDoc1);
        this.sendToSpecificChat(receiverId, senderId, messageSubDoc2);
        res.send("Message send");
    } else {
        console.log("Receiver or sender is undefined")
    }
  };
  // Function to insert message to chat
  static sendToSpecificChat = async (firstId, secondId, messageSubDoc) => {
    try {
      const chatExists = await ChatModel.exists({
        senderId: firstId,
        receiverId: secondId,
      });
      if (chatExists) {
        const chat = await ChatModel.findOne({
          senderId: firstId,
          receiverId: secondId,
        });
        const newMessages = [...chat.messages, messageSubDoc];
        const updateResult = await ChatModel.updateOne(
          { senderId: firstId, receiverId: secondId },
          { $set: { messages: newMessages } }
        );
      } else {
        const newChatDoc = new ChatModel({
          senderId: firstId,
          receiverId: secondId,
          messages: [messageSubDoc],
        });
        const saveResult = await newChatDoc.save();
      }
    } catch (err) {
      console.log(err);
    }
  };
  
  // Get Chat
  static getChat = async (req, res) => {
       const {senderId, receiverId} = req.query ;
       try{
          const chatExist = await ChatModel.exists({senderId, receiverId})
          if(chatExist) {
            const chatResult = await ChatModel.findOne({senderId, receiverId})
            console.log("chats =", chatResult) ;
            res.send(chatResult.messages)
          } else {
            res.send([]) ;
          }
       }
       catch(err) {
          console.log(err) ;
       }
  }


}

export default ChatController;
