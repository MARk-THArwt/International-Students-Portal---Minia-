import { useTranslation } from "react-i18next";

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "ar" : "en";
    i18n.changeLanguage(newLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center justify-center w-10 h-10 rounded-full border border-original-border hover:bg-original-background-alt transition-colors bg-original-card text-original-text font-semibold text-sm focus:outline-none"
      title="Change Language"
    >
      {i18n.language === "en" ? "AR" : "EN"}
    </button>
  );
}
