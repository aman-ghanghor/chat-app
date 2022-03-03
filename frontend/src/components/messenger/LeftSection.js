import { useState, useEffect } from "react";

import { useAppContext } from "../../context/context";

const LeftSection = () => {
  const { contactsList } = useAppContext();

  return (
    <section className="left-section leftbar">
      <h1 className="section-title">New Chat</h1>
      <div className="searchbar">
        <input type="text" placeholder="Search..." />
      </div>
      <ul className="user-list styled-scrollbar">
        {contactsList.map((contact, index) => { 
          return <Contact key={index} contact={contact} />;
        })}
      </ul>
    </section>
  );
};


// -------- User component ---------

const Contact = ({ contact }) => {
  const {setOtherUser} = useAppContext() ;
  const { firstname, lastname, avatar, newMessagesCount, isOnline } = contact;
  
  return (
    <li className="user" onClick={() => setOtherUser(contact)}>
      <div className="profile-photo">
        <img
          src={avatar}
          alt={`${firstname} ${lastname}`}
        />
        <span className={isOnline ? "online": "offline"} > </span>
      </div>
      <div className="user-info">
        <h4 className="name">{`${firstname} ${lastname}`}</h4>
        <span className="time">3:33 PM</span>
        <div className="msg"> 
          <p> Hello Rohit, it's John </p>
          {newMessagesCount > 0 ? <span>{newMessagesCount}</span>: null} 
        </div>
      </div>
    </li>
  )
}





export default LeftSection;





