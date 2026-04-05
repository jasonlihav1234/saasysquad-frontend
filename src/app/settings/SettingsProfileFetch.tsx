"use client";

import { useEffect } from "react";

async function fetchUserProfile(): Promise<unknown | undefined> {
  console.log("Hi");
  try {
    console.log("Hi went thru");
    const response = await fetch("https://sassysquad-backend.vercel.app/user", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });

    if (response.status === 200) {
      const data = await response.json();
      console.log("User profile response:", data);
      return data;
    }
  } catch (error) {
    console.log("Hi error");
    throw error;
  }
}

export function SettingsProfileFetch() {
  useEffect(() => {
    void fetchUserProfile();
  }, []);

  return null;
}
