// context/TranslateContext.tsx
import { ReactNode } from 'react';
import useTranslateWithAtom from '../action/translate';
import { TranslateContext } from './translaterContext';

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
