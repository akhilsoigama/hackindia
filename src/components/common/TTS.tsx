import React, { useMemo, useState } from "react";
import useMultiLanguageTTS from "../../hooks/useTTS";
import { toast } from "sonner";

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

  const [selectedLanguage, setSelectedLanguage] =
    useState<string>(defaultLanguage);
  const [translatedText, setTranslatedText] = useState<string>("");
  const [showTranslations, setShowTranslations] = useState<boolean>(false);

  const voiceSupportedLanguages = useMemo(
    () => availableLanguages.filter((lang) => lang.voiceSupport),
    [availableLanguages]
  );
  const translationOnlyLanguages = useMemo(
    () => availableLanguages.filter((lang) => !lang.voiceSupport),
    [availableLanguages]
  );

  const handleSpeak = async (): Promise<void> => {
    const langConfig = availableLanguages.find(
      (l) => l.code === selectedLanguage
    );

    if (!langConfig) {
      console.error("Language not found:", selectedLanguage);
      return;
    }

    if (langConfig.voiceSupport) {
      if (selectedLanguage === "en") {
        speak(text, selectedLanguage);
      } else {
        await speakTranslated(text, selectedLanguage);
      }
    } else {
      const translation = await translateText(text, selectedLanguage);
      if (translation) {
        setTranslatedText(translation);
        toast.info(
          `Voice not available for ${langConfig.name}. Translation: ${translation}`
        );
      }
    }
  };

  const handleQuickSpeak = async (langCode: string): Promise<void> => {
    const langConfig = availableLanguages.find((l) => l.code === langCode);
    if (!langConfig) return;

    if (langConfig.voiceSupport) {
      if (langCode === "en") {
        speak(text, langCode); 
      } else {
        await speakTranslated(text, langCode); 
      }
    } else {
      const translation = await translateText(text, langCode);
      if (translation) {
        setTranslatedText(translation);
        setSelectedLanguage(langCode);
      }
    }
  };


  const handleShowTranslation = async (langCode: string): Promise<void> => {
    const translation = await translateText(text, langCode);
    if (translation) {
      setTranslatedText(translation);
      setSelectedLanguage(langCode);
    }
  };

  const getLanguageDisplay = (langCode: string): string => {
    const lang = availableLanguages.find((l) => l.code === langCode);
    if (!lang) return langCode;

    return lang.voiceSupport
      ? `${lang.name} (${lang.nativeName}) 🔊`
      : `${lang.name} (${lang.nativeName}) 📝`;
  };

  if (compact) {
    return (
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-sm text-gray-600 mr-2">Listen:</span>
        {voiceSupportedLanguages.slice(0, 4).map((lang) => (
          <button
            key={lang.code}
            onClick={() => handleQuickSpeak(lang.code)}
            disabled={isSpeaking || isTranslating}
            className="flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200 disabled:opacity-50 transition-colors"
            title={`Speak in ${lang.name}`}
          >
            <span className="mr-1">🔊</span>
            {lang.code.toUpperCase()}
          </button>
        ))}

        {voiceSupportedLanguages.length > 4 && (
          <select
            onChange={(e) => handleQuickSpeak(e.target.value)}
            disabled={isSpeaking || isTranslating}
            className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm border"
          >
            <option value="">More...</option>
            {voiceSupportedLanguages.slice(4).map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
        )}

        {(isSpeaking || isTranslating) && (
          <div className="flex items-center text-xs text-gray-500">
            {isSpeaking && (
              <>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-ping mr-1"></div>
                Speaking...
              </>
            )}
            {isTranslating && (
              <>
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-500 mr-1"></div>
                Translating...
              </>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
        <div className="flex justify-between items-start">
          <h4 className="font-medium text-gray-700 mb-2">Original Text:</h4>

          <div className="flex gap-1">
            {voiceSupportedLanguages.slice(0, 3).map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleQuickSpeak(lang.code)}
                disabled={isSpeaking || isTranslating}
                className="flex items-center px-2 py-1 bg-green-100 text-green-700 rounded text-xs hover:bg-green-200 disabled:opacity-50 transition-colors"
                title={`Speak in ${lang.name}`}
              >
                <span className="mr-1">🔊</span>
                {lang.code.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
        <p className="text-gray-900">{text}</p>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Language:
        </label>
        <div className="flex flex-wrap gap-2 items-center justify-between">
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            disabled={isSpeaking}
          >
            {availableLanguages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {getLanguageDisplay(lang.code)}
              </option>
            ))}
          </select>

          <div className="flex items-center gap-2 my-2 lg:my-0">
            <button
              onClick={handleSpeak}
              disabled={isSpeaking || isTranslating || !text}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 transition-colors min-w-[120px] justify-center"
            >
              {isTranslating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Translating...
                </>
              ) : isSpeaking ? (
                <>
                  <div className="animate-pulse mr-2">🔊</div>
                  Speaking...
                </>
              ) : (
                <>
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Speak
                </>
              )}
            </button>

            <button
              onClick={stop}
              disabled={!isSpeaking}
              className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              title="Stop Speech"
            >
              ⏹️
            </button>
          </div>
        </div>

        <div className="text-xs text-gray-500 mt-1">
          🔊 = Voice Available | 📝 = Translation Only
        </div>
      </div>

      {translatedText && showTranslation && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex justify-between items-start">
            <h4 className="font-medium text-blue-800 mb-2">
              Translation in{" "}
              {
                availableLanguages.find((l) => l.code === selectedLanguage)
                  ?.name
              }
              :
            </h4>
            <button
              onClick={() => handleQuickSpeak(selectedLanguage)}
              disabled={
                isSpeaking ||
                isTranslating ||
                !availableLanguages.find((l) => l.code === selectedLanguage)
                  ?.voiceSupport
              }
              className="flex items-center px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200 disabled:opacity-50 transition-colors"
            >
              <span className="mr-1">🔊</span>
              Speak
            </button>
          </div>
          <p className="text-blue-900">{translatedText}</p>
        </div>
      )}

      <div className="mt-4">
        <div className="flex justify-between items-center mb-3">
          <h4 className="font-medium text-gray-700">Quick Speech Buttons:</h4>
          <button
            onClick={() => setShowTranslations(!showTranslations)}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            {showTranslations ? "Hide" : "Show"} All Languages
          </button>
        </div>

        <div className="mb-3">
          <h5 className="text-sm font-medium text-green-700 mb-2">
            🔊 With Voice Support:
          </h5>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {voiceSupportedLanguages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleQuickSpeak(lang.code)}
                disabled={isSpeaking || isTranslating}
                className="p-2 text-sm bg-green-50 border border-green-200 rounded-md hover:bg-green-100 disabled:opacity-50 transition-colors text-left group"
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium text-green-900">
                    {lang.name}
                  </span>
                  <span className="text-xs bg-green-200 text-green-800 px-1 rounded">
                    🔊
                  </span>
                </div>
                <div className="text-xs text-green-700">{lang.nativeName}</div>
                <div className="text-xs text-green-600 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  Click to speak
                </div>
              </button>
            ))}
          </div>
        </div>

        {showTranslations && (
          <div>
            <h5 className="text-sm font-medium text-yellow-700 mb-2">
              📝 Translation Only:
            </h5>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {translationOnlyLanguages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleShowTranslation(lang.code)}
                  disabled={isTranslating}
                  className="p-2 text-sm bg-yellow-50 border border-yellow-200 rounded-md hover:bg-yellow-100 disabled:opacity-50 transition-colors text-left group"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-yellow-900">
                      {lang.name}
                    </span>
                    <span className="text-xs bg-yellow-200 text-yellow-800 px-1 rounded">
                      📝
                    </span>
                  </div>
                  <div className="text-xs text-yellow-700">
                    {lang.nativeName}
                  </div>
                  <div className="text-xs text-yellow-600 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    Click to translate
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="text-sm text-gray-600 mt-3">
        {isSpeaking && (
          <div className="flex items-center text-green-600">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-ping mr-2"></div>
            Speaking in{" "}
            {availableLanguages.find((l) => l.code === currentLanguage)?.name ||
              "English"}
          </div>
        )}
        {isTranslating && (
          <div className="flex items-center text-blue-600">
            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600 mr-2"></div>
            Translating...
          </div>
        )}
      </div>
    </div>
  );
};

export default MultiLanguageTTS;
