import React, { createContext, useEffect, useState } from 'react';


export const Mycontext = createContext();

export const ContextProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('authToken') || '');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState('signin');
  

  const handleSetToken = (newToken) => {
    setToken(newToken);
    if (newToken) {
      localStorage.setItem('authToken', newToken);
    } else {
      setToken('')
      localStorage.removeItem('authToken');
    }
  };

  const openSignInModal = () => {
    setAuthModalTab('signin');
    setAuthModalOpen(true);
  };

  const openSignUpModal = () => {
    setAuthModalTab('signup');
    setAuthModalOpen(true);
  };

  const contextval = {
    token,
    setToken: handleSetToken,
    authModalOpen, setAuthModalOpen,
    authModalTab, setAuthModalTab,openSignInModal,openSignUpModal
  };

  return (
    <Mycontext.Provider value={contextval}>
      {children}
    </Mycontext.Provider>
  );
};