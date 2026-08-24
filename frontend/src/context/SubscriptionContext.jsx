import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

const SubscriptionContext = createContext(null);

export function SubscriptionProvider({ children }) {
  const [subscription, setSubscription] = useState({
    plan: "free",
    status: "active",
    isPro: false
  });
  const [loading, setLoading] = useState(true);

  const fetchSubscription = async () => {
    try {
      setLoading(true);
      const res = await api.get("/subscription/me");
      if (res.data?.success) {
        setSubscription(res.data.subscription);
      }
    } catch (err) {
      console.error("Failed to load subscription status:", err);
      // Fallback default
      setSubscription({ plan: "free", status: "active", isPro: false });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscription();

    const handleProChange = () => {
      fetchSubscription();
    };
    window.addEventListener("mindflare-pro-change", handleProChange);
    return () => {
      window.removeEventListener("mindflare-pro-change", handleProChange);
    };
  }, []);

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
