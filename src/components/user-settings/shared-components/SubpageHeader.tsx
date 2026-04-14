"use client";

import { Gelasio, Roboto } from "next/font/google";
import Link from "next/link";
import { useRouter } from "next/navigation";

const gelasio = Gelasio({
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const roboto = Roboto({
  subsets: ["latin"],
  style: ["normal", "italic"],
});

interface SubpageHeaderProps {
  title: string;
}

export default function SubpageHeader({ title }: SubpageHeaderProps) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const response = await fetch(
        "https://sassysquad-backend.vercel.app/auth/logout",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify({
            refereshToken: localStorage.getItem("refreshToken"),
          }),
        },
      );

      if (response.status === 200) {
        localStorage.clear();
        router.push("/login");
      } else {
        alert("Failed to logout.");
      }
    } catch (error) {
      alert(error);
    }
  };

  return (
    <header className="flex items-center justify-between bg-[#191c1b] border-b border-[#C5A059]/20 px-10 py-4">
      <Link
        href="/dashboard"
        className={`${roboto.className} flex items-center gap-2 text-[#F9F8F6] hover:text-black transition-colors duration-200 tracking-widest text-sm uppercase`}
      >
        ← Back to Main
      </Link>
      <div className="flex flex-row items-center gap-4">
        <h2
          className={`${gelasio.className} text-[#F9F8F6] text-xl font-medium tracking-tight`}
        >
          {title}
        </h2>
        <button
          type="button"
          onClick={handleLogout}
          className={`${gelasio.className} text-[#F9F8F6] text-xl hover:underline font-black cursor-pointer font-medium tracking-tight`}
        >
          Logout
        </button>
      </div>
    </header>
  );
}
