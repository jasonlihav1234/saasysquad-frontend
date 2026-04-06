"use client";

import { Roboto } from "next/font/google";
import Link from "next/link";

const roboto = Roboto({
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export type SidebarActivePage = "account" | "purchases" | "sales";

interface NavItem {
  id: SidebarActivePage;
  label: string;
  href: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: "account", label: "Account Details", href: "/settings" },
  { id: "purchases", label: "Purchases", href: "/purchases" },
  { id: "sales", label: "Sales", href: "/sales" },
];

interface SidebarProps {
  activePage: SidebarActivePage;
}

export default function Sidebar({ activePage }: SidebarProps) {
  return (
    <aside className="hidden md:flex w-64 flex-col bg-[#F1F1EF] border-r border-[#C5A059]/20 py-10 pl-8 pr-4 shrink-0">
      <nav className="flex flex-col gap-1" aria-label="Section">
        {NAV_ITEMS.map((item) => {
          const isActive = item.id === activePage;
          return (
            <Link
              key={item.id}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={`${roboto.className} flex items-center gap-3 px-4 py-3 text-sm tracking-widest uppercase transition-colors duration-200
              ${
                isActive
                  ? "bg-[#E3E2E0] text-black border-l-2 border-[#C5A059]"
                  : "text-[#5F5E5E] hover:bg-[#E3E2E0] border-l-2 border-transparent hover:border-[#474747]"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
