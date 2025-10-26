import React from "react";

interface Example {
  title: string;
  referrals: string;
  avgSpend: string;
  monthly: string;
  yearly: string;
  description: string;
}

interface AffiliateEarningsExamplesProps {
  title: string;
  subtitle: string;
  example1: Example;
  example2: Example;
  example3: Example;
  note: string;
}

export default function AffiliateEarningsExamples({
  title,
  subtitle,
  example1,
  example2,
  example3,
  note,
}: AffiliateEarningsExamplesProps) {
  const examples = [example1, example2, example3];

  return (
    <section className="bg-white/[0.02] py-20">
      <div className="container mx-auto px-4">
        <div className="mb-14 text-center">
          <h2 className="mb-4 text-[42px] font-bold text-white">{title}</h2>
          <p className="text-lg text-white/70">{subtitle}</p>
        </div>

        <div className="grid gap-7 md:grid-cols-3">
          {examples.map((example, idx) => (
            <div
              key={idx}
              className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-8 transition-all duration-300 hover:-translate-y-2 hover:border-[rgba(248,197,55,0.3)] hover:bg-white/[0.08]"
            >
              {idx === 1 && (
                <div className="absolute right-4 top-4 rounded-full bg-gradient-to-br from-[#c2338a] to-[#f8c537] px-3 py-1 text-xs font-bold text-white">
                  POPULAR
                </div>
              )}

              <h3 className="mb-4 text-2xl font-bold text-white">
                {example.title}
              </h3>

              <div className="mb-6 space-y-2 text-sm text-white/70">
                <div className="flex items-center gap-2">
                  <i className="bi bi-people-fill text-[#f8c537]"></i>
                  <span>{example.referrals}</span>
                </div>
                <div className="flex items-center gap-2">
                  <i className="bi bi-currency-dollar text-[#f8c537]"></i>
                  <span>{example.avgSpend}</span>
                </div>
              </div>

              <div className="mb-4">
                <div className="mb-2 text-sm font-semibold uppercase tracking-wide text-white/60">
                  Monthly Earnings
                </div>
                <div className="mb-4 bg-gradient-to-br from-[#c2338a] to-[#f8c537] bg-clip-text text-4xl font-black text-transparent">
                  {example.monthly}
                </div>

                <div className="mb-2 text-sm font-semibold uppercase tracking-wide text-white/60">
                  Yearly Potential
                </div>
                <div className="text-2xl font-bold text-white">
                  {example.yearly}
                </div>
              </div>

              <p className="mt-6 border-t border-white/10 pt-4 text-sm leading-relaxed text-white/80">
                {example.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <p className="mx-auto max-w-[800px] text-lg italic text-white/70">
            <i className="bi bi-info-circle mr-2"></i>
            {note}
          </p>
        </div>
      </div>
    </section>
  );
}
