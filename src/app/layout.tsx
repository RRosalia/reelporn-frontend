import type { Metadata } from "next";
import { ReactNode } from "react";
import "./globals.css";
import "bootstrap-icons/font/bootstrap-icons.css";

export const metadata: Metadata = {
  title: "ReelPorn - Premium Adult Content",
  description: "Watch premium adult content in high quality",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var path = window.location.pathname;
                  var isExcluded = path.includes('/blocked') ||
                                   path.includes('/error-codes/') ||
                                   path.includes('/parental-controls');

                  if (!isExcluded) {
                    var verified = localStorage.getItem('ageVerified');
                    var blocked = localStorage.getItem('ageBlocked');

                    if (blocked === 'true') {
                      // Add class to hide content during redirect
                      document.documentElement.classList.add('age-verification-pending');
                      window.location.href = '/blocked';
                    } else if (verified !== 'true') {
                      document.documentElement.classList.add('age-verification-pending');
                    }
                  }
                } catch (e) {
                  console.error('Age verification check error:', e);
                }
              })();
            `,
          }}
        />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
