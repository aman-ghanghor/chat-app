import { useState, useEffect } from "react";
import { useAppContext } from "../../context/context";
import { NavLink, useHistory} from "react-router-dom" ;
import axios from "axios" ;

import "./login.css";

import loginImage from "../../assets/images/avatar2.jpg";

const endPoint1 = "http://localhost:8000/api/user";

const Login = () => {
  const {isLoggedIn, loginUser} = useAppContext() ;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("") ;
  const [isDisabled, setIsDisabled] = useState("") ;

  const history = useHistory() ;

  useEffect(()=>{
    if(isLoggedIn) {
      history.push("/")
    }
  }, [isLoggedIn])

  const handleSubmit = async (e) => {
    e.preventDefault() ;
    if(!(email==="" || password==="")) {
      setIsDisabled(true) ;
      try {
        const {data} = await axios.get(`${endPoint1}/login?email=${email}&password=${password}`) ;
        if(data!=="INCORRECT") {
          clearFields() ;
          loginUser(data)
        }
        else{
          alert("Email or Password is incorrect !") ;
          setIsDisabled(false)
        }
      } catch(err) {
        console.log(err)
      }
    } else {
      alert("Email or Password is empty!") ;
    }
  }

  const clearFields = () => {
    setEmail("");
    setPassword("") ;
  }

  return (
    <section className="login-section">
      <div className="login-wrapper">
        <div className="login-photo">
          <img src={loginImage} alt="image" />
        </div>
        <div className="login">
          <h1 className="title"> Login Form </h1>
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-control">
              <input type="email" name="email" placeholder="Email" value={email} onChange={(e)=> setEmail(e.target.value)} />
            </div>
            <div className="form-control">
              <input type="password" name="password" placeholder="Password" value={password} onChange={(e)=> setPassword(e.target.value)} />
            </div>
            <div className="form-btn">
              <button type="submit" disabled={isDisabled}>Login</button>
            </div>
          </form>
          <div className="another-option">
            <span>Don't have an account ? </span> 
            <NavLink to="/signup" className="signup-link"> Sign Up</NavLink>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
