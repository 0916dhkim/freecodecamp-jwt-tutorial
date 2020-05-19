import React, { useState, useEffect } from 'react';
import { Router, navigate } from "@reach/router";
import logo from './logo.svg';
import { Content } from "./components/Content";
import { Login } from "./components/Login";
import { Navigation } from "./components/Navigation";
import { Protected } from "./components/Protected";
import { Register } from "./components/Register";
import './App.css';

export const UserContext = React.createContext([]);

function App() {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const logoutCallback = async () => {
    await fetch("http://localhost:4000/logout", {
      method: "POST",
      credentials: "include"
    });
    // Clear user from context.
    setUser({});
    // Redirect to startpage.
    navigate("/");
  };

  useEffect(() => {
    async function checkRefreshToken() {
      const result = await (await fetch("http://localhost:4000/refresh_token", {
        method: "POST",
        credentials: "include", // Need to include the cookie.
        headers: {
          "Content-Type": "application/json"
        }
      })).json();
      setUser({
        accesstoken: result.accessToken
      });
      setLoading(false);
    }
    checkRefreshToken();
  }, []);

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <UserContext.Provider value={[user, setUser]}>
      <div className="app">
        <Navigation logoutCallback={logoutCallback} />
        <Router id="router">
          <Login path="login" />
          <Register path="register" />
          <Protected path="protected" />
          <Content path="/" />
        </Router>
      </div>
    </UserContext.Provider>
  );
}

export default App;
