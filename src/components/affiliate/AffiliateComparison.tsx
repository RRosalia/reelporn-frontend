import React from "react";

interface ComparisonProps {
  title?: string;
  subtitle?: string;
  reelPorn: string;
  competitor1: string;
  competitor2: string;
  features: {
    commission: string;
    recurring: string;
    cookieDuration: string;
    minimumPayout: string;
    payoutSpeed: string;
    cryptoPayouts: string;
    dashboard: string;
    support: string;
    postbacks: string;
    promoMaterials: string;
  };
  values: {
    commission_reelporn: string;
    commission_competitor1: string;
    commission_competitor2: string;
    recurring_reelporn: string;
    recurring_competitor1: string;
    recurring_competitor2: string;
    cookie_reelporn: string;
    cookie_competitor1: string;
    cookie_competitor2: string;
    minimum_reelporn: string;
    minimum_competitor1: string;
    minimum_competitor2: string;
    speed_reelporn: string;
    speed_competitor1: string;
    speed_competitor2: string;
    crypto_yes: string;
    crypto_no: string;
    yes: string;
    no: string;
    limited: string;
  };
  footer: string;
}

export default function AffiliateComparison({
  title,
  subtitle,
  reelPorn,
  competitor1,
  competitor2,
  features,
  values,
  footer,
}: ComparisonProps) {
  const rows = [
    {
      feature: features.commission,
      reelporn: values.commission_reelporn,
      comp1: values.commission_competitor1,
      comp2: values.commission_competitor2,
      highlight: true,
    },
    {
      feature: features.recurring,
      reelporn: values.recurring_reelporn,
      comp1: values.recurring_competitor1,
      comp2: values.recurring_competitor2,
      highlight: true,
    },
    {
      feature: features.cookieDuration,
      reelporn: values.cookie_reelporn,
      comp1: values.cookie_competitor1,
      comp2: values.cookie_competitor2,
    },
    {
      feature: features.minimumPayout,
      reelporn: values.minimum_reelporn,
      comp1: values.minimum_competitor1,
      comp2: values.minimum_competitor2,
      highlight: true,
    },
    {
      feature: features.payoutSpeed,
      reelporn: values.speed_reelporn,
      comp1: values.speed_competitor1,
      comp2: values.speed_competitor2,
    },
    {
      feature: features.cryptoPayouts,
      reelporn: values.crypto_yes,
      comp1: values.crypto_no,
      comp2: values.crypto_no,
      highlight: true,
    },
    {
      feature: features.dashboard,
      reelporn: values.yes,
      comp1: values.yes,
      comp2: values.limited,
    },
    {
      feature: features.support,
      reelporn: values.yes,
      comp1: values.limited,
      comp2: values.no,
      highlight: true,
    },
    {
      feature: features.postbacks,
      reelporn: values.yes,
      comp1: values.no,
      comp2: values.yes,
    },
    {
      feature: features.promoMaterials,
      reelporn: values.yes,
      comp1: values.yes,
      comp2: values.limited,
    },
  ];

  return (
    <section className="bg-white/[0.02] py-20">
      <div className="container mx-auto px-4">
        {(title || subtitle) && (
          <div className="mb-14 text-center">
            {title && <h2 className="mb-4 text-[42px] font-bold text-white">{title}</h2>}
            {subtitle && <p className="text-lg text-white/70">{subtitle}</p>}
          </div>
        )}

        <div className="mx-auto max-w-[1100px] overflow-x-auto">
          <div className="min-w-[700px] rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
            {/* Header */}
            <div className="grid grid-cols-4 gap-4 border-b border-white/10 bg-white/5 p-6">
              <div className="font-semibold text-white/70"></div>
              <div className="text-center">
                <div className="mb-2 inline-block rounded-full bg-gradient-to-br from-[#c2338a] to-[#f8c537] px-4 py-1 text-sm font-bold text-white">
                  {reelPorn}
                </div>
              </div>
              <div className="text-center font-semibold text-white/50">
                {competitor1}
              </div>
              <div className="text-center font-semibold text-white/50">
                {competitor2}
              </div>
            </div>

            {/* Rows */}
            {rows.map((row, idx) => (
              <div
                key={idx}
                className={`grid grid-cols-4 gap-4 border-b border-white/10 p-6 ${
                  row.highlight ? "bg-white/[0.02]" : ""
                }`}
              >
                <div className="font-medium text-white/90">{row.feature}</div>
                <div className="text-center">
                  <span className="inline-block rounded-full bg-gradient-to-br from-[rgba(194,51,138,0.2)] to-[rgba(248,197,55,0.2)] px-4 py-1 font-bold text-[#f8c537]">
                    {row.reelporn}
                  </span>
                </div>
                <div className="text-center text-white/60">{row.comp1}</div>
                <div className="text-center text-white/60">{row.comp2}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 text-center">
          <p className="text-lg font-semibold text-white/80">{footer}</p>
        </div>
      </div>
    </section>
  );
}
