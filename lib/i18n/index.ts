import en from './en';
import hi from './hi';
import pa from './pa';

const translations = {
  en,
  hi,
  pa,
};

type Locale = 'en' | 'hi' | 'pa';

export function getLocale(language: string): Locale {
  if (language === 'hi') return 'hi';
  if (language === 'pa') return 'pa';
  return 'en';
}

export function t(language: string) {
  const locale = getLocale(language);
  return translations[locale] || translations.en;
}
