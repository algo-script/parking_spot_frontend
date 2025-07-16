import React, { createContext, useEffect, useState } from 'react';


export const Mycontext = createContext();

export const ContextProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('authToken') || '');
  // console.log(token);
  

  const handleSetToken = (newToken) => {
    setToken(newToken);
    if (newToken) {
      localStorage.setItem('authToken', newToken);
    } else {
      localStorage.removeItem('authToken');
    }
  };

  const contextval = {
    token,
    setToken: handleSetToken,
  };

  return (
    <Mycontext.Provider value={contextval}>
      {children}
    </Mycontext.Provider>
  );
};