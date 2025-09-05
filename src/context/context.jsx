import React, { createContext, useEffect, useState } from 'react';
import { getUserProfile } from 'utils/helperFunctions';
import axios from "axios";


export const Mycontext = createContext();

export const ContextProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('authToken') || '');
  const [userRole,setuserRole] = useState(localStorage.getItem('role') || '');
  const [user, setUser] = useState(null);
  const [country, setCountry] = useState("");
 
  
  useEffect(() => {
    if (token) {
      fetchUserData();
    }
  }, [token]);

  useEffect(() => {
    if (userRole === "User"|| !userRole) {
      if (!navigator.geolocation) {
        const msg = "Geolocation not supported by this browser";
        console.error(msg);
        return;
      }
      // console.log("User");
      
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          try {
            const { latitude, longitude } = pos.coords;
  
            // Reverse geocode using OpenStreetMap (with axios)
            const res = await axios.get(
              `https://nominatim.openstreetmap.org/reverse`,
              {
                params: {
                  lat: latitude,
                  lon: longitude,
                  format: "json",
                },
              }
            );
  
            if (res.data?.address?.country) {
              setCountry(res.data.address.country);
            } else {
              const msg = "Unable to fetch country";
              console.error(msg);
          
            }
          } catch (err) {
            console.error("Reverse geocode error:", err)
          } 
        },
        (err) => {
          console.error("Geolocation error:", err);
        }
      );
    }
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await getUserProfile();
      const userData = response.data;
      setUser(userData);
    } catch (err) {
      console.error(err);
    }
  };


  

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


  const contextval = {
    token,
    setToken: handleSetToken,
    userRole,user,updateUser:fetchUserData,country
  };

  return (
    <Mycontext.Provider value={contextval}>
      {children}
    </Mycontext.Provider>
  );
};