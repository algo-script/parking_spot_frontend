// components/ProtectedRoute.js
import { Mycontext } from 'context/context';
import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { token, userRole } = useContext(Mycontext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/", { replace: true });
    } else if (allowedRoles && !allowedRoles.includes(userRole)) {
      navigate("/", { replace: true }); 
    }
  }, [token, userRole, allowedRoles, navigate]);

  if (!token) return null; 

  return children;
};


export default ProtectedRoute;