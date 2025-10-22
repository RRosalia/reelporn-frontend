import { routing } from './routing';

export interface Language {
  code: string;
  name: string;
  flag: string;
}

export const languages: Language[] = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'pl', name: 'Polski', flag: '🇵🇱' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'sv', name: 'Svenska', flag: '🇸🇪' },
  { code: 'cs', name: 'Čeština', flag: '🇨🇿' },
];

// Validate that all languages match the routing config
const routingLocales = new Set(routing.locales as readonly string[]);
const languageCodes = new Set(languages.map(l => l.code));

if (languageCodes.size !== routingLocales.size ||
    ![...languageCodes].every(code => routingLocales.has(code))) {
  console.warn('Language configuration mismatch with routing locales');
}
