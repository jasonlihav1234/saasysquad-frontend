"use client";

import { Gelasio, Roboto } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

const gelasio = Gelasio({
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const roboto = Roboto({
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export default function CreateNewPasswordPage () {
    return (<></>);
}