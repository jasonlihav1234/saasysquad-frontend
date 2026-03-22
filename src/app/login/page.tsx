"use client";

import { Gelasio, Roboto } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { useState, useRef } from "react";

const gelasio = Gelasio({
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const roboto = Roboto({
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export default function Login() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isSubmittingRef = useRef<boolean>(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    console.log(formData.get("email"));
    if (isSubmittingRef.current) {
      return;
    }

    isSubmittingRef.current = true;
    setIsSubmitting(true);

    try {
      const response = await fetch(
        "https://sassysquad-backend.vercel.app/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.get("email"),
            password: formData.get("password"),
          }),
        },
      );

      if (response.status === 200) {
        // alert("works");
      } else {
        // alert("incorrect credenitals");
      }
    } catch (error) {
      console.log("Failed");
      alert("doesn't login");
    } finally {
      setIsSubmitting(false);
      isSubmittingRef.current = false;
    }
  };

  return (
    <main className="bg-[#F9F8F6] min-h-screen w-full grid grid-rows-2">
      <div className="grid grid-cols-3 row-span-2">
        <h3 className={`text-black ${gelasio.className} text-3xl ml-10 pt-5`}>
          The Curated Althaïr
        </h3>
        <div className="h-full flex flex-col justify-center">
          <h1
            className={`text-black ${gelasio.className} text-center text-7xl pt-10`}
          >
            Welcome Back
          </h1>
          <p className={`text-[#5F5E5E] mt-5 ${roboto.className} text-center`}>
            Luxury is not in the expense, but in the intentional curation of
            functional beauty.
          </p>
          <form onSubmit={handleSubmit} className="pt-10">
            <div className="flex flex-col pt-10">
              <label
                htmlFor="email-input"
                className={`text-[#5c5a5a] ${roboto.className} tracking-widest mb-3 cursor-text`}
              >
                EMAIL ADDRESS
              </label>
              <input
                name="email"
                className={`${roboto.className} focus:outline-none bg-[#E3E2E0] border-b-1 border-[#C5A059] text-[#5c5a5a] -mr-5 z-10 p-6 disabled:opacity-80 disabled:cursor-not-allowed`}
                id="email-input"
                placeholder="name@example.com"
                disabled={isSubmitting}
                required
              ></input>
            </div>
            <div className="flex flex-col pt-10">
              <div className="flex flex-row justify-between -mr-5">
                <label
                  htmlFor="password-input"
                  className={`text-[#5D4201] ${roboto.className} tracking-widest mb-3 cursor-text`}
                >
                  PASSWORD
                </label>

                <p
                  className={`text-[#806737] ${roboto.className} tracking-widest hover:underline cursor-pointer`}
                >
                  FORGOT PASSWORD?
                </p>
              </div>
              <input
                name="password"
                className={`${roboto.className} focus:outline-none bg-[#E3E2E0] border-b-1 border-[#C5A059] text-[#5c5a5a] -mr-5 z-10 p-6 mb-5 disabled:opacity-80`}
                id="password-input"
                placeholder="********"
                disabled={isSubmitting}
                required
              ></input>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`cursor-pointer bg-[#474747] hover:bg-[#303030] transition duration-300 ${roboto.className} tracking-widest mt-10 -mr-5 z-10 p-6 text-white font-bold disabled:opacity-80`}
              >
                SIGN IN
              </button>

              <div className="flex flex-row items-center pt-10 -mr-5 z-10">
                <hr className="flex-1 border-[#C5A059] mr-5"></hr>
                <p className={`text-[#5c5a5a] ${roboto.className} text-center`}>
                  OR
                </p>
                <hr className="flex-1 border-[#C5A059] ml-5"></hr>
              </div>
              <div className="-mr-5 z-10">
                <Link href="/register" className="z-10 w-full">
                  <button
                    type="button"
                    disabled={isSubmitting}
                    className={`cursor-pointer relative text-black bg-[#f8f8f8] hover:bg-white transition duration-300 font-bold tracking-widest border-1 border-[#C5A059] block mt-10 p-6 w-full`}
                  >
                    CREATE AN ACCOUNT
                  </button>
                </Link>
              </div>
            </div>
          </form>
          <p
            className={`italic ${roboto.className} text-center text-[#5c5a5a] mt-10`}
          >
            By continuing, you agree to our{" "}
            <span className="cursor-pointer underline">Terms of Services</span>
          </p>
        </div>
        <div className="relative w-full h-full overflow-hidden">
          <Image
            src="/images/login_image.png"
            fill={true}
            className="scale-145 opacity-25"
            alt="Image of flower and vase, grey-scale"
          ></Image>
        </div>
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
