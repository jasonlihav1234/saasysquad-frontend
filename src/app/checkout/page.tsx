"use client";
import React, { useCallback } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";

export default function CheckoutPage() {
  const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
  );

  const authKey =
    "eyJhbGciOiJIUzI1NiJ9.eyJzdWJqZWN0X2NsYWltIjoiMDgwNDFjMDctM2QxNS00NzA4LTg4YTEtZGU0NDA0NjVlMzI2IiwiZW1haWwiOiJ0ZXN0MTIzQGdtYWlsLmNvbSIsInR5cGUiOiJhY2Nlc3MiLCJqd3RfaWQiOiIxMzgwNGNlMC05ZjBlLTQyZWItOTdlZC0zMGI3Y2FlODljYWQiLCJpYXQiOjE3NzUzNTYxNzIsImV4cCI6MTc3NTM1NzA3MiwiaXNzIjoic2Fhc3lzcXVhZC1hdXRoIiwiYXVkIjoic2Fhc3lzcXVhZC1hcGkifQ.ebe6C-7fpc79afvLitoQ_0bZQs0s82Mzr0xzegyc7dM";

  const fetchClientSecret = useCallback(async () => {
    const response = await fetch(
      "https://sassysquad-backend-git-story-sa-a97794-jasons-projects-ac5e4f90.vercel.app/create-checkout-session",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          Authorization: `Bearer ${authKey}`,
        },
        body: JSON.stringify({
          sellerId: "12",
          email: "test@gmail.com",
        }),
      },
    );

    const data = await response.json();
    return data.clientSecret;
  }, []);

  const options = { fetchClientSecret };

  return (
    <main className="min-h-screen bg-neutral-50 flex flex-col items-center pt-20 pb-32 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="w-full max-w-5xl bg-white shadow-sm ring-1 ring-neutral-900/5 sm:rounded-2xl p-6 sm:p-10 md:p-16">
        <div className="text-center mb-12">
          <p className="text-xs sm:text-sm font-medium tracking-[0.2em] text-neutral-400 uppercase mb-3">
            The Curated Althaïr
          </p>
          <h1 className="text-3xl sm:text-4xl font-light text-neutral-900 tracking-tight">
            Secure Checkout
          </h1>
          <div className="w-12 h-px bg-neutral-200 mx-auto mt-8"></div>
        </div>

        <div id="checkout" className="w-full relative">
          <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
            <EmbeddedCheckout />
          </EmbeddedCheckoutProvider>
        </div>
      </div>
    </main>
  );
}
