import React, { Suspense } from 'react';
import LoginForm from '@/components/auth/LoginForm';

function LoginLoadingFallback() {
    return (
        <div style={{ background: '#2b2838', minHeight: '100vh' }} className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500" role="status">
                <span className="sr-only">Loading...</span>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<LoginLoadingFallback />}>
            <LoginForm />
        </Suspense>
    );
}
