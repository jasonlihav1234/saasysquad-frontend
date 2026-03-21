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
          <h1 className={`text-black ${gelasio.className}`}>Welcome Back</h1>
        </div>
      </div>
      <div className="bg-[#faf9f7]">
        <p className={`text-black ${roboto.className} ml-5 pb-40`}>
          All rights reserved etc...
        </p>
      </div>
    </main>
  );
}
