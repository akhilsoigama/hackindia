// hooks/useTranslateWithAtom.ts
import { useAtom } from 'jotai';
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { languageAtom } from '../layouts/header-section/lenguage-selector';

const useTranslateWithAtom = () => {
    const [currentLanguage, setCurrentLanguage] = useAtom(languageAtom);
    const [isTranslating, setIsTranslating] = useState(false);

    // Function declarations
    async function translateWithGoogle(text: string, targetLang: string): Promise<string | null> {
        try {
            const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`);
            if(res.ok){
                const data = await res.json();
                return data[0]?.[0]?.[0] || null;
            }
            return null;
        } catch { return null; }
    }

    async function translateWithLibre(text: string, targetLang: string): Promise<string | null> {
        try {
            const res = await fetch('https://libretranslate.com/translate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ q: text, source: 'auto', target: targetLang, format: 'text' })
            });
            if(res.ok){
                const data = await res.json();
                return data.translatedText || null;
            }
            return null;
        } catch { return null; }
    }

    async function translateWithMyMemory(text: string, targetLang: string): Promise<string | null> {
        try {
            const res = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=auto|${targetLang}`);
            if(res.ok){
                const data = await res.json();
                return data.responseData?.translatedText || null;
            }
            return null;
        } catch { return null; }
    }

    const translateText = useCallback(async (text: string, targetLang?: string): Promise<string | null> => {
        if (!text.trim()) return null;
        setIsTranslating(true);
        const lang = targetLang || currentLanguage; // default to atom language
        try {
            const translationProviders = [translateWithGoogle, translateWithLibre, translateWithMyMemory];
            for (const provider of translationProviders) {
                const translated = await provider(text, lang);
                if (translated) return translated;
            }
            return text;
        } catch (err) {
            toast.error(`Translation failed: ${err}`);
            return text;
        } finally {
            setIsTranslating(false);
        }
    }, [currentLanguage]);

    return { translateText, isTranslating, currentLanguage, setCurrentLanguage };
};

export default useTranslateWithAtom;
