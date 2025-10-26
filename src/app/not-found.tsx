'use client';

import Link from 'next/link';

// Root not-found page must include <html> and <body> tags
// since the root layout only returns children for i18n routing
export default function NotFound() {
  return (
    <html lang="en">
      <head>
        <title>404 - Page Not Found | ReelPorn</title>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" />
      </head>
      <body style={{ margin: 0, padding: 0, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #1a1626 0%, #2b2838 100%)',
          position: 'relative',
          padding: '20px'
        }}>
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

          <div style={{
            position: 'relative',
            zIndex: 10,
            textAlign: 'center',
            maxWidth: '600px'
          }}>
            {/* Icon decoration */}
            <div style={{ marginBottom: '2rem' }}>
              <i className="bi bi-exclamation-triangle" style={{
                fontSize: '5rem',
                background: 'linear-gradient(135deg, #c2338a 0%, #f8c537 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}></i>
            </div>

            {/* 404 Number */}
            <h1 style={{
              fontSize: 'clamp(6rem, 15vw, 10rem)',
              fontWeight: 'bold',
              margin: '0 0 1rem 0',
              background: 'linear-gradient(135deg, #c2338a 0%, #f8c537 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              lineHeight: 1
            }}>
              404
            </h1>

            {/* Title */}
            <h2 style={{
              fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
              fontWeight: 'bold',
              color: '#fff',
              margin: '0 0 1rem 0'
            }}>
              Oops! Page Not Found
            </h2>

            {/* Message */}
            <p style={{
              fontSize: 'clamp(1rem, 2vw, 1.125rem)',
              color: 'rgba(255, 255, 255, 0.7)',
              marginBottom: '2.5rem',
              lineHeight: 1.6
            }}>
              The page you're looking for doesn't exist. Head back to our homepage to continue exploring our site.
            </p>

            {/* Button */}
            <Link
              href="/"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '1rem 2.5rem',
                fontSize: '1.125rem',
                fontWeight: 'bold',
                color: '#fff',
                textDecoration: 'none',
                background: 'linear-gradient(135deg, #c2338a 0%, #e74c3c 100%)',
                borderRadius: '9999px',
                boxShadow: '0 4px 15px rgba(194, 51, 138, 0.4)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                border: 'none',
                cursor: 'pointer'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(194, 51, 138, 0.6)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(194, 51, 138, 0.4)';
              }}
            >
              <i className="bi bi-house-door"></i>
              Go to Home page
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
