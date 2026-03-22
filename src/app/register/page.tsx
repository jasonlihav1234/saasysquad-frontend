import { Gelasio, Roboto } from "next/font/google";
import Form from "next/form";
import Image from "next/image";

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
        <h1 className={`text-black ${gelasio.className} text-4xl pl-10`}>
          The Curated Althaïr
        </h1>
        <p
          className={`text-black ${roboto.className} text-xl pr-10 cursor-pointer hover:underline`}
        >
          LOGIN
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
        <div className="flex flex-col items-center justify-center">
          <h1 className={`${gelasio.className} text-5xl text-black`}>
            Join the Althaïr
          </h1>
          <Form action="/">
            <div className="flex flex-col">
              <label
                className={`text-[#5c5a5a] ${roboto.className} tracking-widest cursor-text`}
              >
                USERNAME
              </label>
              <input
                name="USERNAME"
                className={`${roboto.className} focus:outline-none bg-[#E3E2E0] border-b-1 border-[#C5A059] text-[#5c5a5a] -mr-5 z-10 p-6`}
              ></input>
            </div>
            <div className="flex flex-col">
              <label
                className={`text-[#5c5a5a] ${roboto.className} tracking-widest cursor-text`}
              >
                EMAIL ADDRESS
              </label>
              <input
                name="EMAIL ADDRESS"
                className={`${roboto.className} focus:outline-none bg-[#E3E2E0] border-b-1 border-[#C5A059] text-[#5c5a5a] -mr-5 z-10 p-6`}
              ></input>
            </div>
            <div className="flex flex-col">
              <label
                className={`text-[#5c5a5a] ${roboto.className} tracking-widest cursor-text`}
              >
                PASSWORD
              </label>
              <input
                name="PASSWORD"
                className={`${roboto.className} focus:outline-none bg-[#E3E2E0] border-b-1 border-[#C5A059] text-[#5c5a5a] -mr-5 z-10 p-6`}
              ></input>
            </div>
            <div className="flex flex-col">
              <label
                className={`text-[#5c5a5a] ${roboto.className} tracking-widest cursor-text`}
              >
                CONFIRM PASSWORD
              </label>
              <input
                name="CONFIRM PASSWORD"
                className={`${roboto.className} focus:outline-none bg-[#E3E2E0] border-b-1 border-[#C5A059] text-[#5c5a5a] -mr-5 z-10 p-6`}
              ></input>
            </div>
            <button
              className={`cursor-pointer bg-[#474747] hover:bg-[#303030] transition duration-300 ${roboto.className} tracking-widest mt-10 -mr-5 z-10 p-6 text-white font-bold`}
            >
              SIGN IN
            </button>
          </Form>
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
