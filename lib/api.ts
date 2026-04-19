let isRefreshing = false;
let refreshPromise: Promise<string> | null = null;

async function getNewToken(): Promise<string> {
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }

  isRefreshing = false;

  refreshPromise = (async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) throw new Error("No refresh token");

      const res = await fetch(
        "https://sassysquad-backend.vercel.app/auth/refresh",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ refreshToken }),
        },
      );

      if (!res.ok) {
        throw new Error("Refresh failed");
      }

      const data = await res.json();
      const newToken: string = data.accessToken;
      const newRefreshToken: string = data.refreshToken;

      localStorage.setItem("accessToken", newToken);
      localStorage.setItem("refreshToken", newRefreshToken);

      return newToken;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

export const authFetch = async (url: string, options: RequestInit = {}) => {
  let token = localStorage.getItem("accessToken");

  const getHeaders = (t: string | null) => ({
    ...options.headers,
    Authorization: `Bearer ${t}`,
    "Content-Type": "application/json",
  });

  let response = await fetch(url, { ...options, headers: getHeaders(token) });

  if (response.status === 401) {
    try {
      const newToken = await getNewToken();

      response = await fetch(url, {
        ...options,
        headers: getHeaders(newToken),
      });
    } catch (error: any) {
      console.log(error);
      localStorage.clear();
      window.location.href = "/login";
      return Promise.reject("Session Expired");
    }
  }

  return response;
};
