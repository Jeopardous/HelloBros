import i18next from 'i18next';
import {initReactI18next} from 'react-i18next';
import en from '../locales/en.json';
import hindi from '../locales/hindi.json';

const resources = {
  en: {translation: en},
  hindi: {translation: hindi},
};
i18next.use(initReactI18next).init({
  compatibilityJSON: 'v3',
  resources,
  lng: 'en',
  fallbackLng: 'en',
});

export default i18next;
