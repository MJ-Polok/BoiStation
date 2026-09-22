import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { bn } from './bn';
import { en } from './en';

export const languages = ['bn', 'en'] as const;
export type AppLanguage = (typeof languages)[number];

const languageStorageKey = 'boi-station-language';

const getInitialLanguage = (): AppLanguage => {
  if (typeof window === 'undefined') return 'bn';

  const savedLanguage = window.localStorage.getItem(languageStorageKey);
  return savedLanguage === 'en' || savedLanguage === 'bn' ? savedLanguage : 'bn';
};

export const persistLanguage = (language: AppLanguage) => {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(languageStorageKey, language);
  }
  document.documentElement.lang = language;
};

i18n.use(initReactI18next).init({
  resources: {
    bn: { translation: bn },
    en: { translation: en },
  },
  lng: getInitialLanguage(),
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

persistLanguage(i18n.language as AppLanguage);

i18n.on('languageChanged', (language) => {
  if (language === 'bn' || language === 'en') {
    persistLanguage(language);
  }
});

export default i18n;