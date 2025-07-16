import React from "react";
import Routes from "./Routes";
import { ContextProvider } from "context/context";

function App() {
  return (
    <ContextProvider>
       <Routes />
    </ContextProvider>
  );
}

export default App;
