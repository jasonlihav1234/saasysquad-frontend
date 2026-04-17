import { Gelasio, Roboto } from "next/font/google";
import Link from "next/link";

interface AnalyticsTierProps {
  label: string;
  tier: string;
  tierColor?: string;
  description: string;
  locked?: boolean;
  unlockCopy?: string;
  children: React.ReactNode;
}

const gelasio = Gelasio({ subsets: ["latin"], style: ["normal", "italic"] });
const roboto = Roboto({ subsets: ["latin"], style: ["normal", "italic"] });
 
function AnalyticsTier({
  label,
  tier,
  tierColor = "#5f5e5e",
  description,
  locked = false,
  unlockCopy,
  children,
}: AnalyticsTierProps) {
  return (
    <section className="pb-24">
      <div className="flex justify-between items-end mb-10">
        <div className="max-w-md">
          <div className="flex items-center gap-3 mb-3">
            <span
              className={`${roboto.className} text-[0.6rem] uppercase tracking-[0.2em] px-2 py-0.5 border`}
              style={{ borderColor: tierColor, color: tierColor }}
            >
              {tier}
            </span>
          </div>
          <h3 className={`${gelasio.className} text-3xl mb-3`}>{label}</h3>
          <p className={`${roboto.className} text-sm text-[#5f5e5e] leading-relaxed`}>
            {description}
          </p>
        </div>
      </div>
 
      <div className="relative">
        <div
          className={`transition-all duration-500 ${
            locked ? "blur-md opacity-40 pointer-events-none select-none" : ""
          }`}
          aria-hidden={locked}
        >
          {children}
        </div>
 
        {locked && (
          <div className="absolute inset-0 flex items-center justify-center p-8">
            <div className="bg-[#faf9f7] border border-[#d1c5b4] p-10 max-w-md text-center shadow-[0_10px_40px_-10px_rgba(26,28,27,0.12)]">
              <span className="material-symbols-outlined text-3xl text-[#775a19] mb-4 inline-block">
                lock
              </span>
              <h4 className={`${gelasio.className} text-2xl mb-3`}>
                Reserved for {tier} members
              </h4>
              <p className={`${roboto.className} text-sm text-[#5f5e5e] leading-relaxed mb-8`}>
                {unlockCopy}
              </p>
              <Link
                href="/subscribe"
                className={`${roboto.className} inline-block px-8 py-4 bg-[#775a19] text-white text-[0.65rem] uppercase tracking-[0.2em] font-medium hover:brightness-110 transition-all duration-300 no-underline`}
              >
                Upgrade to {tier}
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}