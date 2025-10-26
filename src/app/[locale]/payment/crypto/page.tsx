import React, { Suspense } from 'react';
import CryptoPaymentClient from '@/components/payment/CryptoPaymentClient';
import './crypto.css';

function CryptoPaymentLoadingFallback() {
    return (
        <div className="crypto-payment-page">
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading...</p>
            </div>
        </div>
    );
}

export default function CryptoPaymentPage() {
    return (
        <Suspense fallback={<CryptoPaymentLoadingFallback />}>
            <CryptoPaymentClient />
        </Suspense>
    );
}
