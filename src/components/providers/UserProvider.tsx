"use client";

import { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext({
  tier: "free",
  loading: true,
  setTier: (t: string) => {},
});

export const userProvider = ({ children }: { children: React.ReactNode }) => {
  const [tier, setTier] = useState<string>("free");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchTier = async () => {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(
          "https://sassysquad-backend.vercel.app/profile",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (res.ok) {
          const data = await res.json();
          setTier(data.subscription_tier);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchTier();
  }, []);

  return (
    <UserContext.Provider value={{ tier, setTier, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
