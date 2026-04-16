"use client";

import { Gelasio, Roboto } from "next/font/google";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import "material-symbols";

const roboto = Roboto({ subsets: ["latin"], style: ["normal", "italic"] });
const gelasio = Gelasio({ subsets: ["latin"], style: ["normal", "italic"] });

type Status = "loading" | "success" | "processing" | "failed";

export default function SubscriptionReturnPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

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

    const checkStatus = async () => {
      try {
        const res = await fetch(
          `https://sassysquad-backend.vercel.app/checkout-session-status?session_id=${sessionId}`,
          { method: "GET" },
        );

        const data = await res.json();

        if (!res.ok) {
          setStatus("failed");
          return;
        }

        setEmail(data.customer_email);

        if (data.status === "complete") {
          setStatus("success");
        } else if (data.status === "open") {
          setStatus("processing");
          setTimeout(checkStatus, 1500);
        } else {
          setStatus("failed");
        }
      } catch (error) {
        console.log(error);
        setStatus("failed");
      }
    };

    checkStatus();
  }, [sessionId]);
}
