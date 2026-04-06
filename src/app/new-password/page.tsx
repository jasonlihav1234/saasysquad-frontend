"use client";

import { Gelasio, Roboto } from "next/font/google";
import { useSearchParams } from "next/navigation";
import React, { Suspense, useState } from "react";
import Link from "next/link";
import Footer from "@/components/universal/Footer";
import PasswordPageBrandingHeader from "@/components/universal/PasswordPageBrandingHeader";
import { SearchParamsContext } from "next/dist/shared/lib/hooks-client-context.shared-runtime";
import { useRouter } from "next/navigation";

const gelasio = Gelasio({
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const roboto = Roboto({
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const color = {
  colorWhite: "#F9F8F6",
  colorGreyLight: "#787777",
  textColor: "#5c5a5a",
  colorGold: "#E9C176",
};

function CreateNewPasswordFunction() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");
  const router = useRouter();

  const [password, isPassword] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(
        "https://sassysquad-backend-c8zg43icx-jasons-projects-ac5e4f90.vercel.app/auth/reset-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, email, newPassword: password }),
        },
      );

      if (response.ok) {
        alert("Password successfully reset");
        router.push("/login");
      } else {
        alert("Error while resetting password");
      }
    } catch (error) {
      alert(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!token || !email) {
    return <div>Error: Missing reset token or email.</div>;
  }

  return (
    <main
      className={`bg-[${color.colorWhite}] grid grid-rows-[auto_1fr_auto] min-h-screen w-full`}
    >
      <PasswordPageBrandingHeader />

      <div
        className={`flex bg-[${color.colorWhite}] items-center justify-center flex-col`}
      >
        <h1
          className={`text-black text-5xl md:text-6xl text-center ${gelasio.className}`}
        >
          Create New <br></br> Password
        </h1>

        <p
          className={`text-center text-[${color.colorGreyLight}] pt-5 text-lg max-w-sm ${roboto.className}`}
        >
          Please enter your new credentials below.
        </p>
        <div>
          <form onSubmit={handleSubmit} className="pt-16 w-full max-w-md">
            <label
              htmlFor="new-password"
              className={`text-[#5c5a5a] ${roboto.className} tracking-widest pb-3 cursor-text`}
            >
              NEW PASSWORD
            </label>
            <input
              type="password"
              name="new-password"
              placeholder="**************"
              className={`${roboto.className} w-full focus:outline-none bg-[#E3E2E0] border-b-2 border-[#C5A059] text-[#5c5a5a] p-5 mb-8 disabled:opacity-80 disabled:cursor-not-allowed`}
              required
            />
            <label
              htmlFor="new-password-confirm"
              className={`text-[#5c5a5a] ${roboto.className} tracking-widest pb-3 cursor-text`}
            >
              CONFIRM NEW PASSWORD
            </label>
            <input
              type="password"
              name="new-password-confirm"
              placeholder="**************"
              className={`${roboto.className} w-full focus:outline-none bg-[#E3E2E0] border-b-2 border-[#C5A059] text-[#5c5a5a] p-5 disabled:opacity-80 disabled:cursor-not-allowed`}
              required
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className={`cursor-pointer w-full bg-[#474747] hover:bg-[#303030] transition duration-300 ${roboto.className} tracking-widest mt-12 text-white font-bold disabled:opacity-80 p-5 disbled:opacity-80 disabled:cursor-not-allowed`}
            >
              {isSubmitting ? "UPDATE PASSWORD →" : "UPDATING..."}
            </button>
            <p
              className={`tracking-widest underline decoration-[${color.colorGold}] underline-offset-10 text-[${color.textColor}] ${roboto.className} text-center cursor-pointer pt-7`}
            >
              <Link href="/login">RETURN TO LOGIN</Link>
            </p>
          </form>
        </div>
      </div>

      <Footer variant="page" />
    </main>
  );
}

export default function CreateNewPasswordPage() {
  return (
    <Suspense fallback={<div>Loading password reset form...</div>}>
      <CreateNewPasswordPage />
    </Suspense>
  );
}
