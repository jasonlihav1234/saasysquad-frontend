"use client";

import { Roboto, Gelasio } from "next/font/google";
import "material-symbols";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  style: ["normal", "italic"],
});

const gelasio = Gelasio({
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export interface ReviewCardProps {
  name: string;
  date: string;
  rating: number;
  body: string;
}

export default function ReviewCard({ name, date, rating, body }: ReviewCardProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <p className={`${roboto.className} font-bold text-sm uppercase tracking-widest text-[#1a1c1b]`}>
            {name}
          </p>
          <p className={`${roboto.className} text-[#7f7667] text-[0.7rem] uppercase tracking-tight`}>
            {date}
          </p>
        </div>
        <div className="flex text-[#775a19] scale-75 origin-right">
          {[...Array(5)].map((item, i) => (
            <span
              key={i}
              className="material-symbols-outlined"
              style={{ fontVariationSettings: i < rating ? "'FILL' 1" : "'FILL' 0" }}
            >
              star
            </span>
          ))}
        </div>
      </div>
      <p className={`${roboto.className} text-sm text-[#5f5e5e] leading-relaxed`}>
        {body}
      </p>
    </div>
  );
}
