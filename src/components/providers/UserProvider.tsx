"use client";

import { Darumadrop_One } from "next/font/google";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

type Tier = "free" | "pro" | "enterprise";

interface UserContextType {
  tier: Tier;
  userId: string | null;
  loading: boolean;
  refreshTier: () => Promise<void>;
}

const UserContext = createContext<UserContextType>({
  tier: "free",
  userId: null,
  loading: true,
  refreshTier: async () => {},
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [tier, setTier] = useState<Tier>("free");
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchTier = async () => {
    setLoading(true);
    const token = localStorage.getItem("accessToken");

    if (!token) {
      setTier("free");
      setUserId(null);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("https://sassysquad-backend.vercel.app/profile", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setTier(data.response[0].subscription_tier || "free");
      setUserId(data.response[0].user_id || null);
    } catch (e) {
      setTier("free");
      setUserId(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTier();
  }, []);

  return (
    <UserContext.Provider
      value={{ tier, userId, loading, refreshTier: fetchTier }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
