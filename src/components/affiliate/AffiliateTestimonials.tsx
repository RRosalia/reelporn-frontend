import React from "react";

interface Testimonial {
  quote: string;
  author: string;
  role: string;
  earnings: string;
}

interface AffiliateTestimonialsProps {
  title: string;
  subtitle: string;
  testimonial1: Testimonial;
  testimonial2: Testimonial;
  testimonial3: Testimonial;
  avgEarnings: string;
}

export default function AffiliateTestimonials({
  title,
  subtitle,
  testimonial1,
  testimonial2,
  testimonial3,
  avgEarnings,
}: AffiliateTestimonialsProps) {
  const testimonials = [testimonial1, testimonial2, testimonial3];

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="mb-14 text-center">
          <h2 className="mb-4 text-[42px] font-bold text-white">{title}</h2>
          <p className="text-lg text-white/70">{subtitle}</p>
        </div>

        <div className="grid gap-7 md:grid-cols-3">
          {testimonials.map((testimonial, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-white/10 bg-white/5 p-8 transition-all duration-300 hover:border-[rgba(248,197,55,0.2)] hover:bg-white/[0.08]"
            >
              <div className="mb-6 flex items-start gap-2">
                <i className="bi bi-quote mt-1 text-3xl text-[#f8c537]"></i>
                <p className="leading-relaxed text-white/90">
                  {testimonial.quote}
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-white/10 pt-4">
                <div>
                  <div className="font-bold text-white">{testimonial.author}</div>
                  <div className="text-sm text-white/60">{testimonial.role}</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-[#48bb78]">
                    {testimonial.earnings}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-14 text-center">
          <p className="text-lg font-semibold text-white/70">{avgEarnings}</p>
        </div>
      </div>
    </section>
  );
}
