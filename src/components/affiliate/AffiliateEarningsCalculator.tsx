"use client";

import React, { useState } from "react";

interface AffiliateEarningsCalculatorProps {
  title: string;
  subtitle: string;
  referrals: string;
  avgSpend: string;
  monthlyEarnings: string;
  yearlyEarnings: string;
  lifetimeEarnings: string;
  lifetimeNote: string;
  referralsPerMonth: string;
  perCustomer: string;
  disclaimer: string;
}

export default function AffiliateEarningsCalculator({
  title,
  subtitle,
  referrals: referralsLabel,
  avgSpend: avgSpendLabel,
  monthlyEarnings: monthlyLabel,
  yearlyEarnings: yearlyLabel,
  lifetimeEarnings: lifetimeLabel,
  lifetimeNote,
  referralsPerMonth,
  perCustomer,
  disclaimer,
}: AffiliateEarningsCalculatorProps) {
  const [referrals, setReferrals] = useState<number>(10);
  const [avgSpend, setAvgSpend] = useState<number>(50);

  const commissionRate = 0.4; // 40%
  const monthlyEarnings = referrals * avgSpend * commissionRate;
  const yearlyEarnings = monthlyEarnings * 12;
  const lifetimeEarnings = monthlyEarnings * 24; // Assume 2 year average lifetime

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="mb-10 text-center">
          <h2 className="mb-4 text-[42px] font-bold text-white">{title}</h2>
          <p className="text-lg text-white/70">{subtitle}</p>
        </div>

        <div className="mx-auto max-w-[900px] rounded-[20px] border border-white/10 bg-white/5 p-10">
          <div className="grid gap-10 md:grid-cols-2">
            {/* Input Section */}
            <div className="space-y-7">
              <div>
                <label className="mb-3 block text-lg font-semibold text-white">
                  {referralsLabel}
                </label>
                <input
                  type="range"
                  min="1"
                  max="1000"
                  value={referrals}
                  onChange={(e) => setReferrals(Number(e.target.value))}
                  className="h-2 w-full cursor-pointer appearance-none rounded-lg"
                  style={{
                    background: `linear-gradient(to right, #c2338a 0%, #f8c537 ${(referrals / 1000) * 100}%, rgba(255,255,255,0.1) ${(referrals / 1000) * 100}%)`,
                  }}
                />
                <div className="mt-2 text-center">
                  <span className="text-3xl font-bold text-[#f8c537]">
                    {referrals}
                  </span>
                  <span className="ml-2 text-white/60">{referralsPerMonth}</span>
                </div>
              </div>

              <div>
                <label className="mb-3 block text-lg font-semibold text-white">
                  {avgSpendLabel}
                </label>
                <input
                  type="range"
                  min="10"
                  max="500"
                  step="10"
                  value={avgSpend}
                  onChange={(e) => setAvgSpend(Number(e.target.value))}
                  className="h-2 w-full cursor-pointer appearance-none rounded-lg"
                  style={{
                    background: `linear-gradient(to right, #c2338a 0%, #f8c537 ${((avgSpend - 10) / 490) * 100}%, rgba(255,255,255,0.1) ${((avgSpend - 10) / 490) * 100}%)`,
                  }}
                />
                <div className="mt-2 text-center">
                  <span className="text-3xl font-bold text-[#f8c537]">
                    {formatCurrency(avgSpend)}
                  </span>
                  <span className="ml-2 text-white/60">{perCustomer}</span>
                </div>
              </div>
            </div>

            {/* Results Section */}
            <div className="space-y-5">
              <div className="rounded-xl border border-[rgba(248,197,55,0.2)] bg-gradient-to-br from-[rgba(194,51,138,0.1)] to-[rgba(248,197,55,0.1)] p-6">
                <div className="mb-2 text-sm font-semibold uppercase tracking-wide text-white/60">
                  {monthlyLabel}
                </div>
                <div className="text-4xl font-black text-white">
                  {formatCurrency(monthlyEarnings)}
                </div>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 p-6">
                <div className="mb-2 text-sm font-semibold uppercase tracking-wide text-white/60">
                  {yearlyLabel}
                </div>
                <div className="text-3xl font-bold text-white">
                  {formatCurrency(yearlyEarnings)}
                </div>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 p-6">
                <div className="mb-2 text-sm font-semibold uppercase tracking-wide text-white/60">
                  {lifetimeLabel}
                </div>
                <div className="text-3xl font-bold text-white">
                  {formatCurrency(lifetimeEarnings)}
                </div>
                <div className="mt-2 text-xs text-white/50">{lifetimeNote}</div>
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-lg bg-white/5 p-5 text-center">
            <p className="text-sm text-white/70">
              <i className="bi bi-info-circle mr-2"></i>
              {disclaimer}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
