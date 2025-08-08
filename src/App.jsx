import React from "react";
import Routes from "./Routes";
import { ContextProvider } from "context/context";
// import "leaflet/dist/leaflet.css";

function App() {
  return (
    <ContextProvider>
       <Routes />
    </ContextProvider>
  );
}

export default App;
