// context/TranslateContext.tsx
import { createContext, useContext, ReactNode } from 'react';
import useTranslateWithAtom from '../action/translate';

interface TranslateContextType {
  translate: (text: string) => Promise<string>;
  currentLanguage: string;
}

const TranslateContext = createContext<TranslateContextType | null>(null);

export const TranslateProvider = ({ children }: { children: ReactNode }) => {
  const { translateText, currentLanguage } = useTranslateWithAtom();

  const translate = async (text: string) => {
    if (!text) return '';
    try {
      const translated = await translateText(text);
      return translated || text;
    } catch {
      return text;
    }
  };

  return (
    <TranslateContext.Provider value={{ translate, currentLanguage }}>
      {children}
    </TranslateContext.Provider>
  );
};

export const useTranslate = () => {
  const ctx = useContext(TranslateContext);
  if (!ctx) throw new Error('useTranslate must be used inside TranslateProvider');
  return ctx;
};
