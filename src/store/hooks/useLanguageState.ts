import { useAtom } from 'jotai';
import { useAtomValue } from 'jotai';
import { languageAtom, languageCodeAtom, type SupportedLanguage } from '../atoms/language.atoms';

export const useLanguageState = () => {
  const [language, setLanguage] = useAtom(languageAtom);
  return {
    language,
    setLanguage,
  };
};

export const useLanguageCode = (): SupportedLanguage => useAtomValue(languageCodeAtom);
