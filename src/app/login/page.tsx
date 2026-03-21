import { Gelasio, Roboto } from "next/font/google";
import Form from "next/form";
import Image from "next/image";

const gelasio = Gelasio({
  subsets: ["latin"],
});

const roboto = Roboto({
  subsets: ["latin"],
});

export default function Login() {
  return (
    <main className="bg-white h-screen grid grid-rows-2">
      <div className="grid grid-cols-3 row-span-2">
        <h3 className={`text-black ${gelasio.className} text-3xl ml-5 pt-5`}>
          The Curated Althaïr
        </h3>
        <div>
          <h1
            className={`text-black ${gelasio.className} items-center justify-center text-6xl pt-50`}
          >
            Welcome Back
          </h1>
          <Form action="/">
            <div className="flex flex-col pt-10">
              <label
                htmlFor="email-input"
                className={`text-[#5c5a5a] ${roboto.className} tracking-widest`}
              >
                EMAIL ADDRESS
              </label>
              <input
                name="EMAIL ADDRESS"
                className={`bg-[#faf9f7] border-2 border-gray text-[#5c5a5a]`}
                id="email-input"
                placeholder="name@example.com"
              ></input>
            </div>
            <div className="flex flex-col pt-10">
              <label
                htmlFor="password-input"
                className={`text-[#5c5a5a] ${roboto.className} tracking-widest`}
              >
                PASSWORD
              </label>
              <input
                name="PASSWORD"
                className={`bg-[#faf9f7] border-2 border-gray text-[#5c5a5a]`}
                id="password-input"
                placeholder="********"
              ></input>
              <button
                className={`bg-[#5f5e5e] ${roboto.className} tracking-widest mt-10`}
              >
                SIGN IN
              </button>
            </div>
          </Form>
          <p className={`text-[#5c5a5a] text-center pt-10`}>OR</p>
          <button
            className={`text-black tracking-widest border-2 border-black block w-full box-border mt-10`}
          >
            CREATE AN ACCOUNT
          </button>
          <p className={`italic text-center text-[#5c5a5a] mt-10`}>
            By continuining, you agree to our Terms of Service
          </p>
        </div>
        <div className="relative w-full h-full overflow-hidden">
          <Image
            src="/images/login_image.png"
            fill={true}
            className="scale-145 opacity-40"
            alt="Image of flower and vase, grey-scale"
          ></Image>
        </div>
      </div>
      <div className="bg-[#faf9f7] flex justify-between">
        <p
          className={`text-[#5c5a5a] ${roboto.className} pl-15 pb-15 pt-15 tracking-wider text-sm`}
        >
          © 2026 THE CURATED ALTHAïR. ALL RIGHTS RESERVED.
        </p>
        <div className="flex flex-row pb-15 pt-15">
          <p
            className={`text-[#5c5a5a] ${roboto.className} tracking-wider text-sm pr-15`}
          >
            PRIVACY POLICY
          </p>
          <p
            className={`text-[#5c5a5a] ${roboto.className} tracking-wider text-sm pr-15`}
          >
            SUPPORT
          </p>
        </div>
      </div>
    </main>
  );
}
