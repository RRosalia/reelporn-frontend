"use client";

import React, { useState } from "react";

interface Example {
  title: string;
  referrals: string;
  avgSpend: string;
  monthly: string;
  yearly: string;
  description: string;
}

interface AffiliateEarningsSectionProps {
  // Calculator props
  calculatorTitle: string;
  calculatorSubtitle: string;
  referralsLabel: string;
  avgSpendLabel: string;
  monthlyLabel: string;
  yearlyLabel: string;
  lifetimeLabel: string;
  lifetimeNote: string;
  referralsPerMonth: string;
  perCustomer: string;
  disclaimer: string;

  // Examples props
  examplesTitle: string;
  example1: Example;
  example2: Example;
  example3: Example;
  note: string;
}

export default function AffiliateEarningsSection({
  calculatorTitle,
  calculatorSubtitle,
  referralsLabel,
  avgSpendLabel,
  monthlyLabel,
  yearlyLabel,
  lifetimeLabel,
  lifetimeNote,
  referralsPerMonth,
  perCustomer,
  disclaimer,
  examplesTitle,
  example1,
  example2,
  example3,
  note,
}: AffiliateEarningsSectionProps) {
  const [activeTab, setActiveTab] = useState<"calculator" | "examples">("calculator");
  const [referrals, setReferrals] = useState<number>(10);
  const [avgSpend, setAvgSpend] = useState<number>(50);

  const commissionRate = 0.4;
  const monthlyEarnings = referrals * avgSpend * commissionRate;
  const yearlyEarnings = monthlyEarnings * 12;
  const lifetimeEarnings = monthlyEarnings * 24;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const examples = [example1, example2, example3];

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="mb-10 text-center">
          <h2 className="mb-4 text-[42px] font-bold text-white">{calculatorTitle}</h2>
          <p className="text-lg text-white/70">{calculatorSubtitle}</p>
        </div>

        {/* Tabs */}
        <div className="mb-8 flex justify-center gap-4">
          <button
            onClick={() => setActiveTab("calculator")}
            className={`cursor-pointer rounded-full px-8 py-3 text-lg font-semibold transition-all ${
              activeTab === "calculator"
                ? "bg-gradient-to-br from-[#c2338a] to-[#f8c537] text-white"
                : "border border-white/20 bg-white/5 text-white/70 hover:bg-white/10"
            }`}
          >
            <i className="bi bi-calculator mr-2"></i>
            Calculator
          </button>
          <button
            onClick={() => setActiveTab("examples")}
            className={`cursor-pointer rounded-full px-8 py-3 text-lg font-semibold transition-all ${
              activeTab === "examples"
                ? "bg-gradient-to-br from-[#c2338a] to-[#f8c537] text-white"
                : "border border-white/20 bg-white/5 text-white/70 hover:bg-white/10"
            }`}
          >
            <i className="bi bi-cash-stack mr-2"></i>
            Real Examples
          </button>
        </div>

        {/* Calculator Tab */}
        {activeTab === "calculator" && (
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
        )}

        {/* Examples Tab */}
        {activeTab === "examples" && (
          <div>
            <h3 className="mb-8 text-center text-2xl font-bold text-white">
              {examplesTitle}
            </h3>
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

                  <h4 className="mb-4 text-2xl font-bold text-white">
                    {example.title}
                  </h4>

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
        )}
      </div>
    </section>
  );
}
