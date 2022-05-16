import { createContext, useContext, useEffect, useReducer } from "react";
import reducer from "./reducer";
import axios from "axios";
import io from "socket.io-client";

const AppContext = createContext();

const initialState = {
  isAppLoading: false,
  contactsLoading: false,
  otherUserLoading: false,

  isLoggedIn: false,
  currentUser: null,
  otherUser: null,
  contactsList: [],
  onlineUsers: [],
  chat: [],
  newMessagesArr: [],
  chatLoading: true,
  showContactInfo: false,
  showAddUser: false,
  socket: null,
};

const endPoint1 = "http://localhost:8000/api/user";
const endPoint2 = "http://localhost:8000/api/chat";
const socketEndPoint = "http://localhost:8000";

const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const {
    isAppLoading,
    currentUser,
    otherUser,
    contactsList,
    newMessagesArr,
    onlineUsers,
  } = state;

  useEffect(() => {
    if (currentUser) {
      console.log("CONTEXT - useEffect [currentUser] ");
      setSocket();
    }
  }, [currentUser]);

  useEffect(() => {
    if (onlineUsers.length > 0) {
      console.log("CONTEXT - useEffect [onlineUser]");
      if (isAppLoading) {
        fetchData();
      } else {
        updateIsOnline(onlineUsers);
      }
    }
  }, [onlineUsers]);

  useEffect(() => {
    if (otherUser) {
      console.log("CONTEXT - useEffect [otherUser]");
      dispatch({ type: "CHAT_LOADING", payload: true });
      fetchChat();
    }
  }, [otherUser]);




  //  Fetching chat
  const fetchChat = async () => {
    try {
      const res = await axios.get(
        `${endPoint2}?senderId=${currentUser._id}&receiverId=${otherUser._id}`
      );
      console.log("CHAT-----");
      console.log(res);
      dispatch({ type: "FETCH_CHAT", payload: res.data });
    } catch (err) {
      console.log(err);
    }
  };

  // UPDATE isOnline property of Contacts
  const updateIsOnline = (onlineUsers) => {
    const updatedList = contactsList.map((contact) => {
      let isOnline = false;
      onlineUsers.forEach((onlineUser) => {
        if (onlineUser.userId === contact._id) {
          isOnline = true;
        }
      });
      return { ...contact, isOnline };
    });
    dispatch({ type: "UPDATE_CONTACTS", payload: updatedList });
  };

  // setting socket
  const setSocket = () => {
    console.log("CONTEXT - setSocket() called");
    const socket = io(socketEndPoint);
    socket.off("connect").on("connect", () => {
      console.log("socket connected");
    });
    socket.emit("addUser", currentUser._id);
    socket.off("getOnlineUsers").on("getOnlineUsers", (onlineUsers) => {
      dispatch({ type: "SET_ONLINE_USERS", payload: onlineUsers });
    });
    socket.off("disconnect").on("disconnect", () => {
      socket.removeAllListeners();
    });
    dispatch({ type: "SET_SOCKET", payload: socket });
  };

  // fetching data when app loads on user login
  const fetchData = async () => {
    console.log("CONTEXT - fetchData() called");
    try {
      // get contacts & their avatar
      const { _id, avatar } = currentUser;
      const { data: contacts } = await axios.get(
        `${endPoint1}/getContacts?user_id=${_id}`
      );
      const contactsList = await Promise.all(
        contacts.map(async (contact) => {
          const { data: avatarBlob } = await axios.get(
            `${endPoint1}/getFile?avatar=${contact.avatar}`,
            { responseType: "blob" }
          );
          const avatar = URL.createObjectURL(avatarBlob);
          let isOnline = false;
          onlineUsers.forEach((onlineUser) => {
            if (onlineUser.userId === contact._id) {
              isOnline = true;
            }
          });
          return { ...contact, avatar, newMessagesCount: 0, isOnline };
        })
      );
      dispatch({ type: "LOAD_APP", payload: contactsList });
    } catch (err) {
      console.log(err);
    }
  };

  // add new contacts to contactsList
  const addNewContacts = async (usernameList) => {
    console.log("CONTEXT - addNewContext() called");
    dispatch({ type: "LOADING_NEW_CONTACTS", payload: true });
    const newContacts = await Promise.all(
      usernameList.map(async (username) => {
        const { data: contact } = await axios.get(
          `${endPoint1}/getContactsByUsername?username=${username}`
        );
        const { data: avatarBlob } = await axios.get(
          `${endPoint1}/getFile?avatar=${contact.avatar}`,
          { responseType: "blob" }
        );
        const avatar = URL.createObjectURL(avatarBlob);
        let isOnline = false;
        onlineUsers.forEach((onlineUser) => {
          if (onlineUser.userId === contact._id) {
            isOnline = true;
          }
        });
        return { ...contact, avatar, newMessagesCount: 0, isOnline };
      })
    );
    if (newContacts.length > 0) {
      const newContactsList = [...contactsList, ...newContacts];
      dispatch({ type: "ADD_NEW_CONTACTS", payload: newContactsList });
    }
  };

  // for login
  const loginUser = async (currentUser) => {
    console.log("CONTEXT - loginUser() called");
    // get avatar of current user
    const { data: blob } = await axios.get(
      `${endPoint1}/getFile?avatar=${currentUser.avatar}`,
      { responseType: "blob" }
    );
    const avatar = URL.createObjectURL(blob);
    currentUser = { ...currentUser, avatar };
    dispatch({ type: "LOGIN", payload: currentUser });
  };

  // set signup states
  const signupUser = (data) => {
    console.log("CONTEXT - signupUser() called");
    dispatch({ type: "SIGNUP", payload: data });
  };

  // set showContactInfo state
  const setShowContactInfo = (data) => {
    console.log("CONTEXT - setShowContactInfo() called");
    dispatch({ type: "CONTACT_INFO", payload: data });
  };

  // set shwoAddUser state
  const setShowAddUser = (data) => {
    console.log("CONTEXT - setShowAddUser() called");
    dispatch({ type: "SHOW_ADD_USER", payload: data });
  };

  // set otherUser state
  const setOtherUser = (otherUser) => {
    console.log("CONTEXT -setOtherUser() called");
    dispatch({ type: "OTHER_USER", payload: otherUser });
  };

  // setting chat state
  const setChat = (newChat) => {
    console.log("CONTEXT - setChat() called");
    dispatch({ type: "SET_CHAT", payload: newChat });
  };

  // Resetting the newMessagesArr state
  const setNewMessagesArr = (newMessagesArr) => {
    console.log("CONTEXT - setNewMessagesArr() called");
    const updatedList = contactsList.map((contact) => {
      let count = 0;
      newMessagesArr.forEach((newMessage) => {
        if (newMessage.sendbyId === contact._id) {
          count += 1;
        }
      });
      console.log("count=>", count);
      return { ...contact, newMessagesCount: count };
    });
    dispatch({
      type: "SET_NEW_MESSAGES",
      payload: { newMessagesArr, contactsList: updatedList },
    });
  };

  // When new messages have seen
  const newMessagesSeen = () => {
    console.log("CONTEXT - newMessagesSeen() called");
    const cList = contactsList.map((contact) => {
      if (contact._id === otherUser._id) {
        return { ...contact, newMessagesCount: 0 };
      }
      return contact;
    });
    const mArr = newMessagesArr.filter((message) => {
      if (message.sendbyId === otherUser._id) {
        return false;
      }
      return true;
    });
    dispatch({
      type: "NEW_MESSAGES_SEEN",
      payload: { newMessagesArr: mArr, contactsList: cList },
    });
  };

  return (
    <AppContext.Provider
      value={{
        ...state,
        loginUser,
        signupUser,
        setShowContactInfo,
        setShowAddUser,
        setOtherUser,
        addNewContacts,
        setChat,
        setNewMessagesArr,
        newMessagesSeen,
        //  setOnlineUsers
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

const useAppContext = () => {
  return useContext(AppContext);
};

export { AppContext, AppProvider, useAppContext };
