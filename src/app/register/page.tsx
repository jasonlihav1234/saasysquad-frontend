"use client";

import { Gelasio, Roboto } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/universal/Footer";
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

export default function Register() {
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

    if (formData.get("password") !== formData.get("password_confirm")) {
      setIsSubmitting(false);
      alert("Passwords do not match");

      isSubmittingRef.current = false;
      return;
    }

    try {
      const registerResponse = await fetch(
        "https://sassysquad-backend.vercel.app/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.get("email"),
            username: formData.get("username"),
            password: formData.get("password"),
          }),
        },
      );

      if (registerResponse.status !== 201) {
        const res = await registerResponse.json();
        console.log(res);
        alert("Registering failed");
        setIsSubmitting(false);

        isSubmittingRef.current = false;
        return;
      }

      const loginResponse = await fetch(
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

      if (loginResponse.status === 200) {
        const body = await loginResponse.json();
        localStorage.setItem("accessToken", body.accessToken);
        localStorage.setItem("refreshToken", body.refreshToken);
        router.push("/dashboard");
      } else {
        alert("Login failed after registering");
      }
    } catch (error) {
      console.log(error);
      alert(error);
    } finally {
      setIsSubmitting(false);
      isSubmittingRef.current = false;
    }
  };
  return (
    <main className="flex flex-col bg-[#F9F8F6] min-h-screen w-full">
      <div className="bg-[#F1F1EF] flex flex-row items-center justify-between pt-5 pb-5">
        <h1 className={`text-black ${gelasio.className} text-3xl pl-10`}>
          The Curated Althaïr
        </h1>
        <p
          className={`text-black ${roboto.className} text-xl pr-10 cursor-pointer hover:underline`}
        >
          <Link href="/login">LOGIN</Link>
        </p>
      </div>
      <div className="grid grid-cols-2 grow">
        <div className="relative w-full h-full overflow-hidden">
          <Image
            src="/images/register_image.png"
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAFCAMAAACgjTZZAAAAIGNIUk0AAHomAACAhAAA+gAAAIDoAAB1MAAA6mAAADqYAAAXcJy6UTwAAACKUExURTw8OY6OjLS1s21uaVZXUllaVSYmJC4vLFhZVE5OS6eopba3tIOEf4eIg4iIhDExLzw9OXV2cE5OSmlpZIKDfqippbm5toWFgjExLkJDP35+eU9QS2NkX5OTj4KCfkxLR0ZGQiYmIz9AO3JybVxdV6WlorS1soqLh0xMSTo7OCEiHzU2MmVmYP///+BRiRYAAAABYktHRC3N2kE9AAAAB3RJTUUH6gMXBCExKy06twAAADpJREFUCNdjYGBkYmZhZWPnYODk4ubh5eMXEGQQEhYRFROXkJRikJaRlZNXUFRSZlBRVVPX0NTS1gEAQBAD3+rqVI0AAAAldEVYdGRhdGU6Y3JlYXRlADIwMjYtMDMtMjNUMDQ6MzM6MzMrMDA6MDAtxDQEAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDI2LTAzLTIzVDA0OjMzOjMzKzAwOjAwXJmMuAAAACh0RVh0ZGF0ZTp0aW1lc3RhbXAAMjAyNi0wMy0yM1QwNDozMzo0OSswMDowMKU5+zAAAAAASUVORK5CYII="
            fill={true}
            className="object-cover"
            alt="Image of home good, grey-scale"
          ></Image>
        </div>
        <div className="flex flex-col pl-15 pr-15 pt-20">
          <h1 className={`${gelasio.className} text-6xl text-black`}>
            Join the Althaïr
          </h1>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col pt-10">
              <label
                htmlFor="username-register"
                className={`text-[#5c5a5a] ${roboto.className} tracking-widest cursor-text mb-3`}
              >
                USERNAME
              </label>
              <input
                name="username"
                className={`${roboto.className} focus:outline-none bg-[#E3E2E0] border-b-1 border-[#C5A059] text-[#5c5a5a] p-6 disabled:opacity-80 disabled:cursor-not-allowed`}
                placeholder="test_username"
                id="username-register"
                disabled={isSubmitting}
                required
              ></input>
            </div>
            <div className="flex flex-col pt-10">
              <label
                htmlFor="email-register"
                className={`text-[#5c5a5a] ${roboto.className} tracking-widest cursor-text mb-3`}
              >
                EMAIL ADDRESS
              </label>
              <input
                name="email"
                type="email"
                className={`${roboto.className} focus:outline-none bg-[#E3E2E0] border-b-1 border-[#C5A059] text-[#5c5a5a] p-6 disabled:opacity-80 disabled:cursor-not-allowed`}
                placeholder="name@example.com"
                id="email-register"
                disabled={isSubmitting}
                required
              ></input>
            </div>
            <div className="flex flex-col pt-10">
              <label
                htmlFor="password-register"
                className={`text-[#5c5a5a] ${roboto.className} tracking-widest cursor-text mb-3`}
              >
                PASSWORD
              </label>
              <input
                name="password"
                type="password"
                className={`${roboto.className} focus:outline-none bg-[#E3E2E0] border-b-1 border-[#C5A059] text-[#5c5a5a] p-6 disabled:opacity-80 disbled:cursor-not-allowed`}
                placeholder="*******"
                id="password-register"
                disabled={isSubmitting}
                required
              ></input>
            </div>
            <div className="flex flex-col pt-10">
              <label
                htmlFor="confirm-password-register"
                className={`text-[#5c5a5a] ${roboto.className} tracking-widest cursor-text mb-3`}
              >
                CONFIRM PASSWORD
              </label>
              <input
                name="password_confirm"
                type="password"
                className={`${roboto.className} focus:outline-none bg-[#E3E2E0] border-b-1 border-[#C5A059] text-[#5c5a5a] p-6 disabled:opacity-80 disabled:cursor-not-allowed`}
                placeholder="*******"
                id="confirm-password-register"
                disabled={isSubmitting}
                required
              ></input>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`cursor-pointer bg-[#474747] hover:bg-[#303030] transition duration-300 ${roboto.className} tracking-widest mt-20 w-full p-6 text-white font-bold disabled:opacity-80 disabled:cursor-not-allowed`}
            >
              REGISTER
            </button>
          </form>
          <p
            className={`${roboto.className} text-[#5c5a5a] tracking-wide text-center pt-10 border-t-1 border-[#E3E2E0] mt-20 pb-10`}
          >
            BY CREATING AN ACCOUNT, YOU AGREE TO OUR{" "}
            <span className="underline cursor-pointer">TERMS AND SERVICE</span>
          </p>
        </div>
      </div>
      <Footer variant="page" />
    </main>
  );
}
