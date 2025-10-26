import React from "react";

interface Feature {
  icon: string;
  title: string;
  description: string;
}

interface AffiliateFeaturesProps {
  title: string;
  features: Feature[];
}

export default function AffiliateFeatures({
  title,
  features,
}: AffiliateFeaturesProps) {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-center text-[42px] font-bold text-white">{title}</h2>
        <div className="mt-14 grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-7">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-10 text-center transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.06]"
            >
              <i className={`bi ${feature.icon} mb-5 block text-5xl text-[#f8c537]`}></i>
              <h3 className="mb-3 text-[22px] text-white">{feature.title}</h3>
              <p className="leading-relaxed text-white/75">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
