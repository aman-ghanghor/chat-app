import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { io } from "socket.io-client";

import { useAppContext } from "../../context/context";

import { HiPhone } from "react-icons/hi";
import { IoIosVideocam } from "react-icons/io";
import { BsThreeDotsVertical } from "react-icons/bs";
import { GrAdd } from "react-icons/gr";
import { MdSend } from "react-icons/md";
import { FaRegImages } from "react-icons/fa";
import { BsEmojiLaughing } from "react-icons/bs";

const endPoint = "http://localhost:8000/api/chat"

const ChatSection = () => {
  const {
    isLoggedIn,
    currentUser,
    otherUser,
    chat,
    setChat,
    showContactInfo,
    setShowContactInfo,
    newMessagesArr, 
    setNewMessagesArr,
    setOnlineUsers,
    socket
  } = useAppContext();
  const [message, setMessage] = useState("") ;
  const [newMessage, setNewMessage] = useState("") ;

  // useEffect(() => {
  //   if (isLoggedIn) {
      // socket = io("http://localhost:8000");
      // socket.off("connect").on("connect", () => {
      //   console.log("socket connected");
      //   console.log(socket.id);
      // });
      // socket.emit("addUser", currentUser._id);
      // socket.off("getOnlineUsers").on("getOnlineUsers", (onlineUsers) => {
      //   console.log(onlineUsers);
      //   setOnlineUsers(onlineUsers) ;
      // });
      // socket.off("disconnect").on("disconnect", () => {
      //   socket.removeAllListeners();
      // });
    // }
  // }, [isLoggedIn]);

  useEffect(() => {
    if (socket) {
      socket.off("newMessage").on("newMessage", (messageInfo) => {
        const newMessage = { ...messageInfo, type: "received" };
        setNewMessage(newMessage);
      });
    }
  }, []);
  
  // new messages 
  useEffect(()=>{
    if(newMessage) {
      if(otherUser) {
        if(newMessage.sendbyId===otherUser._id) {
          setChat([...chat, newMessage])
        } 
        else {
          setNewMessagesArr([...newMessagesArr, newMessage])
        }
      } 
      else {
        setNewMessagesArr([...newMessagesArr, newMessage])
      }
      setNewMessage("") ;
    }
  }, [newMessage])


  const submitHandle = (e) => {
    e.preventDefault();
    if (message !== "") {
      const messageToSend = {
        senderId: currentUser._id,
        receiverId: otherUser._id,
        time: new Date(Date.now()),
        message,
      };
      socket.emit("sendMessage", messageToSend);
      axios.post(`${endPoint}`, { messageToSend })
      .then((res) => {
        console.log(res);
      });
      const sentMessage = { message, type: "sent", time: new Date(Date.now()) };
      setChat([...chat, sentMessage]);
      setMessage("");
    }
  };

  const inputChangeHandle = (e) => {
    setMessage(e.target.value);
  };

  if (!otherUser) {
    return <div>Choose Contact to Start Chat...</div>;
  }

  return (
    <section className={`chat-section ${showContactInfo ? "short" : "wide"}`}>
      <div className="topbar">
        <div
          className="you-user"
          onClick={() => setShowContactInfo(!showContactInfo)}
        >
          <img src={otherUser.avatar} alt="" />
          <span className="name">{`${otherUser.firstname} ${otherUser.lastname}`}</span>
          <p>Last seen today 12:30pm</p>
        </div>
        <ul>
          <li>
            <span className="icon">
              <HiPhone />
            </span>
          </li>
          <li>
            <span className="icon">
              <IoIosVideocam />
            </span>
          </li>
          <li>
            <span className="icon">
              <BsThreeDotsVertical />
            </span>
          </li>
        </ul>
      </div>
      <ChatArea />
      <div className="bottombar">
        <ul>
          <li>
            <span className="icon">
              <GrAdd />
            </span>
          </li>
          <li>
            <span className="icon">
              <FaRegImages />
            </span>
          </li>
          <li>
            <form onSubmit={submitHandle}>
              <input
                type="text"
                className="msg-input"
                placeholder="Send a message"
                value={message}
                onChange={inputChangeHandle}
              />
              <span className="icon">
                <BsEmojiLaughing />
              </span>
              <button type="submit" className="send-btn">
                <MdSend />
              </button>
            </form>
          </li>
        </ul>
      </div>
    </section>
  );
};

const ChatArea = () => {
  const { chatLoading, chat, otherUser, newMessagesSeen } = useAppContext();
  const chatArea = useRef();

  // when Chat mount
  useEffect(() => {
      if(chatArea.current) {
        if (!chatLoading) {
          const element = chatArea.current;
          element.scrollTop = element.scrollHeight - element.clientHeight;
          // new messages seen
          newMessagesSeen() 
        }
      }
  }, [chatLoading]);
  
  


  // new message adds to Chat
  useEffect(()=>{
    if(chatArea.current) {
      const element = chatArea.current ;
      element.scrollTo({
        top: element.scrollHeight - element.clientHeight,
        left: 0,
        behavior: 'smooth'
      })
    }
  }, [chat])

  if (chatLoading) {
    return (
      <div style={{marginTop: "auto"}}>
        <h2>Loading....</h2>
      </div>
    );
  }

  if (chat.length === 0) {
    return (
      <div style={{marginTop: "auto"}}>
        <h3> Empty </h3>
      </div>
    );
  }

  return (
    <article className="chat-area styled-scrollbar" ref={chatArea}>
      {chat.map((item, index) => {
        return <Message key={index} item={item} />;
      })}
    </article>
  );
};



const Message = ({ item}) => {
  const {message, time, type} = item ; 
  return (
    <div className={`msg-wrapper ${type}`}>
      <div className={`msg ${type}`}> 
        <p> {message} </p> 
        <p> { (new Date(time)).toLocaleString() } </p>
      </div>
    </div>
  );
};

export default ChatSection;
