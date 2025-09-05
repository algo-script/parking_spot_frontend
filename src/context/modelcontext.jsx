import { createContext, useState } from "react";

export const ModelContext = createContext();

export const ModelProvider = ({ children }) => {
    const [authModalOpen, setAuthModalOpen] = useState(false);
    const [authModalTab, setAuthModalTab] = useState("signin");
  
    
    
  
    const openSignInModal = () => {
      setAuthModalTab("signin");
      setAuthModalOpen(true);
    };
  
    const openSignUpModal = () => {
      setAuthModalTab("signup");
      setAuthModalOpen(true);
    };

  const contextval = {
    authModalOpen,
    authModalTab,
    openSignUpModal,
    openSignInModal,
    setAuthModalOpen,
  };

  return (
    <ModelContext.Provider value={contextval}>{children}</ModelContext.Provider>
  );
};
