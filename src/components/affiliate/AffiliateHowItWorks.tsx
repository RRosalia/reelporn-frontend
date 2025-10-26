import React from "react";

interface Step {
  title: string;
  description: string;
}

interface AffiliateHowItWorksProps {
  title: string;
  step1: Step;
  step2: Step;
  step3: Step;
  step4: Step;
}

export default function AffiliateHowItWorks({
  title,
  step1,
  step2,
  step3,
  step4,
}: AffiliateHowItWorksProps) {
  const steps = [step1, step2, step3, step4];

  return (
    <section className="bg-white/[0.02] py-20">
      <div className="container mx-auto px-4">
        <h2 className="mb-14 text-center text-[42px] font-bold text-white">{title}</h2>
        <div className="mx-auto mt-14 flex max-w-[900px] flex-col gap-0">
          {steps.map((step, idx) => (
            <React.Fragment key={idx}>
              <div className="flex items-start gap-7">
                <div className="flex h-[60px] w-[60px] shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#c2338a] to-[#f8c537] text-[28px] font-extrabold text-white">
                  {idx + 1}
                </div>
                <div className="flex-1 pb-5">
                  <h3 className="mb-2 text-2xl text-white">{step.title}</h3>
                  <p className="leading-relaxed text-white/80">{step.description}</p>
                </div>
              </div>
              {idx < steps.length - 1 && (
                <div className="ml-7 h-10 w-[3px] bg-gradient-to-b from-[rgba(248,197,55,0.5)] to-[rgba(194,51,138,0.5)]"></div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
