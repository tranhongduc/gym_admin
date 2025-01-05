import React, { createContext, useState, useContext } from 'react';

// Tạo GlobalContext
const GlobalContext = createContext();

export const useGlobalContext = () => useContext(GlobalContext);

// Tạo GlobalProvider để quản lý trạng thái người dùng và token
export const GlobalProvider = ({ children }) => {             
  const [user, setUser] = useState();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);


  


  return (
    <GlobalContext.Provider value={{ user, setUser, isAuthenticated, setIsAuthenticated,accessToken, setAccessToken, refreshToken, setRefreshToken , isLoggedIn, setIsLoggedIn }}>
      {children}
    </GlobalContext.Provider>
  );
};
export default GlobalProvider;
