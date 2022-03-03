import { useState, useEffect } from "react";
import { useAppContext } from "./context/context";
import { Route, Switch, BrowserRouter } from "react-router-dom";

// pages
import Login from "./pages/login/Login";
import Signup from "./pages/signup/Signup";
import Messenger from "./pages/messenger/Messenger";

const App = () => {
  const { } = useAppContext();
  return (
    <>
      <BrowserRouter>
         <Switch>
            <Route exact path="/">
              <Messenger/>
            </Route>
            <Route exact path="/login"> 
              <Login/>
            </Route>
            <Route exact path="/signup"> 
              <Signup/>
            </Route>
            <Route>
              <h3>Error</h3>
            </Route>
         </Switch>
      </BrowserRouter>
    </>
  );
};

export default App;
