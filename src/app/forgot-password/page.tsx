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
    <main className="grid grid-rows-3 justify-center items-center bg-[#F9F8F6] min-h-screen w-full">
      <h1 className={`${gelasio.className} text-black text-3xl text-center`}>
        The Curated Althair
      </h1>
      <div className="flex h-full flex-col justify-center">
        <h1 className={`${gelasio.className} text-black text-4xl text-center`}>
          Reset Password
        </h1>
        <p className={`text-center ${roboto.className} text-black`}>
          Enter you email address and we'll send you a link to reset your
          password.
        </p>

        <form>
          <div className="flex flex-col">
            <label
              htmlFor="email-reset"
              className={`text-[#5c5a5a] ${roboto.className} tracking-widest mb-3 cursor-text`}
            >
              EMAIL ADDRESS
            </label>
            <input
              type="email"
              placeholder="name@example.com"
              className={`${roboto.className} focus:outline-none bg-[#E3E2E0] border-b-1 border-[#C5A059] text-[#5c5a5a] p-6 disbled:opacity-80 disabled:cursor-not-allowed`}
              required
            ></input>
            <button
              type="submit"
              className={`cursor-pointer bg-[#474747] hover:bg-[#303030] transition duration-300 ${roboto.className} tracking-widest mt-10 text-white font-bold disabled:opacity-80 p-6`}
            >
              SEND RESET LINK →
            </button>
          </div>
        </form>
        <p
          className={`underline text-[#5c5a5a] ${roboto.className} text-center cursor-pointer`}
        >
          RETURN TO LOGIN
        </p>
      </div>
      <div></div>
    </main>
  );
}
