import React from "react";

interface Benefit {
  icon: string;
  title: string;
  description: string;
  highlight: string;
}

interface Step {
  title: string;
  description: string;
}

interface AffiliateBenefitsProps {
  title: string;
  subtitle: string;
  benefits: Benefit[];
}

export default function AffiliateBenefits({
  title,
  subtitle,
  benefits,
}: AffiliateBenefitsProps) {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="mb-14 text-center">
          <h2 className="mb-4 text-[42px] font-bold text-white">{title}</h2>
          <p className="text-lg text-white/70">{subtitle}</p>
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-7">
          {benefits.map((benefit, idx) => (
            <div
              key={idx}
              className="relative rounded-2xl border border-white/10 bg-white/5 p-10 text-center transition-all duration-300 hover:-translate-y-2 hover:border-[rgba(248,197,55,0.3)] hover:bg-white/[0.08]"
            >
              <div className="relative mb-5">
                <i className={`bi ${benefit.icon} block text-5xl text-[#c2338a]`}></i>
                {benefit.highlight && (
                  <span className="absolute -top-2 right-[calc(50%-60px)] rounded-[20px] bg-gradient-to-br from-[#c2338a] to-[#f8c537] px-4 py-1 text-sm font-bold text-white">
                    {benefit.highlight}
                  </span>
                )}
              </div>
              <h3 className="mb-4 text-2xl text-white">{benefit.title}</h3>
              <p className="leading-relaxed text-white/80">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
