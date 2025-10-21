import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';

export default async function NotFound() {
    const t = await getTranslations('error');

    return (
        <div
            className="flex items-center justify-center px-4 py-12"
            style={{
                background: 'linear-gradient(135deg, #1a1626 0%, #2b2838 100%)',
                position: 'relative'
            }}
        >
            {/* Background pattern */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                opacity: 0.05,
                backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 35px, #fff 35px, #fff 70px)'
            }}></div>

            <div className="relative z-10 text-center max-w-2xl mx-auto">
                {/* 404 Number */}
                <div className="mb-4">
                    <h1
                        className="text-8xl md:text-9xl font-bold mb-2"
                        style={{
                            background: 'linear-gradient(135deg, #c2338a 0%, #f8c537 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            lineHeight: '1'
                        }}
                    >
                        404
                    </h1>
                </div>

                {/* Icon */}
                <div className="mb-4">
                    <i
                        className="bi bi-search text-4xl md:text-5xl"
                        style={{
                            color: '#f8c537',
                            opacity: 0.8
                        }}
                    ></i>
                </div>

                {/* Title */}
                <h2
                    className="text-2xl md:text-3xl font-bold mb-3 text-white"
                >
                    {t('404.title')}
                </h2>

                {/* Message */}
                <p
                    className="text-base md:text-lg mb-6"
                    style={{ color: 'rgba(255, 255, 255, 0.7)' }}
                >
                    {t('404.message')}
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Link
                        href="/"
                        className="inline-flex items-center px-8 py-3 text-lg font-bold text-white rounded-full transition-all duration-300"
                        style={{
                            background: 'linear-gradient(135deg, #c2338a 0%, #e74c3c 100%)',
                            boxShadow: '0 4px 15px rgba(194, 51, 138, 0.4)'
                        }}
                    >
                        <i className="bi bi-house-door mr-2"></i>
                        {t('goHome')}
                    </Link>

                    <Link
                        href="/categories"
                        className="inline-flex items-center px-8 py-3 text-lg font-bold text-white border-2 border-white rounded-full transition-all duration-300 hover:bg-white hover:text-gray-900"
                    >
                        <i className="bi bi-grid mr-2"></i>
                        Browse Categories
                    </Link>
                </div>

                {/* Decorative elements - hidden on small screens */}
                <div className="mt-8 hidden md:grid grid-cols-3 gap-4 max-w-md mx-auto">
                    <div
                        className="p-3 rounded-xl text-center"
                        style={{
                            background: 'rgba(194, 51, 138, 0.1)',
                            border: '1px solid rgba(194, 51, 138, 0.2)'
                        }}
                    >
                        <i className="bi bi-film text-2xl" style={{ color: '#f8c537' }}></i>
                        <p className="text-white text-xs mt-1">10K+ Videos</p>
                    </div>
                    <div
                        className="p-3 rounded-xl text-center"
                        style={{
                            background: 'rgba(194, 51, 138, 0.1)',
                            border: '1px solid rgba(194, 51, 138, 0.2)'
                        }}
                    >
                        <i className="bi bi-people text-2xl" style={{ color: '#f8c537' }}></i>
                        <p className="text-white text-xs mt-1">50K+ Users</p>
                    </div>
                    <div
                        className="p-3 rounded-xl text-center"
                        style={{
                            background: 'rgba(194, 51, 138, 0.1)',
                            border: '1px solid rgba(194, 51, 138, 0.2)'
                        }}
                    >
                        <i className="bi bi-star text-2xl" style={{ color: '#f8c537' }}></i>
                        <p className="text-white text-xs mt-1">Premium</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
