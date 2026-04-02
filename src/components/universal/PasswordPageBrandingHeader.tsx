import { Gelasio } from "next/font/google";

const gelasio = Gelasio({
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export default function PasswordPageBrandingHeader() {
  return (
    <h1
      className={`${gelasio.className} text-black text-3xl text-center pt-10`}
    >
      The Curated Althaïr
    </h1>
  );
}
