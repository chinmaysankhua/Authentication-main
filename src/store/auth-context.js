import React, { useState, useRef } from "react";

const AuthContext = React.createContext({
  token: "",
  isLoggedIn: false,
  login: (token) => {},
  logout: () => {},
});

const SESSION_DURATION = 5 * 60 * 1000;

export const AuthContextProvider = (props) => {
  const storedToken = localStorage.getItem("token");
  const storedExpiry = localStorage.getItem("tokenExpiry");

  const getInitialToken = () => {
    if (!storedToken || !storedExpiry) {
      return null;
    }

    if (Date.now() > Number(storedExpiry)) {
      localStorage.removeItem("token");
      localStorage.removeItem("tokenExpiry");

      return null;
    }

    return storedToken;
  };

  const [token, setToken] = useState(getInitialToken);

  const timerRef = useRef(null);

  const logoutHandler = () => {
    setToken(null);

    localStorage.removeItem("token");
    localStorage.removeItem("tokenExpiry");

    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const loginHandler = (token) => {
    
    const expiryTime = Date.now() + SESSION_DURATION;

    setToken(token);

    localStorage.setItem("token", token);
    localStorage.setItem("tokenExpiry", expiryTime);

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    
    timerRef.current = setTimeout(() => {
      logoutHandler();
    }, SESSION_DURATION);
  };

  const contextValue = {
    token: token,
    isLoggedIn: !!token,
    login: loginHandler,
    logout: logoutHandler,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;