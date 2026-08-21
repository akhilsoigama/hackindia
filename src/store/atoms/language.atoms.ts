import { atomWithStorage, selectAtom } from 'jotai/utils';

export type SupportedLanguage = 'en' | 'hi' | 'gu' | 'pa';

export const languageAtom = atomWithStorage<SupportedLanguage>('lms:language', 'en');

export const languageCodeAtom = selectAtom(languageAtom, (language) => language);

export const isHindiAtom = selectAtom(languageAtom, (language) => language === 'hi');
