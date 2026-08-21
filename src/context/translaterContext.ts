import { createContext, useContext } from 'react';

export interface TranslateContextType {
    translate: (text: string) => Promise<string>;
    currentLanguage: string;
}

export const TranslateContext = createContext<TranslateContextType | null>(null);

export const useTranslate = () => {
    const ctx = useContext(TranslateContext);
    if (!ctx) throw new Error('useTranslate must be used inside TranslateProvider');
    return ctx;
};