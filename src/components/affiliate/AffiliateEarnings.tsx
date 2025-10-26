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

interface CalculatorLabels {
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

interface AffiliateEarningsProps {
  // Tabs
  realExamplesTab: string;
  calculatorTab: string;

  // Real Examples
  examplesTitle: string;
  examplesSubtitle: string;
  example1: Example;
  example2: Example;
  example3: Example;
  examplesNote: string;

  // Calculator
  calculator: CalculatorLabels;
  ctaButton?: string;
  onApplyClick?: () => void;
}

export default function AffiliateEarnings({
  realExamplesTab,
  calculatorTab,
  examplesTitle,
  examplesSubtitle,
  example1,
  example2,
  example3,
  examplesNote,
  calculator,
  ctaButton,
  onApplyClick,
}: AffiliateEarningsProps) {
  const [activeTab, setActiveTab] = useState<"examples" | "calculator">(
    "calculator"
  );
  const [referrals, setReferrals] = useState<number>(10);
  const [avgSpend, setAvgSpend] = useState<number>(50);

  const examples = [example1, example2, example3];

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
    <section className="bg-white/[0.02] py-20">
      <div className="container mx-auto px-4">
        {/* Tab Navigation - Enhanced Visibility */}
        <div className="mb-10">
          <div className="mb-6 text-center">
            <p className="text-sm font-medium uppercase tracking-wider text-white/60">
              <i className="bi bi-arrow-left-right mr-2"></i>
              Choose Your View
            </p>
          </div>
          <div className="mx-auto flex max-w-[600px] gap-3 rounded-2xl border-2 border-[rgba(248,197,55,0.3)] bg-gradient-to-br from-[rgba(194,51,138,0.15)] to-[rgba(248,197,55,0.15)] p-2">
            <button
              onClick={() => setActiveTab("examples")}
              className={`flex-1 cursor-pointer rounded-xl px-6 py-4 text-lg font-bold transition-all duration-300 ${
                activeTab === "examples"
                  ? "bg-gradient-to-br from-[#c2338a] to-[#f8c537] text-white shadow-xl"
                  : "bg-transparent text-white/60 hover:bg-white/10 hover:text-white"
              }`}
            >
              <i className="bi bi-star-fill mr-2"></i>
              {realExamplesTab}
            </button>
            <button
              onClick={() => setActiveTab("calculator")}
              className={`flex-1 cursor-pointer rounded-xl px-6 py-4 text-lg font-bold transition-all duration-300 ${
                activeTab === "calculator"
                  ? "bg-gradient-to-br from-[#c2338a] to-[#f8c537] text-white shadow-xl"
                  : "bg-transparent text-white/60 hover:bg-white/10 hover:text-white"
              }`}
            >
              <i className="bi bi-calculator mr-2"></i>
              {calculatorTab}
            </button>
          </div>
        </div>

        {/* Real Examples Tab */}
        {activeTab === "examples" && (
          <div className="animate-fadeIn">
            <div className="mb-14 text-center">
              <h2 className="mb-4 text-[42px] font-bold text-white">
                {examplesTitle}
              </h2>
              <p className="text-lg text-white/70">{examplesSubtitle}</p>
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
                {examplesNote}
              </p>
            </div>
          </div>
        )}

        {/* Calculator Tab */}
        {activeTab === "calculator" && (
          <div className="animate-fadeIn">
            <div className="mb-10 text-center">
              <h2 className="mb-4 text-[42px] font-bold text-white">
                {calculator.title}
              </h2>
              <p className="text-lg text-white/70">{calculator.subtitle}</p>
            </div>

            <div className="mx-auto max-w-[1000px] rounded-xl border border-white/10 bg-white/5 p-10">
              <div className="grid gap-10 lg:grid-cols-2">
                {/* Input Section */}
                <div className="space-y-8">
                  <div>
                    <label className="mb-4 block text-base font-semibold text-white">
                      {calculator.referrals}
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="1000"
                      value={referrals}
                      onChange={(e) => setReferrals(Number(e.target.value))}
                      className="h-2 w-full cursor-pointer appearance-none rounded-lg transition-opacity duration-200 hover:opacity-90"
                      style={{
                        background: `linear-gradient(to right, #c2338a 0%, #f8c537 ${(referrals / 1000) * 100}%, rgba(255,255,255,0.1) ${(referrals / 1000) * 100}%)`,
                      }}
                    />
                    <div className="mt-3 text-center">
                      <span className="text-4xl font-bold text-white">
                        {referrals}
                      </span>
                      <span className="ml-2 text-sm text-white/60">
                        {calculator.referralsPerMonth}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="mb-4 block text-base font-semibold text-white">
                      {calculator.avgSpend}
                    </label>
                    <input
                      type="range"
                      min="10"
                      max="500"
                      step="10"
                      value={avgSpend}
                      onChange={(e) => setAvgSpend(Number(e.target.value))}
                      className="h-2 w-full cursor-pointer appearance-none rounded-lg transition-opacity duration-200 hover:opacity-90"
                      style={{
                        background: `linear-gradient(to right, #c2338a 0%, #f8c537 ${((avgSpend - 10) / 490) * 100}%, rgba(255,255,255,0.1) ${((avgSpend - 10) / 490) * 100}%)`,
                      }}
                    />
                    <div className="mt-3 text-center">
                      <span className="text-4xl font-bold text-white">
                        {formatCurrency(avgSpend)}
                      </span>
                      <span className="ml-2 text-sm text-white/60">
                        {calculator.perCustomer}
                      </span>
                    </div>
                  </div>

                  <div className="rounded-lg border border-white/10 bg-white/5 p-5 text-center">
                    <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-white/60">
                      Commission Rate
                    </div>
                    <div className="text-3xl font-bold text-white">40%</div>
                    <div className="mt-1 text-xs text-white/50">Lifetime Recurring</div>
                  </div>
                </div>

                {/* Results Section */}
                <div className="space-y-4">
                  {/* Monthly */}
                  <div className="rounded-xl border border-[rgba(248,197,55,0.2)] bg-gradient-to-br from-[rgba(194,51,138,0.1)] to-[rgba(248,197,55,0.1)] p-6 transition-all duration-200 hover:border-[rgba(248,197,55,0.4)]">
                    <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-white/60">
                      {calculator.monthlyEarnings}
                    </div>
                    <div className="text-5xl font-bold text-white">
                      {formatCurrency(monthlyEarnings)}
                    </div>
                    <div className="mt-2 text-sm text-white/70">
                      Recurring passive income
                    </div>
                  </div>

                  {/* Yearly */}
                  <div className="rounded-xl border border-white/10 bg-white/5 p-6 transition-all duration-200 hover:border-white/20">
                    <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-white/60">
                      {calculator.yearlyEarnings}
                    </div>
                    <div className="text-4xl font-bold text-white">
                      {formatCurrency(yearlyEarnings)}
                    </div>
                    <div className="mt-2 text-sm text-white/70">
                      Annual potential
                    </div>
                  </div>

                  {/* Lifetime */}
                  <div className="rounded-xl border border-white/10 bg-white/5 p-6 transition-all duration-200 hover:border-white/20">
                    <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-white/60">
                      {calculator.lifetimeEarnings}
                    </div>
                    <div className="text-4xl font-bold text-white">
                      {formatCurrency(lifetimeEarnings)}
                    </div>
                    <div className="mt-2 text-xs text-white/50">
                      {calculator.lifetimeNote}
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA Section */}
              {ctaButton && onApplyClick && (
                <div className="mt-10 border-t border-white/10 pt-8 text-center">
                  <p className="mb-5 text-lg font-semibold text-white">
                    Start earning {formatCurrency(monthlyEarnings)} per month
                  </p>
                  <button
                    onClick={onApplyClick}
                    className="inline-flex cursor-pointer items-center gap-2.5 rounded-[35px] border-none bg-gradient-to-br from-[#c2338a] to-[#f8c537] px-12 py-4 text-xl font-bold text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_25px_rgba(194,51,138,0.5)]"
                  >
                    <i className="bi bi-rocket-takeoff"></i>
                    {ctaButton}
                  </button>
                  <p className="mt-4 text-xs text-white/60">
                    Free to join • No commitments
                  </p>
                </div>
              )}

              {/* Disclaimer */}
              <div className="mt-6 rounded-xl bg-white/5 p-4 text-center">
                <p className="text-xs text-white/60">
                  <i className="bi bi-info-circle mr-1"></i>
                  {calculator.disclaimer}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
