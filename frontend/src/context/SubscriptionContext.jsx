import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import api from "../services/api";
import { useAuth } from "./AuthContext";

const SubscriptionContext = createContext(null);

export function SubscriptionProvider({ children }) {
  const { isAuthenticated, user } = useAuth();
  const [subscription, setSubscription] = useState({
    plan: "free",
    status: "active",
    isPro: false
  });
  const [loading, setLoading] = useState(true);

  // Keep a mutable ref of isAuthenticated to reject stale async responses after logout
  const authRef = useRef(isAuthenticated);
  useEffect(() => {
    authRef.current = isAuthenticated;
  }, [isAuthenticated]);

  const fetchSubscription = async () => {
    try {
      setLoading(true);
      const res = await api.get("/subscription/me");
      if (authRef.current && res.data?.success) {
        setSubscription(res.data.subscription);
      }
    } catch (err) {
      console.error("Failed to load subscription status:", err);
      if (authRef.current) {
        setSubscription({ plan: "free", status: "active", isPro: false });
      }
    } finally {
      if (authRef.current) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      setSubscription({ plan: "free", status: "active", isPro: false });
      setLoading(false);
      return;
    }

    fetchSubscription();
  }, [isAuthenticated, user]);

  useEffect(() => {
    const handleProChange = () => {
      fetchSubscription();
    };
    window.addEventListener("mindflare-pro-change", handleProChange);
    return () => {
      window.removeEventListener("mindflare-pro-change", handleProChange);
    };
  }, [isAuthenticated]);

  return (
    <SubscriptionContext.Provider value={{
      ...subscription,
      loading,
      refreshSubscription: fetchSubscription
    }}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error("useSubscription must be used within a SubscriptionProvider");
  }
  return context;
}
