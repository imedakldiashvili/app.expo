import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { kaGE } from './locales/ka-ge';
import { enUK } from './locales/en-uk';
import { esES } from './locales/es-es';

export type Language = 'ka-ge' | 'en-uk' | 'es-es';

// Use one base locale (kaGE) as the typing source to avoid strict intersection issues
// when other locale files are temporarily missing some keys.
export type TranslationKeys = typeof kaGE;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => Promise<void>;
  // Use a relaxed type for t to avoid TS "never" issues when locale files diverge slightly.
  t: TranslationKeys | any;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  'ka-ge': kaGE,
  'en-uk': enUK,
  'es-es': esES,
};

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguageState] = useState<Language>('ka-ge');

  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    try {
      // For now, we'll use default language
      // In the future, you can add AsyncStorage back
      setLanguageState('ka-ge');
    } catch (error) {
      console.error('Failed to load language:', error);
    }
  };

  const setLanguage = async (lang: Language) => {
    try {
      setLanguageState(lang);
      // In the future, you can add AsyncStorage back
      // await AsyncStorage.setItem('language', lang);
    } catch (error) {
      console.error('Failed to save language:', error);
    }
  };

  const value: LanguageContextType = {
    language,
    setLanguage,
    t: translations[language],
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
}
