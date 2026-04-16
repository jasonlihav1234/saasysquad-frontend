"use client"

import { Gelasio, Roboto } from "next/font/google";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import "material-symbols";

const roboto = Roboto({ subsets: ["latin"], style: ["normal", "italic"] });
const gelasio = Gelasio({ subsets: ["latin"], style: ["normal", "italic"] });
 
type Status = "loading" | "success" | "processing" | "failed";

export default function SubscriptionReturnPage() {
  
}
