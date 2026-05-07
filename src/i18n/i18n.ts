import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import translationEN from "./locales/en/translation.json";
import translationAR from "./locales/ar/translation.json";

// The translations
const resources = {
  en: {
    translation: translationEN,
  },
  ar: {
    translation: translationAR,
  },
};

i18n
  // Detects user language
  .use(LanguageDetector)
  // Passes i18n down to react-i18next
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    // We can allow users to change language and it will be saved in localStorage automatically
    // by the LanguageDetector plugin.
    
    interpolation: {
      escapeValue: false, // React already safes from xss
    },
  });

// Handle document direction and lang attribute automatically
i18n.on('languageChanged', (lng) => {
  document.documentElement.lang = lng;
  document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
});

// Set initial direction based on detected or default language
document.documentElement.lang = i18n.language || "en";
document.documentElement.dir = i18n.language === "ar" ? "rtl" : "ltr";

export default i18n;
