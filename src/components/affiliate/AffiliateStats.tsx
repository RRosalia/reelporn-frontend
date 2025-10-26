import React from "react";

interface Stat {
  number: string;
  label: string;
  icon: string;
}

interface AffiliateStatsProps {
  stats: Stat[];
}

export default function AffiliateStats({ stats }: AffiliateStatsProps) {
  return (
    <section className="bg-white/[0.03] py-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-10">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-white/10 bg-white/5 p-7 text-center transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.08]"
            >
              <i className={`bi ${stat.icon} mb-5 block text-5xl text-[#f8c537]`}></i>
              <h3 className="mb-2 text-5xl font-extrabold text-white">{stat.number}</h3>
              <p className="text-lg text-white/70">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
