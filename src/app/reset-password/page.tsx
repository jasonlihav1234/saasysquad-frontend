"use client";

import { Gelasio, Roboto } from "next/font/google";
import { useRef, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";

const gelasio = Gelasio({
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const roboto = Roboto({
  subsets: ["latin"],
  style: ["normal", "italic"],
});

function ResetPasswordContent() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isSubmittingRef = useRef<boolean>(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const token = searchParams.get("token");

    if (isSubmittingRef.current) {
      return;
    } else if (!token) {
      alert("Token not found");
      setTimeout(() => router.push("/login"), 3000);
    }

    isSubmittingRef.current = true;
    setIsSubmitting(true);

    if (
      formData.get("password_reset") !== formData.get("confirm-password-reset")
    ) {
      isSubmittingRef.current = false;
      setIsSubmitting(false);
      alert("Passwords do not match");
      return;
    }

    try {
      const response = await fetch(
        "https://sassysquad-backend.vercel.app/auth/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        },
      );

      if (response.status === 200) {
        alert("Password successfully changed");
        setTimeout(() => router.push("/login"), 2000);
      } else {
        const data = await response.json();
        alert(`Issue with resetting password, try again: ${data}`);
      }
    } catch (error) {
      alert(error);
    } finally {
      setIsSubmitting(false);
      isSubmittingRef.current = false;
    }
  };

  return (
    <main className="grid grid-rows-[auto_1fr_auto] bg-[#F9F8F6] min-h-screen w-full">
      <h1
        className={`${gelasio.className} text-black text-3xl text-center pt-10`}
      >
        The Curated Althaïr
      </h1>

      <div className="flex h-full flex-col items-center pt-50 px-6 w-full">
        <h1
          className={`${gelasio.className} text-black text-5xl md:text-6xl text-center max-w-sm`}
        >
          Create New Password
        </h1>

        <p
          className={`text-center ${roboto.className} text-[#787777] pt-5 text-lg max-w-sm`}
        >
          Please enter your new password below to secure your account.
        </p>

        <form onSubmit={handleSubmit} className="pt-16 w-full max-w-md">
          <div className="flex flex-col">
            <label
              htmlFor="password-reset"
              className={`text-[#5c5a5a] ${roboto.className} tracking-widest pb-3 cursor-text`}
            >
              NEW PASSWORD
            </label>
            <input
              type="password"
              name="password-reset"
              id="password-reset"
              placeholder="********"
              className={`${roboto.className} w-full focus:outline-none bg-[#E3E2E0] border-b-2 border-[#C5A059] text-[#5c5a5a] p-5 disabled:opacity-80 disabled:cursor-not-allowed tracking-wide`}
              disabled={isSubmitting}
              required
            />
            <label
              htmlFor="confirm-password-reset"
              className={`text-[#5c5a5a] ${roboto.className} tracking-widest pb-3 cursor-text pt-10`}
            >
              CONFIRM NEW PASSWORD
            </label>
            <input
              type="password"
              name="confirm-password-reset"
              id="confirm-password-reset"
              placeholder="********"
              className={`${roboto.className} w-full focus:outline-none bg-[#E3E2E0] border-b-2 border-[#C5A059] text-[#5c5a5a] p-5 disabled:opacity-80 disabled:cursor-not-allowed tracking-wide`}
              disabled={isSubmitting}
              required
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className={`cursor-pointer w-full bg-[#474747] hover:bg-[#303030] transition duration-300 ${roboto.className} tracking-widest mt-16 text-white font-bold disabled:opacity-80 p-5 disbled:opacity-80 disabled:cursor-not-allowed`}
            >
              UPDATE PASSWORD →
            </button>
          </div>
        </form>

        <p
          className={`tracking-widest underline decoration-[#E9C176] underline-offset-10 text-[#5c5a5a] ${roboto.className} text-center cursor-pointer pt-7`}
        >
          <Link href="/login">RETURN TO LOGIN</Link>
        </p>
        <hr className="border border-[#E3E2E0] w-32 mt-25"></hr>
      </div>

      <div className="bg-[#F1F1EF] flex justify-between">
        <p
          className={`text-[#5c5a5a] ${roboto.className} pl-15 pb-15 pt-15 tracking-wider text-sm`}
        >
          © 2026 THE CURATED ALTHAïR. ALL RIGHTS RESERVED.
        </p>
        <div className="flex flex-row pb-15 pt-15">
          <p
            className={`cursor-pointer text-[#5c5a5a] ${roboto.className} tracking-wider text-sm pr-15 hover:underline`}
          >
            PRIVACY POLICY
          </p>
          <p
            className={`cursor-pointer text-[#5c5a5a] ${roboto.className} tracking-wider text-sm pr-15 hover:underline`}
          >
            SUPPORT
          </p>
        </div>
      </div>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F9F8F6] flex items-center justify-center">Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}