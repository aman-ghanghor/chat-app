import axios from "axios";

const reducer = (state, action) => {
  const { type, payload } = action;
  
  // login the user
  if (type === "LOGIN") {
    return {...state, isLoggedIn: true, isAppLoading: true, currentUser: payload}
  }
  
  // Load the App
  if (type==="LOAD_APP") {
    return {...state, isAppLoading: false, contactsList: payload}
  }

  // set app loading
  if(type==="APP_LOADING") {
    return {...state, isAppLoading: payload}
  }

  // signup the user
  if (type === "SIGNUP") {
    return { ...state, isLoggedIn: true, currentUser: payload };
  }

  // chat Loading
  if( type=== "CHAT_LOADING") {
    return {...state, chatLoading: payload}
  }

  if( type==="FETCH_CHAT") {
    return {...state, chat: payload, chatLoading: false}
  }

  if( type==="SET_CHAT") {
    return {...state, chat: payload}
  }

  if( type==="SET_NEW_MESSAGES") {
    return {...state, ...payload}
  }

  if(type=== "NEW_MESSAGES_SEEN") {
    return {...state, ...payload}
  }
  
  if(type === "CONTACT_INFO") {
      return {...state, showContactInfo: payload}
  }
  
  // set other user for chat
  if (type === "OTHER_USER") {
    return {...state, otherUser: payload}
  }

  if(type=== "ADD_CONTACTS") {
    return {...state, contactsList: payload}
  }

  if(type=== "ADD_NEW_CONTACTS") {
    return {...state, contactsList: payload, contactsLoading: false }
  }

  if(type=== "LOADING_NEW_CONTACTS") {
    return {...state, contactsLoading: payload}
  }

  if(type === "SHOW_ADD_USER") {
    return {...state, showAddUser: payload}
  }

  if(type === "SET_ONLINE_USERS") {
    return {...state, onlineUsers: payload}
  }

  if(type === "UPDATE_CONTACTS") {
    return {...state, contactsList: payload}
  }





  // Experiments

  if(type==="SET_SOCKET") {
    return {...state, socket: payload}
  }


};

export default reducer;
