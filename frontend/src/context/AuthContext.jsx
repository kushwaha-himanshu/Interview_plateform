import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const res = await api.get("/auth/me");
      if (res.data?.success) {
        setUser(res.data.user);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (err) {
      console.error("Auth check failed:", err);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const loginUser = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    if (userData) {
      localStorage.setItem("userName", userData.fullname || "User");
      localStorage.setItem("userEmail", userData.email || "");
    }
    window.dispatchEvent(new Event("mindflare-profile-change"));
  };

  const logoutUser = async () => {
    try {
      await api.post("/auth/logout");
    } catch (err) {
      console.error("Logout request failed:", err);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem("userName");
      localStorage.removeItem("userEmail");
      window.dispatchEvent(new Event("mindflare-profile-change"));
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      loading,
      loginUser,
      logoutUser,
      refreshAuth: checkAuth
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
