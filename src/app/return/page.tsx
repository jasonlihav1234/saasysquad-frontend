"use client"

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";


export default function ReturnPage() {
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
        const response = await fetch(`https://sassysquad-backend.vercel.app/checkout-session-status/${sessionId}`);
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

  return (

  );
}