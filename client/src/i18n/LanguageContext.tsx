import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { translations, LanguageCode, Translations } from "./translations";
import { useUser, useUpdateUser } from "@/hooks/use-user";

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: keyof Translations, params?: Record<string, string | number>) => string;
  dir: "ltr" | "rtl";
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const { data: user } = useUser();
  const { mutate: updateUser } = useUpdateUser();

  const [language, setLanguageState] = useState<LanguageCode>(() => {
    const saved = localStorage.getItem("talkeasy_lang");
    if (saved && saved in translations) {
      return saved as LanguageCode;
    }
    return "English";
  });

  // Synchronize language with logged in user profile when user data loads
  useEffect(() => {
    if (user?.preferredLanguage && user.preferredLanguage in translations) {
      const userLang = user.preferredLanguage as LanguageCode;
      if (userLang !== language) {
        setLanguageState(userLang);
        localStorage.setItem("talkeasy_lang", userLang);
      }
    }
  }, [user?.preferredLanguage]);

  // Manage RTL/LTR document direction when language changes
  useEffect(() => {
    const isUrdu = language === "Urdu";
    const dir = isUrdu ? "rtl" : "ltr";
    document.documentElement.dir = dir;
    document.documentElement.lang = isUrdu ? "ur" : "en";
    if (isUrdu) {
      document.documentElement.classList.add("rtl");
    } else {
      document.documentElement.classList.remove("rtl");
    }
  }, [language]);

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    localStorage.setItem("talkeasy_lang", lang);

    // Save preference to database if user is logged in
    if (user) {
      updateUser({ preferredLanguage: lang });
    }
  };

  const t = (key: keyof Translations, params?: Record<string, string | number>): string => {
    const dict = translations[language] || translations.English;
    let val = dict[key] || translations.English[key] || String(key);
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        val = val.replace(`{${k}}`, String(v));
      });
    }
    return val;
  };

  const dir = language === "Urdu" ? "rtl" : "ltr";
  const isRTL = language === "Urdu";

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, dir, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useTranslation must be used within a LanguageProvider");
  }
  return context;
}
