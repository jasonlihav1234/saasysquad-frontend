"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { authFetch } from "../../../lib/api";

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

    try {
      const res = await authFetch(
        "https://sassysquad-backend.vercel.app/profile",
      );

      if (!res.ok) {
        throw new Error("Failed to fetch profile");
      }

      const data = await res.json();
      const profile = data.response?.[0];

      if (profile) {
        setTier(profile.subscription_tier || "free");
        setUserId(profile.user_id || null);
      } else {
        setTier("free");
      }
    } catch (e) {
      console.error("UserContext Error:", e);
      setTier("free");
      setUserId(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const hasToken =
      typeof window !== "undefined" && localStorage.getItem("accessToken");

    if (hasToken) {
      fetchTier();
    } else {
      setLoading(false);
    }
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
