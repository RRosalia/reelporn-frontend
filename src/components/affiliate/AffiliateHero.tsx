import React from "react";
import { trackAffiliateCTAClick } from "@/lib/utils/analytics";

interface AffiliateHeroProps {
  badge: string;
  title: string;
  subtitle: string;
  highlight1: string;
  highlight2: string;
  highlight3: string;
  joinNow: string;
  onApplyClick: () => void;
}

export default function AffiliateHero({
  badge,
  title,
  subtitle,
  highlight1,
  highlight2,
  highlight3,
  joinNow,
  onApplyClick,
}: AffiliateHeroProps) {
  return (
    <section className="relative overflow-hidden px-4 pb-20 pt-32 text-center">
      <div className="container mx-auto">
        <div className="relative z-[2] mx-auto max-w-[900px]">
          <div className="mb-7 inline-flex items-center gap-2 rounded-[20px] border border-[rgba(248,197,55,0.3)] bg-gradient-to-br from-[rgba(194,51,138,0.2)] to-[rgba(248,197,55,0.2)] px-5 py-2 font-semibold text-[#f8c537]">
            <i className="bi bi-star-fill text-[#f8c537]"></i>
            <span>{badge}</span>
          </div>
          <h1 className="mb-5 bg-gradient-to-br from-[#c2338a] to-[#f8c537] bg-clip-text text-6xl font-extrabold leading-tight text-transparent">
            {title}
          </h1>
          <p className="mb-10 text-[22px] leading-relaxed text-white/85">
            {subtitle}
          </p>
          <div className="mb-10 flex flex-wrap justify-center gap-7">
            <div className="flex items-center gap-2 text-white/90">
              <i className="bi bi-check-circle-fill text-xl text-[#48bb78]"></i>
              <span>{highlight1}</span>
            </div>
            <div className="flex items-center gap-2 text-white/90">
              <i className="bi bi-check-circle-fill text-xl text-[#48bb78]"></i>
              <span>{highlight2}</span>
            </div>
            <div className="flex items-center gap-2 text-white/90">
              <i className="bi bi-check-circle-fill text-xl text-[#48bb78]"></i>
              <span>{highlight3}</span>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-5">
            <button
              className="inline-flex cursor-pointer items-center gap-2.5 rounded-[35px] border-none bg-gradient-to-br from-[#c2338a] to-[#f8c537] px-12 py-4 text-xl font-bold text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_25px_rgba(194,51,138,0.5)]"
              onClick={() => {
                trackAffiliateCTAClick("hero");
                onApplyClick();
              }}
            >
              <i className="bi bi-rocket-takeoff"></i>
              {joinNow}
            </button>
          </div>
        </div>
      </div>
      <div className="pointer-events-none absolute left-0 top-0 z-[1] h-full w-full">
        <div className="absolute -right-[100px] -top-[100px] h-[400px] w-[400px] rounded-full bg-[radial-gradient(circle,rgba(248,197,55,0.15)_0%,transparent_70%)]"></div>
        <div className="absolute -bottom-[80px] -left-[80px] h-[300px] w-[300px] rounded-full bg-[radial-gradient(circle,rgba(194,51,138,0.15)_0%,transparent_70%)]"></div>
        <div className="absolute left-[10%] top-[50%] h-[200px] w-[200px] rounded-full bg-[radial-gradient(circle,rgba(248,197,55,0.1)_0%,transparent_70%)]"></div>
      </div>
    </section>
  );
}
