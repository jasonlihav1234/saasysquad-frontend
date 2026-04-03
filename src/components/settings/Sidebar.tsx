"use client";

import { Roboto } from "next/font/google";
import Link from "next/link";

const roboto = Roboto({
  subsets: ["latin"],
  style: ["normal", "italic"],
});

interface NavItem {
  label: string;
  href: string;
  active?: boolean;
}

const navItems: NavItem[] = [
  { label: "Account Details", href: "#account", active: true },
  { label: "Purchases", href: "#purchases" },
  { label: "Sales", href: "#sales" },
];

export default function Sidebar() {
  return (
    <aside className="hidden md:flex w-64 flex-col bg-[#F1F1EF] border-r border-[#C5A059]/20 py-10 pl-8 pr-4 shrink-0">
      <nav className="flex flex-col gap-1">
        {navItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={`${roboto.className} flex items-center gap-3 px-4 py-3 text-sm tracking-widest uppercase transition-colors duration-200
              ${
                item.active
                  ? "bg-[#E3E2E0] text-black border-l-2 border-[#C5A059]"
                  : "text-[#5F5E5E] hover:bg-[#E3E2E0] border-l-2 border-transparent hover:border-[#474747]"
              }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
