import { useState, useEffect, useRef } from "react";

import {useAppContext} from "../../context/context"

import axios from "axios";

import { RiCloseLine } from "react-icons/ri";
import { IoCloseSharp } from "react-icons/io5";
import { IoClose } from "react-icons/io5";


const endPoint = "http://localhost:8000/api/";
const endPoint1 = "http://localhost:8000/api/user";
const regx = /^@\w{1,25}$/;

const AddUser = () => {
  const {currentUser, addNewContacts, contactsList, setShowAddUser} = useAppContext() ;
  const [usernameList, setUsernameList] = useState([]);
  const [username, setUsername] = useState("");
  const [matches, setMatches] = useState([]);
  const [rawMatch, setRawMatch] = useState([]) ;
  const [isDisabled, setIsDisabled] = useState([]) ;
  const searchRef = useRef() ;
  
  useEffect(()=>{
    if(usernameList.length===0 ) {
      setIsDisabled(true) ;
    } else {
      setIsDisabled(false)
    }
  }, [usernameList])

  useEffect(() => {
    let mount = true ;
    if (username.match(regx)) {
      const getMatches = async () => {
        try {
          const {data: matches_data} = await axios.get(`${endPoint}user/getMatches?search=${username}`);
          const filtered_matches = matches_data.filter((match)=>{
            if(match.username===currentUser.username) {
              console.log("CURRENTuser")
              return false;
            }
            if(usernameList.includes(match.username)){
              console.log("INCLUDES")
              return false 
            } 
            if(contactsList.some((contact)=> (match.username===contact.username))) {
              return false 
            }
            return true ;
          })
          if(mount) {
            setRawMatch(filtered_matches)
          }
        } catch (err) {
          console.log(err);
        }
      }
      getMatches()
    } else {
      setMatches([])
    }
    // cleanup 
    return () => {
      mount = false ;
    }

  }, [username])


  useEffect(()=>{
    let mount = true
    if(rawMatch.length > 0) {
      const getAvatars = async () => {
        const mapped = await Promise.all(rawMatch.map( async (match)=>{
          const {data} = await axios.get(`${endPoint1}/getFile?avatar=${match.avatar}`, {responseType: "blob"}) ;
          const avatar = URL.createObjectURL(data) ;
          return {...match, avatar}
        }))
        if(mount) {
          setMatches(mapped)
        }
      }
      getAvatars() ;
    }
    return () => {
      mount = false 
    }
  }, [rawMatch])

  
  const handleChange = (e) => {
    const value = e.target.value;
    if (!(value.endsWith(" ") || value.startsWith(" ") || value.includes(" "))) {
      setUsername(e.target.value);
    }
    if(value==="") {
      setMatches([]);
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rawMatch.find((match) => match.username===username)) {
      setUsernameList([...usernameList, username]);
      setUsername("");
      setRawMatch([]);
    } else {
      console.log()
    }
  }
  

  const removeUsername = (removeIndex) => {
    const newList = usernameList.filter((item, index) => {
      return index !== removeIndex;
    });
    setUsernameList(newList);
    searchRef.current.focus() ;
  }

  const handleMatchedClick = (u_name) => {
    setUsernameList([...usernameList, u_name]) ;
    setUsername("") ;
    setMatches([])
    searchRef.current.focus() ;
  }

  const handleAddClick = async () => {
    let mount = true ;
    if(usernameList.length > 0) {
      try {
        const res = await axios.post(`${endPoint}user/addContacts?me_id=${currentUser._id}`, usernameList) ;
        console.log(res.data) 
        if(res.data==="ADDED"){
          if(mount){
            addNewContacts(usernameList);
            setUsernameList([]) ;
            setShowAddUser(false)
            console.log("Added in contact")
            mount = false;
          }
        } else {
          console.log("Unable to Add")
        }
      } catch (error) {
        console.log(error) ;
      }
    } else {
      alert("No user is entered to be added") ;
    }
  }


  return (
    <section className="addUser-section">
      <div className="wrapper">
        <div className="header">
          <h2>Add your friends to PsamTalk</h2>
          <p>Enter the usernames of people you want to add below.</p>
        </div>
        <div className="middle">
          <div className="search-box styled-scrollbar" onClick={() => searchRef.current.focus() }>
            <div className="username-list">
              {usernameList.map((item, index) => {
                return (
                  <div key={index} className="username">
                    <p>{item}</p>
                    <span onClick={() => removeUsername(index)}>
                      <RiCloseLine />
                    </span>
                  </div>
                );
              })}
            </div>
            <form onSubmit={handleSubmit}>
              <div className="autogrow">{username}</div>
              <input
                type="text"
                className="search-input"
                ref={searchRef}
                value={username}
                onChange={handleChange}
                autoFocus
              />
            </form>
          </div>
          {matches.length !== 0 ? (
            <div className="match-box">
              <h3>Matches</h3>
              <ul className="match-list styled-scrollbar">
                {matches.map((user, index) => {
                  const { username, avatar } = user;
                  return (
                    <li
                      key={index}
                      className="matched-user"
                      onClick={() => handleMatchedClick(username)}
                    >
                      <img src={avatar} alt="user" />
                      <span>{username}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : null}
        </div>
        <div className="footer">
          <button className="add-user" onClick={handleAddClick} disabled={isDisabled} > Add </button>
        </div>
      </div>
    </section>
  );
};





export default AddUser;
