import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import { apiRequest, API_ENDPOINTS } from "../config/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
        fetchUserDetails(decoded.id);
      } catch (err) {
        console.error("Token non valido", err);
        localStorage.removeItem("token");
        setUser(null);
        setToken(null);
      }
    }
  }, [token]);

  const fetchUserDetails = async (userId) => {
    try {
      const res = await apiRequest(`${API_ENDPOINTS.USER_INFO}/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUserDetails(data);
      }
    } catch (err) {
      console.error("Errore nel recupero dettagli utente:", err);
    }
  };

  const login = (newToken, userData) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    const decoded = jwtDecode(newToken);
    setUser(decoded);
    if (userData) {
      setUserDetails(userData);
    }
    navigate("/dashboard");
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setUserDetails(null);
    setToken(null);
    navigate("/login");
  };

  const updateUserDetails = (newDetails) => {
    setUserDetails(newDetails);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      userDetails, 
      token, 
      login, 
      logout, 
      updateUserDetails,
      fetchUserDetails: () => fetchUserDetails(user?.id)
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth deve essere usato dentro un AuthProvider");
  return context;
};