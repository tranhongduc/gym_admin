import React, { createContext, useState, useContext, useEffect } from 'react';

// Tạo GlobalContext
const GlobalContext = createContext();

export const useGlobalContext = () => useContext(GlobalContext);

// Tạo GlobalProvider để quản lý trạng thái người dùng và token
export const GlobalProvider = ({ children }) => {             
  const [user, setUser] = useState(() => {
    const storedData = localStorage.getItem("user");
    return storedData ? JSON.parse(storedData) : null;
  });
  
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const authData = localStorage.getItem("isAuthenticated");
    return authData ? JSON.parse(authData) : false;
  });
  
  const [accessToken, setAccessToken] = useState(() => {
    return localStorage.getItem("accessToken") || null;
  });
  
  const [refreshToken, setRefreshToken] = useState(() => {
    return localStorage.getItem("refreshToken") || null;
  });
  
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const loggedIn = localStorage.getItem("isLoggedIn");
    return loggedIn ? JSON.parse(loggedIn) : false;
  });
  
  
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);
  
  useEffect(() => {
    localStorage.setItem("isAuthenticated", JSON.stringify(isAuthenticated));
  }, [isAuthenticated]);
  
  useEffect(() => {
    if (accessToken) {
      localStorage.setItem("accessToken", accessToken);
    } else {
      localStorage.removeItem("accessToken");
    }
  }, [accessToken]);
  
  useEffect(() => {
    if (refreshToken) {
      localStorage.setItem("refreshToken", refreshToken);
    } else {
      localStorage.removeItem("refreshToken");
    }
  }, [refreshToken]);
  
  useEffect(() => {
    localStorage.setItem("isLoggedIn", JSON.stringify(isLoggedIn));
  }, [isLoggedIn]);
  

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedAccessToken = localStorage.getItem("accessToken");
    const storedRefreshToken = localStorage.getItem("refreshToken");
    const storedIsLoggedIn = localStorage.getItem("isLoggedIn");
  
    if (storedUser && storedAccessToken) {
      setUser(JSON.parse(storedUser));
      setAccessToken(storedAccessToken);
      setRefreshToken(storedRefreshToken);
      setIsAuthenticated(true);
      setIsLoggedIn(JSON.parse(storedIsLoggedIn));
    }
  }, []);
  


  return (
    <GlobalContext.Provider value={{ user, setUser, isAuthenticated, setIsAuthenticated,accessToken, setAccessToken, refreshToken, setRefreshToken , isLoggedIn, setIsLoggedIn }}>
      {children}
    </GlobalContext.Provider>
  );
};
export default GlobalProvider;
