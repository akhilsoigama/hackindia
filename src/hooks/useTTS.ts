// hooks/useMultiLanguageTTS.ts
import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';

interface LanguageConfig {
    code: string;
    rate: number;
    name: string;
    nativeName: string;
    voiceSupport: boolean; 
}

interface TTSHookReturn {
    speak: (text: string, language?: string, customRate?: number) => boolean;
    speakTranslated: (text: string, targetLanguage: string) => Promise<boolean>;
    translateText: (text: string, targetLanguage: string) => Promise<string | null>;
    stop: () => void;
    isSpeaking: boolean;
    isTranslating: boolean;
    isSupported: boolean;
    availableLanguages: LanguageConfig[];
    supportedLanguages: LanguageConfig[];
    currentLanguage: string;
}

const useMultiLanguageTTS = (): TTSHookReturn => {
    const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
    const [isTranslating, setIsTranslating] = useState<boolean>(false);
    const [isSupported, setIsSupported] = useState<boolean>(false);
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
    const [currentLanguage, setCurrentLanguage] = useState<string>('en');

    const availableLanguages: LanguageConfig[] = [
        { code: 'en', rate: 0.9, name: 'English', nativeName: 'English', voiceSupport: true },
        { code: 'hi', rate: 0.9, name: 'Hindi', nativeName: 'हिन्दी', voiceSupport: true },
        { code: 'pa', rate: 0.9, name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', voiceSupport: true },
       
    ];
    useEffect(() => {
        const initTTS = (): void => {
            const supported = 'speechSynthesis' in window;
            setIsSupported(supported);

            if (supported) {
                loadVoices();
            }
        };

        const loadVoices = (): void => {
            const load = () => {
                const availableVoices = window.speechSynthesis.getVoices();
                setVoices(availableVoices);
                updateLanguageSupport(availableVoices);
            };
            load();
            window.speechSynthesis.onvoiceschanged = load;
        };

        const updateLanguageSupport = (availableVoices: SpeechSynthesisVoice[]): void => {
            availableLanguages.forEach(lang => {
                const hasVoice = availableVoices.some(voice =>
                    voice.lang.startsWith(lang.code) ||
                    voice.lang.includes(lang.code)
                );
                lang.voiceSupport = hasVoice;
            });
        };

        initTTS();
    }, []);

    const supportedLanguages = availableLanguages.filter(lang => lang.voiceSupport);

    const getVoiceForLanguage = useCallback((language: string): SpeechSynthesisVoice | null => {
        const langConfig = availableLanguages.find(l => l.code === language);
        if (!langConfig) return null;

        let voice = voices.find(v => v.lang === langConfig.code + '-IN');

        if (!voice) {
            voice = voices.find(v => v.lang.startsWith(language));
        }

        if (!voice) {
            voice = voices.find(v => v.lang.includes('IN'));
        }

        if (!voice) {
            voice = voices.find(v => v.lang.startsWith('en'));
        }

        return voice || null;
    }, [voices]);

    const translateText = useCallback(async (text: string, targetLanguage: string): Promise<string | null> => {
        if (!text.trim()) return null;

        setIsTranslating(true);

        try {
            const translationProviders = [translateWithGoogle, translateWithLibre, translateWithMyMemory];
            for (const provider of translationProviders) {
                const translatedText = await provider(text, targetLanguage);
                if (translatedText) return translatedText;
            }
            return text; // Return original text if all providers fail
        } catch (error) {
            toast.error(`Translation failed:, ${error}`);
            return text; 
        } finally {
            setIsTranslating(false);
        }
    }, []);

    const translateWithGoogle = async (text: string, targetLang: string): Promise<string | null> => {
        try {
            const response = await fetch(
                `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`
            );

            if (response.ok) {
                const data = await response.json();
                return data[0]?.[0]?.[0] || null;
            }
            return null;
        } catch {
            return null;
        }
    };

    const translateWithLibre = async (text: string, targetLang: string): Promise<string | null> => {
        try {
            const response = await fetch(`https://libretranslate.com/translate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    q: text,
                    source: 'auto',
                    target: targetLang,
                    format: 'text'
                })
            });

            if (response.ok) {
                const data = await response.json();
                return data.translatedText || null;
            }
            return null;
        } catch {
            return null;
        }
    };

    const translateWithMyMemory = async (text: string, targetLang: string): Promise<string | null> => {
        try {
            const response = await fetch(
                `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=auto|${targetLang}`
            );

            if (response.ok) {
                const data = await response.json();
                return data.responseData?.translatedText || null;
            }
            return null;
        } catch {
            return null;
        }
    };
    const stop = useCallback((): void => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
        }
    }, []);
    const speak = useCallback((text: string, language: string = 'en', customRate: number | null = null): boolean => {
        if (!isSupported) {
            toast.warning('TTS not supported');
            return false;
        }

        if (!text.trim()) {
            toast.warning('No text provided');
            return false;
        }

        try {
            stop(); 

            const langConfig = availableLanguages.find(l => l.code === language) || availableLanguages[0];
            const utterance = new SpeechSynthesisUtterance(text.trim());

            utterance.lang = langConfig.code + '-IN';
            utterance.rate = customRate || langConfig.rate;
            utterance.pitch = 1;
            utterance.volume = 1;

            const voice = getVoiceForLanguage(language);
            if (voice) {
                utterance.voice = voice;
            } else {
                toast.warning(`No voice found for ${language}, using default`);
            }

            utterance.onstart = () => {
                setIsSpeaking(true);
                setCurrentLanguage(language);
            };

            utterance.onend = () => {
                setIsSpeaking(false);
            };

            utterance.onerror = (event) => {
                toast.error(event.error)
                setIsSpeaking(false);
            };

            window.speechSynthesis.speak(utterance);
            return true;
        } catch (error) {
            toast.error(`Speak error:, ${error}`);
            return false;
        }
    }, [isSupported, getVoiceForLanguage, stop]);

    const speakTranslated = useCallback(async (text: string, targetLanguage: string): Promise<boolean> => {
        if (!isSupported || !text.trim()) return false;

        try {
            const translatedText = await translateText(text, targetLanguage);

            if (translatedText) {
                return speak(translatedText, targetLanguage);
            }

            return false;
        } catch (error) {
            toast.error(`Speak translated error:, ${error}`);
            return false;
        }
    }, [isSupported, translateText, speak]);



    return {
        speak,
        speakTranslated,
        translateText,
        stop,
        isSpeaking,
        isTranslating,
        isSupported,
        availableLanguages,
        supportedLanguages,
        currentLanguage
    };
};

export default useMultiLanguageTTS;