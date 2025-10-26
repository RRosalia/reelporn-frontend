import React from "react";

interface AffiliateCTAProps {
  title: string;
  description: string;
  button: string;
  note: string;
  onApplyClick: () => void;
}

export default function AffiliateCTA({
  title,
  description,
  button,
  note,
  onApplyClick,
}: AffiliateCTAProps) {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-[700px] rounded-[20px] border-2 border-[rgba(248,197,55,0.3)] bg-gradient-to-br from-[rgba(194,51,138,0.15)] to-[rgba(248,197,55,0.15)] px-10 py-14 text-center">
          <h2 className="mb-5 text-[42px] font-bold text-white">{title}</h2>
          <p className="mb-7 text-lg leading-relaxed text-white/85">
            {description}
          </p>
          <button
            className="inline-flex items-center gap-2.5 rounded-[35px] border-none bg-gradient-to-br from-[#c2338a] to-[#f8c537] px-12 py-4 text-xl font-bold text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_25px_rgba(194,51,138,0.5)]"
            onClick={onApplyClick}
          >
            <i className="bi bi-rocket-takeoff"></i>
            {button}
          </button>
          <p className="mt-5 text-sm text-white/60">{note}</p>
        </div>
      </div>
    </section>
  );
}
