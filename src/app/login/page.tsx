import { Gelasio, Roboto } from "next/font/google";

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
