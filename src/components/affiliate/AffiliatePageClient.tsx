"use client";

import React, { useEffect } from "react";
import { useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import AffiliateHero from "@/components/affiliate/AffiliateHero";
import AffiliateStats from "@/components/affiliate/AffiliateStats";
import AffiliateBenefits from "@/components/affiliate/AffiliateBenefits";
import AffiliateHowItWorks from "@/components/affiliate/AffiliateHowItWorks";
import AffiliateFeatures from "@/components/affiliate/AffiliateFeatures";
import AffiliateCommission from "@/components/affiliate/AffiliateCommission";
import AffiliateCTA from "@/components/affiliate/AffiliateCTA";

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

  // Add noindex meta tag when affiliate program is not active
  useEffect(() => {
    if (!affiliateUrl) {
      const metaTag = document.createElement('meta');
      metaTag.name = 'robots';
      metaTag.content = 'noindex, nofollow';
      document.head.appendChild(metaTag);

      return () => {
        document.head.removeChild(metaTag);
      };
    }
  }, [affiliateUrl]);

  // Don't render if affiliate program is not active
  if (!affiliateUrl) {
    return null;
  }

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
  ];

  const features = [
    {
      icon: "bi-speedometer2",
      title: t("features.dashboard.title"),
      description: t("features.dashboard.description"),
    },
    {
      icon: "bi-bar-chart-fill",
      title: t("features.analytics.title"),
      description: t("features.analytics.description"),
    },
    {
      icon: "bi-shield-check",
      title: t("features.tracking.title"),
      description: t("features.tracking.description"),
    },
    {
      icon: "bi-cash-stack",
      title: t("features.payouts.title"),
      description: t("features.payouts.description"),
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
      window.open(affiliateUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="bg-gradient-to-br from-[#1a1626] to-[#2b2838] pb-10">
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

      <AffiliateStats stats={stats} />

      <AffiliateBenefits
        title={t("benefits.title")}
        subtitle={t("benefits.subtitle")}
        benefits={benefits}
      />

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

      <AffiliateFeatures title={t("features.title")} features={features} />

      <AffiliateCommission
        title={t("commission.title")}
        description={t("commission.description")}
        item1={t("commission.item1")}
        item2={t("commission.item2")}
        item3={t("commission.item3")}
        item4={t("commission.item4")}
        tagline={t("commission.tagline")}
      />

      <AffiliateCTA
        title={t("cta.title")}
        description={t("cta.description")}
        button={t("cta.button")}
        note={t("cta.note")}
        onApplyClick={handleApplyClick}
      />
    </div>
  );
}
