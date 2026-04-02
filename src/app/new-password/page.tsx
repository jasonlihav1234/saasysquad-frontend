"use client";

import { Roboto } from "next/font/google";
import Link from "next/link";
import Footer from "@/components/universal/Footer";
import PasswordPageBrandingHeader from "@/components/universal/PasswordPageBrandingHeader";

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

export default function CreateNewPasswordPage() {
  return (
    <main
      className={`bg-[${color.colorWhite}] grid grid-rows-[auto_1fr_auto] min-h-screen w-full`}
    >
      <PasswordPageBrandingHeader />

      <div
        className={`flex bg-[${color.colorWhite}] border border-solid border-black items-center justify-center flex-col`}
      >
        <h1 className={`text-black text-5xl md:text-6xl text-center`}>
          Create New <br></br> Password
        </h1>

        <p
          className={`text-center text-[${color.colorGreyLight}] pt-5 text-lg max-w-sm`}
        >
          Please enter your new credentials below.
        </p>
        <div>
          <form className="pt-16 w-full max-w-md border border-black border-solid">
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
              className={`${roboto.className} w-full focus:outline-none bg-[#E3E2E0] border-b-2 border-[#C5A059] text-[#5c5a5a] p-5 disabled:opacity-80 disabled:cursor-not-allowed`}
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
              className={`cursor-pointer w-full bg-[#474747] hover:bg-[#303030] transition duration-300 ${roboto.className} tracking-widest mt-12 text-white font-bold disabled:opacity-80 p-5 disbled:opacity-80 disabled:cursor-not-allowed`}
            >
              UPDATE PASSWORD →
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
