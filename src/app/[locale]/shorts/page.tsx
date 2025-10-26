import React, { Suspense } from 'react';
import ShortsPageClient from '@/components/shorts/ShortsPageClient';

function ShortsLoadingFallback() {
    return (
        <div style={{ background: '#000', minHeight: '100vh' }} className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500" role="status">
                <span className="sr-only">Loading...</span>
            </div>
        </div>
    );
}

export default function ShortsPage() {
    return (
        <Suspense fallback={<ShortsLoadingFallback />}>
            <ShortsPageClient />
        </Suspense>
    );
}
