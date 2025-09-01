import React, { createContext, useEffect, useState } from 'react';


export const Mycontext = createContext();

export const ContextProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('authToken') || '');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState('signin');
  const [userRole,setuserRole] = useState(localStorage.getItem('role') || '');
  

  const handleSetToken = (newToken,newrole) => {
    setToken(newToken);
    setuserRole(newrole)
    if (newToken) {
      localStorage.setItem('authToken', newToken);
      localStorage.setItem('role', newrole);
    } else {
      setToken('')
      setuserRole('')
      localStorage.clear();
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
    authModalTab, setAuthModalTab,openSignInModal,openSignUpModal,userRole
  };

  return (
    <Mycontext.Provider value={contextval}>
      {children}
    </Mycontext.Provider>
  );
};