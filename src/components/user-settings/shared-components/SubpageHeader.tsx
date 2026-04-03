import { Gelasio, Roboto } from "next/font/google";
import Link from "next/link";

const gelasio = Gelasio({
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const roboto = Roboto({
  subsets: ["latin"],
  style: ["normal", "italic"],
});

interface SubpageHeaderProps {
  title: string;
}

export default function SubpageHeader({ title }: SubpageHeaderProps) {
  return (
    <header className="flex items-center justify-between bg-[#F1F1EF] border-b border-[#C5A059]/20 px-10 py-4">
      <Link
        href="/"
        className={`${roboto.className} flex items-center gap-2 text-[#5F5E5E] hover:text-black transition-colors duration-200 tracking-widest text-sm uppercase`}
      >
        ← Back to Main
      </Link>
      <h2
        className={`${gelasio.className} text-black text-xl font-medium tracking-tight`}
      >
        {title}
      </h2>
    </header>
  );
}
