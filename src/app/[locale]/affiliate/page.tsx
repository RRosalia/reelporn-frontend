"use client";

import React, { useEffect } from "react";
import { useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import "./styles.css";

function AffiliatePage() {
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
    <div className="affiliate-page">
      {/* Hero Section */}
      <section className="affiliate-hero">
        <div className="container mx-auto px-4">
          <div className="hero-content">
            <div className="hero-badge">
              <i className="bi bi-star-fill"></i>
              <span>{t("hero.badge")}</span>
            </div>
            <h1 className="hero-title">{t("hero.title")}</h1>
            <p className="hero-subtitle">{t("hero.subtitle")}</p>
            <div className="hero-highlights">
              <div className="highlight">
                <i className="bi bi-check-circle-fill"></i>
                <span>{t("hero.highlight1")}</span>
              </div>
              <div className="highlight">
                <i className="bi bi-check-circle-fill"></i>
                <span>{t("hero.highlight2")}</span>
              </div>
              <div className="highlight">
                <i className="bi bi-check-circle-fill"></i>
                <span>{t("hero.highlight3")}</span>
              </div>
            </div>
            <div className="hero-actions">
              <button
                className="btn-primary-large"
                onClick={handleApplyClick}
              >
                <i className="bi bi-rocket-takeoff"></i>
                {t("hero.joinNow")}
              </button>
            </div>
          </div>
        </div>
        <div className="hero-decoration">
          <div className="decoration-circle circle-1"></div>
          <div className="decoration-circle circle-2"></div>
          <div className="decoration-circle circle-3"></div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container mx-auto px-4">
          <div className="stats-grid">
            {stats.map((stat, idx) => (
              <div key={idx} className="stat-card">
                <i className={`bi ${stat.icon} stat-icon`}></i>
                <h3 className="stat-number">{stat.number}</h3>
                <p className="stat-label">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="benefits-section">
        <div className="container mx-auto px-4">
          <div className="section-header">
            <h2 className="section-title">{t("benefits.title")}</h2>
            <p className="section-subtitle">{t("benefits.subtitle")}</p>
          </div>
          <div className="benefits-grid">
            {benefits.map((benefit, idx) => (
              <div key={idx} className="benefit-card">
                <div className="benefit-icon-wrapper">
                  <i className={`bi ${benefit.icon} benefit-icon`}></i>
                  {benefit.highlight && (
                    <span className="benefit-highlight">{benefit.highlight}</span>
                  )}
                </div>
                <h3>{benefit.title}</h3>
                <p>{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <div className="container mx-auto px-4">
          <h2 className="section-title text-center">{t("howItWorks.title")}</h2>
          <div className="steps-container">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>{t("howItWorks.step1.title")}</h3>
                <p>{t("howItWorks.step1.description")}</p>
              </div>
            </div>
            <div className="step-connector"></div>
            <div className="step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>{t("howItWorks.step2.title")}</h3>
                <p>{t("howItWorks.step2.description")}</p>
              </div>
            </div>
            <div className="step-connector"></div>
            <div className="step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>{t("howItWorks.step3.title")}</h3>
                <p>{t("howItWorks.step3.description")}</p>
              </div>
            </div>
            <div className="step-connector"></div>
            <div className="step">
              <div className="step-number">4</div>
              <div className="step-content">
                <h3>{t("howItWorks.step4.title")}</h3>
                <p>{t("howItWorks.step4.description")}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container mx-auto px-4">
          <h2 className="section-title text-center">{t("features.title")}</h2>
          <div className="features-grid">
            {features.map((feature, idx) => (
              <div key={idx} className="feature-card">
                <i className={`bi ${feature.icon} feature-icon`}></i>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Commission Details Section */}
      <section className="commission-section">
        <div className="container mx-auto px-4">
          <div className="commission-card">
            <div className="commission-content">
              <h2>{t("commission.title")}</h2>
              <p className="commission-description">{t("commission.description")}</p>
              <div className="commission-highlights">
                <div className="commission-item">
                  <i className="bi bi-check2-circle"></i>
                  <span>{t("commission.item1")}</span>
                </div>
                <div className="commission-item">
                  <i className="bi bi-check2-circle"></i>
                  <span>{t("commission.item2")}</span>
                </div>
                <div className="commission-item">
                  <i className="bi bi-check2-circle"></i>
                  <span>{t("commission.item3")}</span>
                </div>
                <div className="commission-item">
                  <i className="bi bi-check2-circle"></i>
                  <span>{t("commission.item4")}</span>
                </div>
              </div>
            </div>
            <div className="commission-visual">
              <div className="commission-percentage">
                <span className="percentage-number">40</span>
                <span className="percentage-symbol">%</span>
              </div>
              <p className="commission-tagline">{t("commission.tagline")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container mx-auto px-4">
          <div className="cta-content">
            <h2>{t("cta.title")}</h2>
            <p>{t("cta.description")}</p>
            <button
              className="btn-cta"
              onClick={handleApplyClick}
            >
              <i className="bi bi-rocket-takeoff"></i>
              {t("cta.button")}
            </button>
            <p className="cta-note">{t("cta.note")}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AffiliatePage;
