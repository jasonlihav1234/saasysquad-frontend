"use client";

export const fetchUserProfile = async (
  router: { push: (path: string) => void },
  isRetry: boolean = false,
): Promise<any | undefined> => {
  console.log("Hi");
  try {
    const response = await fetch(
      "https://sassysquad-backend.vercel.app/user",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      },
    );

    if (response.status === 200) {
      const data = await response.json();
      console.log("User profile response:", data);
      return data;
    } 
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};
