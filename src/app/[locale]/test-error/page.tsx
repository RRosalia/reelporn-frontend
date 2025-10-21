'use client';

import { useState, useEffect } from 'react';
import { notFound } from 'next/navigation';

export default function TestErrorPage() {
    const [errorType, setErrorType] = useState<string | null>(null);

    // Redirect to 404 in production
    useEffect(() => {
        if (process.env.NODE_ENV === 'production') {
            notFound();
        }
    }, []);

    // Don't render anything in production
    if (process.env.NODE_ENV === 'production') {
        return null;
    }

    if (errorType) {
        // Throw error with specific message to test different error types
        throw new Error(errorType);
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
                {/* Development Only Banner */}
                <div className="mb-6 px-4 py-3 bg-yellow-100 border-l-4 border-yellow-500 rounded">
                    <div className="flex items-center">
                        <i className="bi bi-exclamation-triangle-fill text-yellow-500 mr-2"></i>
                        <p className="text-sm font-semibold text-yellow-700">
                            Development Only - Not accessible in production
                        </p>
                    </div>
                </div>

                <h1 className="text-3xl font-bold mb-6 text-gray-900">
                    Test Error Pages
                </h1>
                <p className="text-gray-600 mb-6">
                    Click any button below to trigger different error types and see how the error page handles them:
                </p>

                <div className="space-y-3">
                    <button
                        onClick={() => setErrorType('500 Internal Server Error')}
                        className="w-full px-6 py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors"
                    >
                        Test 500 Error
                    </button>

                    <button
                        onClick={() => setErrorType('503 Service Unavailable')}
                        className="w-full px-6 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors"
                    >
                        Test 503 Error
                    </button>

                    <button
                        onClick={() => setErrorType('403 Forbidden Access')}
                        className="w-full px-6 py-3 bg-yellow-500 text-white rounded-lg font-semibold hover:bg-yellow-600 transition-colors"
                    >
                        Test 403 Error
                    </button>

                    <button
                        onClick={() => setErrorType('Generic error occurred')}
                        className="w-full px-6 py-3 bg-gray-500 text-white rounded-lg font-semibold hover:bg-gray-600 transition-colors"
                    >
                        Test Generic Error
                    </button>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200">
                    <p className="text-sm text-gray-500 mb-3">
                        <strong>Note:</strong> In development mode, Next.js shows the error overlay first. Click the X to close it and see the custom error page.
                    </p>
                    <p className="text-sm text-gray-500">
                        For 404 errors, visit: <code className="bg-gray-100 px-2 py-1 rounded">http://localhost:5173/non-existent-page</code>
                    </p>
                </div>
            </div>
        </div>
    );
}
