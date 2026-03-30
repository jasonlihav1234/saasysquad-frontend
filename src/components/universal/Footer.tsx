import { Roboto } from "next/font/google";
import { HTMLAttributes } from "react";

const roboto = Roboto({
  subsets: ["latin"],
  style: ["normal", "italic"],
});

interface FooterProps extends HTMLAttributes<HTMLElement> {
  variant?: "settings" | "page";
}

export default function Footer({ variant = "settings" }: FooterProps) {
  if (variant === "page") {
    return (
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
    );
  }

  return (
    <footer className="border-t border-[#C5A059]/20 pt-10 mt-10 flex justify-between items-center">
      <p
        className={`${roboto.className} text-[#5F5E5E] text-sm tracking-wider`}
      >
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
