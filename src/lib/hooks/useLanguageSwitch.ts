import { useRouter, usePathname } from '@/i18n/routing';
import { useParams } from 'next/navigation';

/**
 * Custom hook for switching languages/locales
 * Properly handles dynamic routes with params
 *
 * @returns A function to switch to a new locale
 *
 * @example
 * const switchLanguage = useLanguageSwitch();
 * switchLanguage('de'); // Switch to German
 */
export function useLanguageSwitch() {
    const router = useRouter();
    const pathname = usePathname();
    const params = useParams();

    const switchLanguage = (newLocale: string) => {
        // Use router.replace with pathname and params for proper locale switching
        // This is required when using pathnames in next-intl routing config
        // See: https://next-intl.dev/docs/routing/navigation
        router.replace(
            { pathname, params } as any,
            { locale: newLocale }
        );
    };

    return switchLanguage;
}
