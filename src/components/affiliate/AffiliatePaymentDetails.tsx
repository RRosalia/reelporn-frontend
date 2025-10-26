import React from "react";

interface Detail {
  title: string;
  amount?: string;
  frequency?: string;
  methods?: string;
  duration?: string;
  type?: string;
  access?: string;
  description: string;
}

interface AffiliatePaymentDetailsProps {
  title: string;
  subtitle: string;
  minimumPayout: Detail;
  paymentFrequency: Detail;
  paymentMethods: Detail;
  trackingWindow: Detail;
  commissionType: Detail;
  reporting: Detail;
}

export default function AffiliatePaymentDetails({
  title,
  subtitle,
  minimumPayout,
  paymentFrequency,
  paymentMethods,
  trackingWindow,
  commissionType,
  reporting,
}: AffiliatePaymentDetailsProps) {
  const details = [
    {
      icon: "bi-wallet2",
      ...minimumPayout,
      value: minimumPayout.amount,
    },
    {
      icon: "bi-calendar-check",
      ...paymentFrequency,
      value: paymentFrequency.frequency,
    },
    {
      icon: "bi-credit-card",
      ...paymentMethods,
      value: paymentMethods.methods,
    },
    {
      icon: "bi-clock-history",
      ...trackingWindow,
      value: trackingWindow.duration,
    },
    {
      icon: "bi-arrow-repeat",
      ...commissionType,
      value: commissionType.type,
    },
    {
      icon: "bi-graph-up",
      ...reporting,
      value: reporting.access,
    },
  ];

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="mb-14 text-center">
          <h2 className="mb-4 text-[42px] font-bold text-white">{title}</h2>
          <p className="text-lg text-white/70">{subtitle}</p>
        </div>

        <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
          {details.map((detail, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-white/10 bg-white/5 p-8 transition-all duration-300 hover:-translate-y-1 hover:border-[rgba(248,197,55,0.2)] hover:bg-white/[0.08]"
            >
              <div className="mb-5 flex items-center justify-between">
                <i
                  className={`bi ${detail.icon} text-4xl text-[#f8c537]`}
                ></i>
                <span className="rounded-full bg-gradient-to-br from-[rgba(194,51,138,0.2)] to-[rgba(248,197,55,0.2)] px-4 py-1 text-sm font-bold text-[#f8c537]">
                  {detail.value}
                </span>
              </div>

              <h3 className="mb-3 text-xl font-bold text-white">
                {detail.title}
              </h3>

              <p className="leading-relaxed text-white/70">{detail.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
