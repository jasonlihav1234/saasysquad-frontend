"use client";
import { Roboto } from "next/font/google";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const roboto = Roboto({
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export default function AuthSuccessPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const tokens = window.location.hash.substring(1);
      const params = new URLSearchParams(tokens);

      const accessToken = params.get("access_token");
      const refreshToken = params.get("refresh_token");

      if (accessToken && refreshToken) {
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);

        window.history.replaceState(null, "", "/dashboard");
        router.push("/dashboard");
      } else {
        setError("No authentication tokens found");
        setTimeout(() => router.push("/login"), 3000);
      }
    } else {
    }
  }, [router]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#F9F8F6]">
      {error ? (
        <div
          className={`text-[#B22222] text-3xl ${roboto.className} tracking-wide`}
        >
          {error}
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <div className="h-20 w-20 animate-spin rounded-full border-4 border-[#CBA65E] border-t-transparent"></div>
          <p
            className={`mt-4 text-[#5c5a5a] animate-pulse text-center text-xl ${roboto.className}`}
          >
            Completing secure login...
          </p>
        </div>
      )}
    </main>
  );
}
