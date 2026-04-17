"use client";

import { Gelasio, Roboto } from "next/font/google";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useUser } from "@/components/providers/UserProvider";
import Link from "next/link";
import "material-symbols";

const roboto = Roboto({ subsets: ["latin"], style: ["normal", "italic"] });
const gelasio = Gelasio({ subsets: ["latin"], style: ["normal", "italic"] });

type Status = "loading" | "success" | "processing" | "failed";

export default function SubscriptionReturnPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const { refreshTier } = useUser();

  const [status, setStatus] = useState<Status>("loading");
  const [email, setEmail] = useState<string | null>(null);
  const [visible, setVisible] = useState<boolean>(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);

    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!sessionId) {
      setStatus("failed");
      return;
    }

    let cancelled = false;
    let attempts = 0;
    const MAX_ATTEMPTS = 6;

    const checkStatus = async () => {
      if (cancelled) return;

      try {
        const res = await fetch(
          `https://sassysquad-backend.vercel.app/checkout-session-status?session_id=${sessionId}`,
          { method: "GET" },
        );

        const data = await res.json();
        if (cancelled) return;

        if (!res.ok) {
          setStatus("failed");
          return;
        }

        setEmail(data.customer_email);

        if (data.status === "complete") {
          refreshTier();
          if (!cancelled) setStatus("success");
        } else if (data.status === "open" && attempts < MAX_ATTEMPTS) {
          ++attempts;
          setStatus("processing");
          setTimeout(checkStatus, 800);
        } else {
          setStatus("failed");
        }
      } catch (error) {
        console.log(error);
        if (!cancelled) {
          refreshTier();
          setStatus("success");
        }
      }
    };

    checkStatus();
    return () => {
      cancelled = true;
    };
  }, [sessionId, refreshTier]);

  return (
    <div className="min-h-screen bg-[#faf9f7] text-[#1a1c1b] flex items-center justify-center px-6">
      <div
        className={`max-w-xl w-full text-center transition-all duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)] ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        {(status === "loading" || status === "processing") && (
          <>
            <span className="material-symbols-outlined text-5xl text-[#775a19] animate-spin mb-6 inline-block">
              progress_activity
            </span>
            <h1 className={`${gelasio.className} text-4xl md:text-5xl mb-4`}>
              {status === "loading"
                ? "Confirming your subscription"
                : "Finalizing"}
            </h1>
            <p
              className={`${roboto.className} text-sm text-[#5f5e5e] leading-relaxed max-w-md mx-auto`}
            >
              {status === "loading"
                ? "Just a moment while we verify your payment."
                : "Payment received. Activating your membership…"}
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <p
              className={`${roboto.className} text-[0.75rem] uppercase tracking-[0.2em] text-[#775a19] mb-4`}
            >
              Welcome to The Althair
            </p>
            <h1
              className={`${gelasio.className} text-5xl md:text-6xl font-bold tracking-tight leading-tight mb-6`}
            >
              Your membership is{" "}
              <span className="italic font-normal">active</span>
            </h1>
            <div className="h-px w-24 bg-[#775a19] mx-auto mb-8" />
            <p
              className={`${roboto.className} text-sm text-[#5f5e5e] leading-relaxed max-w-md mx-auto mb-12`}
            >
              {email
                ? `A receipt has been sent to ${email}.`
                : "A receipt has been sent to your email."}{" "}
              You can manage your subscription from your account at any time.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/dashboard"
                className={`${roboto.className} px-8 py-4 bg-[#775a19] text-white text-xs uppercase tracking-widest font-medium hover:brightness-110 transition-all duration-300 no-underline`}
              >
                Begin curating
              </Link>
              <Link
                href="/settings"
                className={`${roboto.className} px-8 py-4 border border-[#d1c5b4] text-[#5f5e5e] text-xs uppercase tracking-widest font-medium hover:bg-[#f4f3f1] transition-all duration-300 no-underline`}
              >
                View account
              </Link>
            </div>
          </>
        )}

        {status === "failed" && (
          <>
            <span className="material-symbols-outlined text-5xl text-red-500 mb-6 inline-block">
              error
            </span>
            <h1 className={`${gelasio.className} text-4xl md:text-5xl mb-4`}>
              Something went wrong
            </h1>
            <p
              className={`${roboto.className} text-sm text-[#5f5e5e] leading-relaxed max-w-md mx-auto mb-12`}
            >
              We couldn't confirm your subscription. If you were charged, please
              contact support, otherwise you can try again.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/subscribe"
                className={`${roboto.className} px-8 py-4 bg-[#5f5e5e] text-white text-xs uppercase tracking-widest font-medium hover:bg-[#1a1c1b] transition-all duration-300 no-underline`}
              >
                Try again
              </Link>
              <Link
                href="/support"
                className={`${roboto.className} px-8 py-4 border border-[#d1c5b4] text-[#5f5e5e] text-xs uppercase tracking-widest font-medium hover:bg-[#f4f3f1] transition-all duration-300 no-underline`}
              >
                Contact support
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
