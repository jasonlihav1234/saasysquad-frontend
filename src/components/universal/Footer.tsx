import { Roboto } from "next/font/google";

const roboto = Roboto({
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export default function Footer() {
  return (
    <footer className="border-t border-[#C5A059]/20 pt-10 mt-10 flex justify-between items-center">
      <p className={`${roboto.className} text-[#5F5E5E] text-sm tracking-wider`}>
        © 2026 THE CURATED ALTHAïR. ALL RIGHTS RESERVED.
      </p>
      <div className="flex gap-8">
        <p
          className={`${roboto.className} cursor-pointer text-[#5F5E5E] tracking-wider text-sm hover:underline`}
        >
          PRIVACY POLICY
        </p>
        <p
          className={`${roboto.className} cursor-pointer text-[#5F5E5E] tracking-wider text-sm hover:underline`}
        >
          SUPPORT
        </p>
      </div>
    </footer>
  );
}
