import { memo, useEffect, useRef, useState } from "react";
import useTranslateWithAtom from "../../../action/translate";


export const Translated = memo(({ text }: { text: string | null }) => {
  const { translateText, currentLanguage } = useTranslateWithAtom();
  const [translated, setTranslated] = useState<string | null>(text);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    let mounted = true;

    const doTranslate = async () => {
      if (!text?.trim()) return;

      const cacheKey = `${currentLanguage}_${text}`;
      const cached = sessionStorage.getItem(cacheKey);

      if (cached && mounted) {
        setTranslated(cached);
        return;
      }

      const result = await translateText(text);
      if (mounted && result) {
        setTranslated(result);
        sessionStorage.setItem(cacheKey, result);
      }
    };

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(doTranslate, 50);

    return () => {
      mounted = false;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [text, currentLanguage, translateText]);

  return <span translate="no">{translated}</span>;
});

Translated.displayName = 'Translated';
