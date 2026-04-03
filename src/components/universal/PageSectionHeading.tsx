import { Gelasio, Roboto } from "next/font/google";

const gelasio = Gelasio({
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const roboto = Roboto({
  subsets: ["latin"],
  style: ["normal", "italic"],
});

interface PageSectionHeadingProps {
  title: string;
  description: string;
  className?: string;
}

export default function PageSectionHeading({
  title,
  description,
  className,
}: PageSectionHeadingProps) {
  return (
    <div className={className}>
      <h1
        className={`${gelasio.className} text-black text-4xl font-normal leading-tight tracking-tight mb-2`}
      >
        {title}
      </h1>
      <p className={`${roboto.className} text-[#5F5E5E] text-base`}>
        {description}
      </p>
    </div>
  );
}
