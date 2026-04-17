"use client";

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
  loading: boolean;
  refreshTier: () => Promise<void>;
}

const UserContext = createContext<UserContextType>({
  tier: "free",
  loading: true,
  refreshTier: async () => {},
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [tier, setTier] = useState<Tier>("free");
  const [loading, setLoading] = useState(true);

  const fetchTier = async () => {
    setLoading(true);
    const token = localStorage.getItem("accessToken");

    if (!token) {
      setTier("free");
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
    } catch (e) {
      setTier("free");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTier();
  }, []);

  return (
    <UserContext.Provider value={{ tier, loading, refreshTier: fetchTier }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
