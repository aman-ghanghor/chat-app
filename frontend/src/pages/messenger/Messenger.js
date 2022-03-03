import "./messenger.css"
import { useEffect } from "react";
import { useAppContext } from "../../context/context";
import { useHistory } from "react-router-dom";

import Header from "../../components/messenger/Header"
import LeftSection from "../../components/messenger/LeftSection"
import RightSection from "../../components/messenger/RightSection"
import ChatSection from "../../components/messenger/ChatSection"
import AddUser from "../../components/messenger/AddUser";
import ContactsLoader from "../../components/messenger/ContactsLoader";


const Messenger = () => {
  const {contactsLoading , isLoggedIn, isAppLoading, showContactInfo, showAddUser } = useAppContext();
  const history  = useHistory() ;

  useEffect(()=>{
    if(!isLoggedIn){
      history.push("/login")
    }
  }, [])

  // when isLoggedIn===true and isAppLoading false
  if(!isAppLoading && isLoggedIn) {
      return (
        <div className="messenger-container">
          <Header/>
          <LeftSection/>
          <ChatSection /> 
          {showContactInfo ? <RightSection/> : null }
          {showAddUser ? <AddUser />: null}
          {contactsLoading ? <ContactsLoader />: null}
        </div>
      )
  } 
  else {
    return <div> Loading... </div>
  }
};

export default Messenger;




