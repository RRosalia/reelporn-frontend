'use client';

import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';

/**
 * Example component showing how to link to the crypto payment page
 * with localized URLs
 *
 * URLs will be automatically translated:
 * - English: /payment/crypto
 * - Dutch: /betaling/crypto
 * - German: /zahlung/krypto
 * - French: /paiement/crypto
 */

interface CryptoPaymentLinkProps {
  planId?: string;
  children?: React.ReactNode;
  className?: string;
}

export default function CryptoPaymentLink({
  planId,
  children,
  className = ''
}: CryptoPaymentLinkProps) {
  const t = useTranslations();

  const href = planId
    ? { pathname: '/payment/crypto' as const, query: { plan: planId } }
    : '/payment/crypto' as const;

  return (
    <Link href={href} className={className}>
      {children || t('payment.cryptoPayment')}
    </Link>
  );
}

// Example usage in other components:
//
// import CryptoPaymentLink from '@/components/payment/CryptoPaymentLink';
//
// <CryptoPaymentLink planId="premium-monthly">
//   Pay with Crypto
// </CryptoPaymentLink>
//
// Or with custom styling:
// <CryptoPaymentLink
//   planId="premium-monthly"
//   className="btn btn-primary"
// >
//   <i className="bi bi-currency-bitcoin"></i>
//   Crypto Payment
// </CryptoPaymentLink>
