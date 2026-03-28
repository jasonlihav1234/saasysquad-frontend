import { Gelasio, Roboto } from "next/font/google";
import Link from "next/link";
import Sidebar from "@/components/settings/Sidebar";
import AccountForm from "@/components/settings/AccountForm";
import AestheticOptions from "@/components/settings/AestheticOptions";
import Footer from "@/components/universal/Footer";

const gelasio = Gelasio({
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const roboto = Roboto({
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export const metadata = {
  title: "Settings & Preferences | The Curated Althaïr",
  description:
    "Manage your account details, visual preferences, and security settings.",
};

export default function SettingsPage() {
  return (
    <main className="bg-[#F9F8F6] min-h-screen w-full flex flex-col">
      {/* Top bar */}
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
          Settings &amp; Preferences
        </h2>
      </header>

      {/* Body: sidebar + content */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <div className="flex-1 overflow-y-auto p-8 md:p-12 lg:p-16 max-w-4xl">
          <AccountForm />
          <AestheticOptions />

          <Footer />
        </div>
      </div>
    </main>
  );
}
