"use client";

import React, { useEffect } from "react";
import { useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import AffiliateHero from "@/components/affiliate/AffiliateHero";
import AffiliateBenefits from "@/components/affiliate/AffiliateBenefits";
import AffiliateCommission from "@/components/affiliate/AffiliateCommission";
import AffiliateEarnings from "@/components/affiliate/AffiliateEarnings";
import AffiliateHowItWorks from "@/components/affiliate/AffiliateHowItWorks";
import AffiliateTestimonials from "@/components/affiliate/AffiliateTestimonials";
import AffiliateFAQ from "@/components/affiliate/AffiliateFAQ";
import AffiliateCTA from "@/components/affiliate/AffiliateCTA";
import { trackAffiliateCTAClick } from "@/lib/utils/analytics";

export default function AffiliatePageClient() {
  // Use English translations (auto-translated versions will be available after deployment)
  const t = useTranslations("affiliate");
  const router = useRouter();
  const affiliateUrl = process.env.NEXT_PUBLIC_AFFILIATE_URL;

  // Redirect to home if affiliate program is not active
  useEffect(() => {
    if (!affiliateUrl) {
      router.push('/');
    }
  }, [affiliateUrl, router]);

  // Don't render if affiliate program is not active
  if (!affiliateUrl) {
    return null;
  }

  // Merged Benefits + Features into one comprehensive section
  const benefits = [
    {
      icon: "bi-percent",
      title: t("benefits.commission.title"),
      description: t("benefits.commission.description"),
      highlight: "40%",
    },
    {
      icon: "bi-clock-history",
      title: t("benefits.cookiePolicy.title"),
      description: t("benefits.cookiePolicy.description"),
      highlight: "60",
    },
    {
      icon: "bi-graph-up-arrow",
      title: t("benefits.realtime.title"),
      description: t("benefits.realtime.description"),
      highlight: "",
    },
    {
      icon: "bi-broadcast",
      title: t("benefits.postbacks.title"),
      description: t("benefits.postbacks.description"),
      highlight: "",
    },
    {
      icon: "bi-headset",
      title: t("benefits.support.title"),
      description: t("benefits.support.description"),
      highlight: "",
    },
    {
      icon: "bi-currency-bitcoin",
      title: t("benefits.cryptoPayouts.title"),
      description: t("benefits.cryptoPayouts.description"),
      highlight: "",
    },
    {
      icon: "bi-speedometer2",
      title: t("features.dashboard.title"),
      description: t("features.dashboard.description"),
      highlight: "",
    },
    {
      icon: "bi-bar-chart-fill",
      title: t("features.analytics.title"),
      description: t("features.analytics.description"),
      highlight: "",
    },
    {
      icon: "bi-shield-check",
      title: t("features.tracking.title"),
      description: t("features.tracking.description"),
      highlight: "",
    },
    {
      icon: "bi-cash-stack",
      title: t("features.payouts.title"),
      description: t("features.payouts.description"),
      highlight: "",
    },
  ];

  const stats = [
    {
      number: "40%",
      label: t("stats.commission"),
      icon: "bi-graph-up",
    },
    {
      number: "60",
      label: t("stats.cookieDays"),
      icon: "bi-calendar-check",
    },
    {
      number: "24/7",
      label: t("stats.support"),
      icon: "bi-headset",
    },
  ];

  const handleApplyClick = () => {
    if (affiliateUrl) {
      window.open(affiliateUrl, '_blank');
    }
  };

  return (
    <div className="bg-gradient-to-br from-[#1a1626] to-[#2b2838]">
      {/* 1. Hero */}
      <AffiliateHero
        badge={t("hero.badge")}
        title={t("hero.title")}
        subtitle={t("hero.subtitle")}
        highlight1={t("hero.highlight1")}
        highlight2={t("hero.highlight2")}
        highlight3={t("hero.highlight3")}
        joinNow={t("hero.joinNow")}
        onApplyClick={handleApplyClick}
      />

      {/* 2. Commission Structure */}
      <AffiliateCommission
        title={t("commission.title")}
        description={t("commission.description")}
        item1={t("commission.item1")}
        item2={t("commission.item2")}
        item3={t("commission.item3")}
        item4={t("commission.item4")}
        tagline={t("commission.tagline")}
        stats={stats}
      />

      {/* 3. Why Partner With Us */}
      <AffiliateBenefits
        title={t("benefits.title")}
        subtitle={t("benefits.subtitle")}
        benefits={benefits}
      />

      {/* 4. Calculator */}
      <AffiliateEarnings
        realExamplesTab={t("earnings.realExamplesTab")}
        calculatorTab={t("earnings.calculatorTab")}
        examplesTitle={t("examples.title")}
        examplesSubtitle={t("examples.subtitle")}
        example1={{
          title: t("examples.example1.title"),
          referrals: t("examples.example1.referrals"),
          avgSpend: t("examples.example1.avgSpend"),
          monthly: t("examples.example1.monthly"),
          yearly: t("examples.example1.yearly"),
          description: t("examples.example1.description"),
        }}
        example2={{
          title: t("examples.example2.title"),
          referrals: t("examples.example2.referrals"),
          avgSpend: t("examples.example2.avgSpend"),
          monthly: t("examples.example2.monthly"),
          yearly: t("examples.example2.yearly"),
          description: t("examples.example2.description"),
        }}
        example3={{
          title: t("examples.example3.title"),
          referrals: t("examples.example3.referrals"),
          avgSpend: t("examples.example3.avgSpend"),
          monthly: t("examples.example3.monthly"),
          yearly: t("examples.example3.yearly"),
          description: t("examples.example3.description"),
        }}
        examplesNote={t("examples.note")}
        calculator={{
          title: t("calculator.title"),
          subtitle: t("calculator.subtitle"),
          referrals: t("calculator.referrals"),
          avgSpend: t("calculator.avgSpend"),
          monthlyEarnings: t("calculator.monthlyEarnings"),
          yearlyEarnings: t("calculator.yearlyEarnings"),
          lifetimeEarnings: t("calculator.lifetimeEarnings"),
          lifetimeNote: t("calculator.lifetimeNote"),
          referralsPerMonth: t("calculator.referralsPerMonth"),
          perCustomer: t("calculator.perCustomer"),
          disclaimer: t("calculator.disclaimer"),
        }}
        ctaButton={t("cta.button")}
        onApplyClick={() => {
          trackAffiliateCTAClick("calculator");
          handleApplyClick();
        }}
      />

      {/* 5. How It Works */}
      <AffiliateHowItWorks
        title={t("howItWorks.title")}
        step1={{
          title: t("howItWorks.step1.title"),
          description: t("howItWorks.step1.description"),
        }}
        step2={{
          title: t("howItWorks.step2.title"),
          description: t("howItWorks.step2.description"),
        }}
        step3={{
          title: t("howItWorks.step3.title"),
          description: t("howItWorks.step3.description"),
        }}
        step4={{
          title: t("howItWorks.step4.title"),
          description: t("howItWorks.step4.description"),
        }}
      />

      {/* 6. FAQ - Compact (5 questions) */}
      <AffiliateFAQ
        title={t("faq.title")}
        subtitle={t("faq.subtitle")}
        q1={{
          question: t("faq.q1.question"),
          answer: t("faq.q1.answer"),
        }}
        q2={{
          question: t("faq.q2.question"),
          answer: t("faq.q2.answer"),
        }}
        q3={{
          question: t("faq.q3.question"),
          answer: t("faq.q3.answer"),
        }}
        q4={{
          question: t("faq.q4.question"),
          answer: t("faq.q4.answer"),
        }}
        q5={{
          question: t("faq.q5.question"),
          answer: t("faq.q5.answer"),
        }}
      />

      {/* 7. Success Stories */}
      <AffiliateTestimonials
        title={t("testimonials.title")}
        subtitle={t("testimonials.subtitle")}
        testimonial1={{
          quote: t("testimonials.testimonial1.quote"),
          author: t("testimonials.testimonial1.author"),
          role: t("testimonials.testimonial1.role"),
          earnings: t("testimonials.testimonial1.earnings"),
        }}
        testimonial2={{
          quote: t("testimonials.testimonial2.quote"),
          author: t("testimonials.testimonial2.author"),
          role: t("testimonials.testimonial2.role"),
          earnings: t("testimonials.testimonial2.earnings"),
        }}
        testimonial3={{
          quote: t("testimonials.testimonial3.quote"),
          author: t("testimonials.testimonial3.author"),
          role: t("testimonials.testimonial3.role"),
          earnings: t("testimonials.testimonial3.earnings"),
        }}
        avgEarnings={t("testimonials.avgEarnings")}
      />

      {/* 8. Final Full-Width CTA */}
      <AffiliateCTA
        title={t("cta.title")}
        description={t("cta.description")}
        button={t("cta.button")}
        note={t("cta.note")}
        location="footer"
        onApplyClick={handleApplyClick}
      />
    </div>
  );
}
