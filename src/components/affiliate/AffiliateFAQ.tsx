"use client";

import React, { useState } from "react";

interface Question {
  question: string;
  answer: string;
}

interface AffiliateFAQProps {
  title: string;
  subtitle: string;
  q1: Question;
  q2: Question;
  q3: Question;
  q4: Question;
  q5: Question;
}

export default function AffiliateFAQ({
  title,
  subtitle,
  q1,
  q2,
  q3,
  q4,
  q5,
}: AffiliateFAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const questions = [q1, q2, q3, q4, q5];

  const toggleQuestion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-white/[0.02] py-20">
      <div className="container mx-auto px-4">
        <div className="mb-14 text-center">
          <h2 className="mb-4 text-[42px] font-bold text-white">{title}</h2>
          <p className="text-lg text-white/70">{subtitle}</p>
        </div>

        <div className="mx-auto max-w-[900px] space-y-4">
          {questions.map((q, idx) => (
            <div
              key={idx}
              className="overflow-hidden rounded-xl border border-white/10 bg-white/5 transition-all duration-300 hover:border-[rgba(248,197,55,0.2)]"
            >
              <button
                onClick={() => toggleQuestion(idx)}
                className="flex w-full cursor-pointer items-center justify-between p-6 text-left transition-colors"
              >
                <span className="pr-4 text-lg font-semibold text-white">
                  {q.question}
                </span>
                <i
                  className={`bi ${
                    openIndex === idx ? "bi-chevron-up" : "bi-chevron-down"
                  } text-xl text-[#f8c537] transition-transform`}
                ></i>
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === idx ? "max-h-[500px]" : "max-h-0"
                }`}
              >
                <div className="border-t border-white/10 p-6 pt-4">
                  <p className="leading-relaxed text-white/80">{q.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
