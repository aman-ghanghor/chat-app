import {config } from "dotenv";
config() ;
import express from "express" ;
import cors from "cors" ;
import user from "./routes/user.js"
import chat from "./routes/chat.js" ;
import connectDB from "./db/connectdb.js";

const app = express() ;
app.use(cors()) ;
const port = process.env.PORT ;
const DATABASE_URL = process.env.DATABASE_URL;

// Database connect
connectDB(DATABASE_URL);

// midlewares
app.use(express.json()) ;


// Sockets setup
import http from "http" ;
const httpServer = http.createServer(app) ;
import { Server } from "socket.io" ;
const io = new Server(httpServer, {
    cors: "*"
})


let users = [] ;

const addUser = (userId, socketId) => {
    !users.some((user)=> user.userId===userId) && users.push({userId, socketId}) ;
}

const removeUser = (socketId) =>{
    users = users.filter( (user)=> user.socketId!==socketId) ;
}

io.on("connection", (socket)=>{
    console.log("socket connected", socket.id)
    socket.on("addUser", userId =>{
        addUser(userId, socket.id) ;
        console.log(users) ;
        io.emit("getOnlineUsers", users) ;
    })
    socket.on("sendMessage", (data)=>{ 
        const receiver = users.find((user)=> user.userId===data.receiverId) ;
        console.log("online users = ", users )
        if(receiver) {
            const {time, message} = data ; 
            const messageInfo = {time, message, sendbyId: data.senderId} ;
            io.to(receiver.socketId).emit("newMessage", messageInfo) ;
            console.log("message sent to receiver")
        } else{
          console.log("receiver is offline") ;
        }
    })
    socket.on("disconnect", ()=>{
        removeUser(socket.id) ;
        console.log("disconnected")
        console.log(users)
        io.emit("getOnlineUsers", users) ;
    })
})

// Load routes
app.use("/api/user", user) ;
app.use("/api/chat", chat) ;

httpServer.listen(port, ()=>{
    console.log("Server running on port 8000") ;
})

