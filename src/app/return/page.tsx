"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Gelasio, Roboto } from "next/font/google";

const roboto = Roboto({
  subsets: ["latin"],
  style: ["normal", "italic"],
});

function ReturnContent() {
  const [status, setStatus] = useState<string | null>(null);
  const [customerEmail, setCustomerEmail] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    if (!sessionId) {
      return;
    }

    const fetchSessionStatus = async () => {
      try {
        const response = await fetch(
          `https://sassysquad-backend.vercel.app/checkout-session-status?session_id=${sessionId}`,
        );
        const body = await response.json();

        setStatus(body.status);
        setCustomerEmail(body.customer_email);
      } catch (error) {
        console.log(error);
      }
    };

    fetchSessionStatus();
  }, [sessionId]);

  // payment failed, send to checkout
  if (status === "open") {
    router.push("/checkout");
    return null;
  }

  // successful payment
  if (status === "complete") {
    return (
      <div className="w-full max-w-2xl bg-white shadow-sm ring-1 ring-neutral-900/5 sm:rounded-2xl p-10 sm:p-16 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-50 mb-8">
          <svg
            className="h-8 w-8 text-green-500"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 12.75l6 6 9-13.5"
            />
          </svg>
        </div>

        <p className="text-xs sm:text-sm font-medium tracking-[0.2em] text-neutral-400 uppercase mb-4">
          The Curated Althaïr
        </p>

        <h1 className="text-3xl sm:text-4xl font-light text-neutral-900 tracking-tight mb-6">
          Order Confirmed
        </h1>

        <div className="w-12 h-px bg-neutral-200 mx-auto mb-6"></div>

        <p className="text-neutral-500 font-light leading-relaxed mb-10">
          Thank you for your purchase. We are preparing your order for shipment.
          A receipt and tracking details will be sent to <br />
          <span className="font-medium text-neutral-900">{customerEmail}</span>.
        </p>

        <Link
          href="/dashboard"
          className="inline-block bg-neutral-900 text-white px-10 py-4 text-xs sm:text-sm tracking-[0.15em] uppercase hover:bg-neutral-700 transition-colors duration-300"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-6">
      <div className="w-8 h-8 border-2 border-neutral-200 border-t-neutral-900 rounded-full animate-spin"></div>
      <p className="text-xs tracking-[0.2em] text-neutral-400 uppercase">
        Verifying Order...
      </p>
    </div>
  );
}

export default function ReturnPage() {
  return (
    <main
      className={`min-h-screen bg-neutral-50 flex flex-col items-center justify-center pt-20 pb-32 px-4 sm:px-6 lg:px-8 ${roboto.className}`}
    >
      <Suspense
        fallback={
          <div className="flex flex-col items-center justify-center space-y-6">
            <div className="w-8 h-8 border-2 border-neutral-200 border-t-neutral-900 rounded-full animate-spin"></div>
          </div>
        }
      >
        <ReturnContent />
      </Suspense>
    </main>
  );
}
