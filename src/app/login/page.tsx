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

export default function Login() {
  return (
    <main className="bg-[#F9F8F6] h-screen grid grid-rows-2">
      <div className="grid grid-cols-3 row-span-2">
        <h3 className={`text-black ${gelasio.className} text-3xl ml-5 pt-5`}>
          The Curated Althaïr
        </h3>
        <div className="">
          <h1
            className={`text-black ${gelasio.className} text-center text-7xl pt-50`}
          >
            Welcome Back
          </h1>
          <p className={`text-[#5F5E5E] mt-5 ${roboto.className} text-center`}>
            Luxury is not in the expense, but in the intentional curation of
            functional beauty.
          </p>
          <Form action="/" className="pt-10">
            <div className="flex flex-col pt-10">
              <label
                htmlFor="email-input"
                className={`text-[#5c5a5a] ${roboto.className} tracking-widest mb-3 cursor-text`}
              >
                EMAIL ADDRESS
              </label>
              <input
                name="EMAIL ADDRESS"
                className={`${roboto.className} focus:outline-none bg-[#E3E2E0] border-b-1 border-[#C5A059] text-[#5c5a5a] -mr-5 z-10 p-6`}
                id="email-input"
                placeholder="name@example.com"
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
                name="PASSWORD"
                className={`${roboto.className} focus:outline-none bg-[#E3E2E0] border-b-1 border-[#C5A059] text-[#5c5a5a] -mr-5 z-10 p-6 mb-5`}
                id="password-input"
                placeholder="********"
                required
              ></input>
              <button
                className={`cursor-pointer bg-[#474747] hover:bg-[#303030] transition duration-300 ${roboto.className} tracking-widest mt-10 -mr-5 z-10 p-6 text-white font-bold`}
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
              <button
                type="button"
                className={`cursor-pointer relative text-black bg-[#f8f8f8] hover:bg-white transition duration-300 font-bold tracking-widest border-1 border-[#C5A059] block mt-10 -mr-5 p-6 z-10`}
              >
                CREATE AN ACCOUNT
              </button>
            </div>
          </Form>
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
