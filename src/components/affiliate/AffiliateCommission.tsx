import React from "react";

interface AffiliateCommissionProps {
  title: string;
  description: string;
  item1: string;
  item2: string;
  item3: string;
  item4: string;
  tagline: string;
}

export default function AffiliateCommission({
  title,
  description,
  item1,
  item2,
  item3,
  item4,
  tagline,
}: AffiliateCommissionProps) {
  return (
    <section className="bg-white/[0.02] py-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-center gap-14 rounded-[20px] border-2 border-[rgba(248,197,55,0.2)] bg-gradient-to-br from-[rgba(194,51,138,0.1)] to-[rgba(248,197,55,0.1)] px-10 py-14">
          <div className="min-w-[300px] flex-1">
            <h2 className="mb-5 text-[38px] font-bold text-white">{title}</h2>
            <p className="mb-7 text-lg leading-relaxed text-white/85">
              {description}
            </p>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3 text-white/90">
                <i className="bi bi-check2-circle text-[22px] text-[#48bb78]"></i>
                <span>{item1}</span>
              </div>
              <div className="flex items-center gap-3 text-white/90">
                <i className="bi bi-check2-circle text-[22px] text-[#48bb78]"></i>
                <span>{item2}</span>
              </div>
              <div className="flex items-center gap-3 text-white/90">
                <i className="bi bi-check2-circle text-[22px] text-[#48bb78]"></i>
                <span>{item3}</span>
              </div>
              <div className="flex items-center gap-3 text-white/90">
                <i className="bi bi-check2-circle text-[22px] text-[#48bb78]"></i>
                <span>{item4}</span>
              </div>
            </div>
          </div>
          <div className="min-w-[250px] text-center">
            <div className="mb-5 inline-block rounded-[20px] bg-gradient-to-br from-[#c2338a] to-[#f8c537] px-12 py-10">
              <span className="text-[80px] font-black leading-none text-white">40</span>
              <span className="text-6xl font-bold text-white">%</span>
            </div>
            <p className="text-lg font-semibold text-white/90">{tagline}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
