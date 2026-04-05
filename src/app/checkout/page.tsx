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
    "eyJhbGciOiJIUzI1NiJ9.eyJzdWJqZWN0X2NsYWltIjoiMDgwNDFjMDctM2QxNS00NzA4LTg4YTEtZGU0NDA0NjVlMzI2IiwiZW1haWwiOiJ0ZXN0MTIzQGdtYWlsLmNvbSIsInR5cGUiOiJhY2Nlc3MiLCJqd3RfaWQiOiI2ZjRkZjc2Ny1mOTk5LTRkY2QtOGJhMy0wNTczYjE4YTA2NTUiLCJpYXQiOjE3NzUzNTQwMDMsImV4cCI6MTc3NTM1NDkwMywiaXNzIjoic2Fhc3lzcXVhZC1hdXRoIiwiYXVkIjoic2Fhc3lzcXVhZC1hcGkifQ.D1_tlSOPayBt1E7dvEyB8cCN9FMb9pWZSB2RT1-e7vA";

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
    <main className="max-w-4xl mx-auto p-10">
      <h1 className="text-2xl font-bold mb-5">Complete Your Purchase</h1>
      <div id="checkout" className="my-10">
        <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
          <EmbeddedCheckout />
        </EmbeddedCheckoutProvider>
      </div>
    </main>
  );
}
