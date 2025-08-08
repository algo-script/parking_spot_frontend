// components/ProtectedRoute.js
import { Mycontext } from 'context/context';
import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const { token } = useContext(Mycontext);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!token) {
      navigate("/", { replace: true });
    }
  }, [token, navigate]);

  if (!token) {
    return null; // or a loading spinner while the redirect happens
  }

  return children;
};

export default ProtectedRoute;