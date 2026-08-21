import React, { useCallback, useEffect, useMemo, useState } from "react";
import useMultiLanguageTTS from "../../hooks/useTTS";
import { toast } from "sonner";
import { useTheme } from '@/theme/AppThemeProvider';
import { Translated } from "./translator/translator";

interface MultiLanguageTTSProps {
  text: string;
  defaultLanguage?: string;
  showTranslation?: boolean;
  compact?: boolean;
}

const MultiLanguageTTS: React.FC<MultiLanguageTTSProps> = ({

  text,
  defaultLanguage = "en",
  showTranslation = true,
  compact = false,
}) => {
  const {
    speak,
    speakTranslated,
    translateText,
    stop,
    isSpeaking,
    isTranslating,
    availableLanguages,
    currentLanguage,
  } = useMultiLanguageTTS();
  const { mode } = useTheme();
  const isDark = mode === 'dark';
  const [selectedLanguage, setSelectedLanguage] = useState<string>(defaultLanguage);
  const [translatedText, setTranslatedText] = useState<string>("");
  const [showTranslations, setShowTranslations] = useState<boolean>(false);
  const [cleanText, setCleanText] = useState<string>("");

  // Improved text cleaning function
  const extractPlainTextFromMarkdown = useCallback((markdown: string): string => {
    try {
      if (!markdown) return "";

      let cleanText = markdown;

      // Remove HTML tags first
      cleanText = cleanText.replace(/<[^>]*>/g, ' ');

      // Remove code blocks
      cleanText = cleanText.replace(/```[\s\S]*?```/g, ' ');

      // Remove inline code
      cleanText = cleanText.replace(/`([^`]+)`/g, '$1');

      // Remove images
      cleanText = cleanText.replace(/!\[(.*?)\]\(.*?\)/g, ' ');

      // Convert links
      cleanText = cleanText.replace(/\[(.*?)\]\(.*?\)/g, '$1');

      // Remove headers but keep content
      cleanText = cleanText.replace(/^#{1,6}\s+(.*?)$/gm, '$1 ');

      // Remove markdown formatting
      cleanText = cleanText.replace(/\*\*\*?([^*]+)\*\*\*?/g, '$1');
      cleanText = cleanText.replace(/\*\*([^*]+)\*\*/g, '$1');
      cleanText = cleanText.replace(/\*([^*]+)\*/g, '$1');
      cleanText = cleanText.replace(/__([^_]+)__/g, '$1');
      cleanText = cleanText.replace(/_([^_]+)_/g, '$1');

      // Remove strikethrough
      cleanText = cleanText.replace(/~~([^~]+)~~/g, '$1');

      // Handle blockquotes
      cleanText = cleanText.replace(/^\s*>\s*(.*?)$/gm, '$1 ');

      // Remove horizontal rules
      cleanText = cleanText.replace(/^[\s]*[-*_]{3,}[\s]*$/gm, ' ');

      // Handle lists
      cleanText = cleanText.replace(/^\s*[-*+]\s+(.*?)$/gm, '$1 ');
      cleanText = cleanText.replace(/^\s*\d+\.\s+(.*?)$/gm, '$1 ');

      // Clean up spaces
      cleanText = cleanText.replace(/\s+/g, ' ').trim();

      return cleanText;
    } catch (error) {
      console.error('Error cleaning text:', error);
      return text.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    }
  }, [text]);

  // Extract clean text
  useEffect(() => {
    if (text) {
      const extractedText = extractPlainTextFromMarkdown(text);
      setCleanText(extractedText);
      console.log('Clean text prepared:', extractedText.length, 'characters');
    }
  }, [text, extractPlainTextFromMarkdown]);

  const voiceSupportedLanguages = useMemo(
    () => availableLanguages.filter((lang) => lang.voiceSupport),
    [availableLanguages]
  );

  const handleSpeak = async (): Promise<void> => {
    if (!cleanText) {
      toast.error("No text available to speak");
      return;
    }

    const langConfig = availableLanguages.find(
      (l) => l.code === selectedLanguage
    );

    if (!langConfig) {
      toast.error("Language not found");
      return;
    }

    try {
      if (langConfig.voiceSupport) {
        if (selectedLanguage === "en") {
          speak(cleanText, selectedLanguage);
        } else {
          const success = await speakTranslated(cleanText, selectedLanguage);
          if (!success) {
            toast.warning(`Could not speak in ${langConfig.name}. Trying English instead.`);
            speak(cleanText, 'en');
          }
        }
      } else {
        const translation = await translateText(cleanText, selectedLanguage);
        if (translation) {
          setTranslatedText(translation);
          toast.info(`Voice not available for ${langConfig.name}. Translation ready.`);
        }
      }
    } catch (error) {
      toast.error(`Error: ${error}`);
    }
  };

  const handleQuickSpeak = async (langCode: string): Promise<void> => {
    if (!cleanText) {
      toast.error("No text available");
      return;
    }

    const langConfig = availableLanguages.find((l) => l.code === langCode);
    if (!langConfig) return;

    try {
      if (langConfig.voiceSupport) {
        if (langCode === "en") {
          speak(cleanText, langCode);
        } else {
          const success = await speakTranslated(cleanText, langCode);
          if (!success) {
            toast.warning(`Translation failed for ${langConfig.name}`);
          }
        }
      } else {
        const translation = await translateText(cleanText, langCode);
        if (translation) {
          setTranslatedText(translation);
          setSelectedLanguage(langCode);
          toast.info(`Translated to ${langConfig.name}`);
        }
      }
    } catch (error) {
      toast.error(`Quick speak error: ${error}`);
    }
  };



  if (compact) {
    return (
      <div className={`flex flex-wrap gap-2 items-center ${isDark ? 'text-gray-200' : ''}`}>
        <span className={`text-sm mr-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Listen:</span>
        {voiceSupportedLanguages.slice(0, 4).map((lang) => (
          <button
            key={lang.code}
            onClick={() => handleQuickSpeak(lang.code)}
            disabled={isSpeaking || isTranslating || !cleanText}
            className={`flex items-center px-3 py-1 rounded-full text-sm transition-colors ${isDark ? 'bg-blue-900 text-blue-200 hover:bg-blue-800' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'} disabled:opacity-50`}
            title={`Speak in ${lang.name}`}
          >
            <span className="mr-1">🔊</span>
            {lang.code.toUpperCase()}
          </button>
        ))}
        {isSpeaking && (
          <div className={`flex items-center text-xs ${isDark ? 'text-green-400' : 'text-green-600'}`}>
            <div className={`w-2 h-2 rounded-full animate-ping mr-1 ${isDark ? 'bg-green-400' : 'bg-green-500'}`}></div>
            Speaking...
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`rounded-lg p-4 shadow-sm border ${isDark ? 'bg-[#181c2a] border-[#232946] text-gray-100' : 'bg-white border-gray-200'}`}>
      <div className="mb-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className={`text-lg font-bold ${isDark ? 'text-blue-200' : 'text-gray-800'}`}>
            <Translated text="Multi-language TTS" />
          </h3>
          <div className="flex gap-1">
            {voiceSupportedLanguages.slice(0, 3).map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleQuickSpeak(lang.code)}
                disabled={isSpeaking || isTranslating || !cleanText}
                className={`flex items-center px-2 py-1 rounded text-xs disabled:opacity-50 ${isDark ? 'bg-blue-900 text-blue-200 hover:bg-blue-800' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}
                title={`Speak in ${lang.name}`}
              >
                <span className="mr-1">🔊</span>
                {lang.code.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
        <div className={`text-xs mb-2 ${isDark ? 'text-blue-300' : 'text-blue-600'}`}>
          <span className="font-medium"><Translated text="Ready:" /></span> {cleanText?.length || 0} <Translated text="characters" />
        </div>
      </div>

      <div className="mb-4">
        <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-blue-200' : 'text-gray-700'}`}><Translated text="Select Language:" /></label>
        <div className="flex flex-wrap gap-2 items-center justify-between">
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className={`flex-1 p-2 rounded-md focus:ring-2 focus:ring-blue-500 ${isDark ? 'bg-[#232946] border-[#232946] text-blue-100' : 'border border-gray-300'}`}
            disabled={isSpeaking || !cleanText}
          >
            {availableLanguages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name} {lang.voiceSupport ? '🔊' : '📝'}
              </option>
            ))}
          </select>
          <div className="flex items-center gap-2 my-2 lg:my-0">
            <button
              onClick={handleSpeak}
              disabled={isSpeaking || isTranslating || !cleanText}
              className={`flex items-center px-4 py-2 min-w-30 justify-center rounded-md transition-colors ${isDark ? 'bg-green-700 text-white hover:bg-green-600 disabled:bg-gray-700' : 'bg-green-600 text-white hover:bg-green-700 disabled:bg-gray-400'}`}
            >
              {isTranslating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  <Translated text="Translating..." />
                </>
              ) : isSpeaking ? (
                <Translated text="Speaking..." />
              ) : (
                <Translated text="Speak" />
              )}
            </button>
            <button
              onClick={stop}
              disabled={!isSpeaking}
              className={`px-3 py-2 rounded-md transition-colors ${isDark ? 'bg-red-700 text-white hover:bg-red-600 disabled:bg-gray-700' : 'bg-red-500 text-white hover:bg-red-600 disabled:bg-gray-300'}`}
              title="Stop"
            >
              ⏹️
            </button>
          </div>
        </div>
      </div>

      {translatedText && showTranslation && (
        <div className={`mb-4 p-3 rounded-lg border ${isDark ? 'bg-blue-900/30 border-blue-900 text-blue-100' : 'bg-blue-50 border-blue-200'}`}>
          <h4 className={`font-medium mb-2 ${isDark ? 'text-blue-200' : 'text-blue-800'}`}><Translated text="Translation:" /></h4>
          <p className={isDark ? 'text-blue-100' : 'text-blue-900'}>{translatedText}</p>
        </div>
      )}

      <div className="mt-4">
        <div className="flex justify-between items-center mb-3">
          <h4 className={`font-medium ${isDark ? 'text-blue-200' : 'text-gray-700'}`}><Translated text="Quick Speech:" /></h4>
          <button
            onClick={() => setShowTranslations(!showTranslations)}
            className={`text-sm ${isDark ? 'text-yellow-300 hover:text-yellow-200' : 'text-blue-600 hover:text-blue-800'}`}
          >
            {showTranslations ? <Translated text="Hide" /> : <Translated text="Show" />} <Translated text="All" />
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {voiceSupportedLanguages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleQuickSpeak(lang.code)}
              disabled={isSpeaking || isTranslating || !cleanText}
              className={`p-2 text-sm rounded-md text-left disabled:opacity-50 border ${isDark ? 'bg-blue-900/30 border-blue-900 text-blue-100 hover:bg-blue-900/60' : 'bg-green-50 border-green-200 text-green-900 hover:bg-green-100'}`}
            >
              <div className={isDark ? 'font-medium text-blue-100' : 'font-medium text-green-900'}>
                {lang.name}
              </div>
              <div className={isDark ? 'text-xs text-blue-200' : 'text-xs text-green-700'}>{lang.nativeName}</div>
            </button>
          ))}
        </div>
      </div>

      <div className={`text-sm mt-3 ${isDark ? 'text-blue-200' : 'text-gray-600'}`}>
        {isSpeaking && (
          <div className={`flex items-center ${isDark ? 'text-green-400' : 'text-green-600'}`}>
            <div className={`w-2 h-2 rounded-full animate-ping mr-2 ${isDark ? 'bg-green-400' : 'bg-green-500'}`}></div>
            Speaking in {currentLanguage.toUpperCase()}
          </div>
        )}
      </div>
    </div>
  );
};

export default MultiLanguageTTS;