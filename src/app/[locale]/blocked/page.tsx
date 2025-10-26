import React, { Suspense } from 'react';
import BlockedPageClient from '@/components/blocked/BlockedPageClient';
import './styles.css';

function BlockedLoadingFallback() {
    return (
        <div className="blocked-page">
            <div className="blocked-content">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
            </div>
        </div>
    );
}

export default function BlockedPage() {
    return (
        <Suspense fallback={<BlockedLoadingFallback />}>
            <BlockedPageClient />
        </Suspense>
    );
}
