"use client";

import { Gelasio, Roboto } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

const gelasio = Gelasio({
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const roboto = Roboto({
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export default function ForgotPasswordPage() {
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
          className={`text-center ${roboto.className} text-black pt-5 text-lg max-w-md`}
        >
          Enter your email address and we'll send you a link to reset your
          password.
        </p>

        <form className="pt-16 w-full max-w-md">
          <div className="flex flex-col">
            <label
              htmlFor="email-reset"
              className={`text-[#5c5a5a] ${roboto.className} tracking-widest pb-3 cursor-text`}
            >
              EMAIL ADDRESS
            </label>
            <input
              type="email"
              placeholder="name@example.com"
              className={`${roboto.className} w-full focus:outline-none bg-[#E3E2E0] border-b-2 border-[#C5A059] text-[#5c5a5a] p-5 disabled:opacity-80 disabled:cursor-not-allowed`}
              required
            />
            <button
              type="submit"
              className={`cursor-pointer w-full bg-[#474747] hover:bg-[#303030] transition duration-300 ${roboto.className} tracking-widest mt-12 text-white font-bold disabled:opacity-80 p-5`}
            >
              SEND RESET LINK →
            </button>
          </div>
        </form>

        <p
          className={`tracking-widest underline decoration-[#E9C176] underline-offset-10 text-[#5c5a5a] ${roboto.className} text-center cursor-pointer pt-7`}
        >
          RETURN TO LOGIN
        </p>
        <hr className="border border-[#E3E2E0] w-32 mt-50"></hr>
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
