import { Gelasio, Roboto } from "next/font/google";
import Form from "next/form";
import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/universal/Footer";

const gelasio = Gelasio({
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const roboto = Roboto({
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export default function Register() {
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
            fill={true}
            className="object-cover"
            alt="Image of home good, grey-scale"
          ></Image>
        </div>
        <div className="flex flex-col pl-15 pr-15 pt-20">
          <h1 className={`${gelasio.className} text-6xl text-black`}>
            Join the Althaïr
          </h1>
          <Form action="/">
            <div className="flex flex-col pt-10">
              <label
                htmlFor="username-register"
                className={`text-[#5c5a5a] ${roboto.className} tracking-widest cursor-text mb-3`}
              >
                USERNAME
              </label>
              <input
                name="USERNAME"
                className={`${roboto.className} focus:outline-none bg-[#E3E2E0] border-b-1 border-[#C5A059] text-[#5c5a5a] p-6`}
                placeholder="test_username"
                id="username-register"
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
                name="EMAIL ADDRESS"
                className={`${roboto.className} focus:outline-none bg-[#E3E2E0] border-b-1 border-[#C5A059] text-[#5c5a5a] p-6`}
                placeholder="name@example.com"
                id="email-register"
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
                name="PASSWORD"
                type="password"
                className={`${roboto.className} focus:outline-none bg-[#E3E2E0] border-b-1 border-[#C5A059] text-[#5c5a5a] p-6`}
                placeholder="*******"
                id="password-register"
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
                name="CONFIRM PASSWORD"
                type="password"
                className={`${roboto.className} focus:outline-none bg-[#E3E2E0] border-b-1 border-[#C5A059] text-[#5c5a5a] p-6`}
                placeholder="*******"
                id="confirm-password-register"
                required
              ></input>
            </div>
            <button
              className={`cursor-pointer bg-[#474747] hover:bg-[#303030] transition duration-300 ${roboto.className} tracking-widest mt-20 w-full p-6 text-white font-bold`}
            >
              SIGN IN
            </button>
          </Form>
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
