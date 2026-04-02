"use client";

import { Gelasio, Roboto } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Footer from "@/components/universal/Footer";

const gelasio = Gelasio({
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const roboto = Roboto({
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export default function ForgotPasswordPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isSubmittingRef = useRef<boolean>(false);
  const router = useRouter();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    if (isSubmittingRef.current) {
      return;
    }

    isSubmittingRef.current = true;
    setIsSubmitting(true);

    try {
      const response = await fetch(
        "https://sassysquad-backend.vercel.app/auth/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.get("email"),
          }),
        },
      );

      if (response.status === 200) {
        alert("Email sent");
      } else {
        alert("Email failed to send");
      }
    } catch (error) {
      console.log(error);
      alert("Failure to send email");
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
          className={`${gelasio.className} text-black text-5xl md:text-6xl text-center`}
        >
          Reset Password
        </h1>

        <p
          className={`text-center ${roboto.className} text-[#787777] pt-5 text-lg max-w-sm`}
        >
          Enter your email address and we'll send you a link to reset your
          password.
        </p>

        <form onSubmit={handleSubmit} className="pt-16 w-full max-w-md">
          <div className="flex flex-col">
            <label
              htmlFor="email-reset"
              className={`text-[#5c5a5a] ${roboto.className} tracking-widest pb-3 cursor-text`}
            >
              EMAIL ADDRESS
            </label>
            <input
              type="email"
              name="email"
              placeholder="name@example.com"
              className={`${roboto.className} w-full focus:outline-none bg-[#E3E2E0] border-b-2 border-[#C5A059] text-[#5c5a5a] p-5 disabled:opacity-80 disabled:cursor-not-allowed`}
              disabled={isSubmitting}
              required
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className={`cursor-pointer w-full bg-[#474747] hover:bg-[#303030] transition duration-300 ${roboto.className} tracking-widest mt-12 text-white font-bold disabled:opacity-80 p-5 disbled:opacity-80 disabled:cursor-not-allowed`}
            >
              SEND RESET LINK →
            </button>
          </div>
        </form>

        <p
          className={`tracking-widest underline decoration-[#E9C176] underline-offset-10 text-[#5c5a5a] ${roboto.className} text-center cursor-pointer pt-7`}
        >
          <Link href="/login">RETURN TO LOGIN</Link>
        </p>
        <hr className="border border-[#E3E2E0] w-32 mt-50"></hr>
      </div>

      <Footer variant="page" />
    </main>
  );
}
