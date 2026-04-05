"use client";

import { Gelasio, Roboto } from "next/font/google";
import Image from "next/image";
import Footer from "@/components/universal/Footer";
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

export default function Login() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isSubmittingRef = useRef<boolean>(false);
  const router = useRouter();

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
        const body = await response.json();
        localStorage.setItem("accessToken", body.accessToken);
        localStorage.setItem("refreshToken", body.refreshToken);
        router.push("/dashboard");
      } else {
        alert("incorrect credentials");
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
                type="email"
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
                  <Link href="/forgot-password">FORGOT PASSWORD?</Link>
                </p>
              </div>
              <input
                name="password"
                type="password"
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
                    className={`${roboto.className} cursor-pointer relative text-black bg-[#f8f8f8] hover:bg-white transition duration-300 font-bold tracking-widest border-1 border-[#C5A059] block mt-10 p-6 w-full disabled:opacity-80`}
                  >
                    CREATE AN ACCOUNT
                  </button>
                </Link>
                <Link
                  href="https://sassysquad-backend.vercel.app/auth/google/login"
                  className="z-10 w-full"
                >
                  <button
                    type="button"
                    disabled={isSubmitting}
                    className={`${roboto.className} cursor-pointer relative text-black bg-[#f8f8f8] hover:bg-white transition duration-300 font-bold tracking-widest border-1 border-[#C5A059] flex justify-center items-center mt-10 p-6 w-full disabled:opacity-80`}
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"
                        fill="#4285F4"
                      />
                      <path
                        d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z"
                        fill="#34A853"
                      />
                      <path
                        d="M3.964 10.712c-.18-.54-.282-1.117-.282-1.712s.102-1.173.282-1.712V4.956H.957a8.991 8.991 0 000 8.088l3.007-2.332z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.956L3.964 7.29C4.672 3.163 6.656 3.58 9 3.58z"
                        fill="#EA4335"
                      />
                    </svg>
                    <p className="pl-3">SIGN IN WITH GOOGLE</p>
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
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAJCAMAAADNcxasAAAAIGNIUk0AAHomAACAhAAA+gAAAIDoAAB1MAAA6mAAADqYAAAXcJy6UTwAAAB+UExURX19fLm5ucLCwpaWlbGxsX5+fpeXl7e3t5ubm76+vWRkZJCQj62trJWVlMHBwW1ubY2NjJqamZSUk8HBwHV1dJiYmJybmpGRkGdnZ46OjpaVlF5fXomJiIODgoyNjH18e3FxcEhIR25ubWVmZHh4d1hYVxwcGyIjIjc3N////46r3OIAAAABYktHRCnKt4UkAAAAB3RJTUUH6gMWCxcdIwnneQAAAD1JREFUCNcFwQUCgCAAALEzMUEwsFv0/y90A88PQqJYJClZXpQSVWlT07SdlfTDaAWTmZeVbT/Oi/tx7/cDP0EDcycdVKwAAAAldEVYdGRhdGU6Y3JlYXRlADIwMjYtMDMtMjJUMTE6MjM6MjgrMDA6MDAMr3xUAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDI2LTAzLTIyVDExOjIzOjI4KzAwOjAwffLE6AAAACh0RVh0ZGF0ZTp0aW1lc3RhbXAAMjAyNi0wMy0yMlQxMToyMzoyOSswMDowMIyQ7oMAAAAASUVORK5CYII="
            fill={true}
            className="scale-145 opacity-25"
            alt="Image of flower and vase, grey-scale"
          ></Image>
        </div>
      </div>
      <Footer variant="page" />
    </main>
  );
}
