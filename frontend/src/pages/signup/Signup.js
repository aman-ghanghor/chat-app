import { useAppContext } from "../../context/context";
import { useHistory, NavLink } from "react-router-dom";
import React, { useState, useEffect } from "react";
import axios from "axios";

import "./signup.css";
import signupImage from "../../assets/images/avatar2.jpg";

const endPoint1 = "http://localhost:8000/api/user";

const Signup = () => {
  const history = useHistory();
  const { isLoggedIn, signupUser } = useAppContext();
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [file, setFile] = useState("") ;

  const controller = new AbortController();
  useEffect(()=>{
    return () => {
      controller.abort()
    }
  }, [])

  const submitHandle = (e) => {
    e.preventDefault();
    const username = "@" + firstname.trim().toLowerCase() + lastname.trim().toLowerCase() ;
    alert(username)
    if (firstname && lastname && email && password) {
      const userData = new FormData();
      userData.append("firstname", firstname);
      userData.append("lastname", lastname);
      userData.append("email", email);
      userData.append("password", password);
      userData.append("avatar", file);
      userData.append("contacts", []) ;
      userData.append("username", username)
      createNewUser(userData);
    }
  };

  const handleFirstName = (e) => {
    setFirstname(e.target.value);
  };
  const handleLastName = (e) => {
    setLastname(e.target.value);
  };
  const handleEmail = (e) => {
    setEmail(e.target.value);
  };
  const handlePassword = (e) => {
    setPassword(e.target.value);
  };
  const handleFile = (e) => {
    setFile(e.target.files[0]) ;
  };

  const createNewUser = async (userData) => {
    axios
      .post(`${endPoint1}`, userData, {signal: controller.signal})
      .then((res) => {
        if (res.status === 200) {
          console.log(res)
          if(res.data === "ALREADY_EXISTS") {
            alert("This email already associated with an account") ;
          } else {
            clearAllFields() ;
            signupUser(res.data)
          }
        } else{
          alert("Something went wrong!") ;
        }
      })
      .catch((err) => console.log(err));
  };

  const clearAllFields = () => {
    setFirstname("");
    setLastname("");
    setEmail("");
    setPassword("");
    setFile("") ;
  };

  if (isLoggedIn) {
    history.push("/")
  }

  return (
    <section className="signup-section">
      <div className="signup-wrapper">
        <div className="signup-photo">
          <img src={signupImage} alt="image" />
        </div>
        <div className="signup">
          <h1 className="title">Sign Up</h1>
          <form
            className="signup-form"
            encType="multipart/form-data"
            onSubmit={submitHandle}
          >
            <div className="form-control">
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={firstname}
                onChange={handleFirstName}
              />
            </div>
            <div className="form-control">
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={lastname}
                onChange={handleLastName}
              />
            </div>
            <div className="form-control">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={email}
                onChange={handleEmail}
              />
            </div>
            <div className="form-control">
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={password}
                onChange={handlePassword}
              />
            </div>
            <div className="form-control">
              <input
                type="file"
                name="profilePhoto"
                accept="image/*"
                files={file}
                onChange={handleFile}
              />
            </div>
            <div className="form-btn">
              <button type="submit">Submit</button>
            </div>
          </form>
          <div className="another-option">
            <span>Already have an account ? </span>
            <NavLink to="/login" className="login-link">
              Login
            </NavLink>
          </div>
        </div>
      </div>
      {/* <SecondStep /> */}
    </section>
  );
};



/*const SecondStep = () => {
    const [username, setUsername] = useState("") ;
    
    return (
      <form className="signup-form-2">
        <div className="form-control">
          <label htmlFor="username">@</label>
          <input type="text" id="username" placeholder="Username" onChange={(e)=> setUsername(e.target.value)} />
          <button type="submit">Submit</button>
        </div>
      </form>
    )
}*/



export default Signup ;












