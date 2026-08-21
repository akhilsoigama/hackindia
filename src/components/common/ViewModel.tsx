// components/CommonModal.tsx
import React, { memo, ReactNode, useEffect, useRef, useState } from "react";
import useTranslateWithAtom from "../../action/translate";
import { useTheme as useAppTheme } from '@/theme/AppThemeProvider';

interface CommonModalProps<T> {
  isOpen: boolean;
  onClose: () => void;
  title: string | React.ReactNode;
  data: T | null;
  fields: {
    label: string | React.ReactNode;
    key?: keyof T;
    type?: "text" | "textarea" | "custom" | "section";
    disabled?: boolean;
    render?: {
      bivarianceHack: (value: unknown, data: T) => ReactNode;
    }['bivarianceHack'];
    onChange?: (value: string, data: T) => T;
  }[];
  footerContent?: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}

const CommonModal = <T,>({
  isOpen,
  onClose,
  title,
  data,
  fields,
  footerContent,
  size = "lg",
}: CommonModalProps<T>) => {
  const { mode } = useAppTheme();
  const isDark = mode === 'dark';

  const sizeClasses = {
    sm: "max-w-md lg:max-w-lg",
    md: "max-w-lg lg:max-w-2xl",
    lg: "max-w-2xl lg:max-w-4xl",
    xl: "max-w-4xl lg:max-w-6xl",
  };
  const Translated = memo(({ text }: { text: string | React.ReactNode }) => {
    const { translateText, currentLanguage } = useTranslateWithAtom();
    const [translated, setTranslated] = useState<string>(typeof text === "string" ? text : "");
    const timeoutRef = useRef<number | null>(null);

    useEffect(() => {
      let mounted = true;

      const doTranslate = async () => {
        if (typeof text !== "string" || !text.trim()) return;

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

    if (typeof text !== "string") {
      return <>{text}</>;
    }

    return <span translate="no">{translated}</span>;
  });

  Translated.displayName = "Translated";

  const isWideField = (field: (typeof fields)[number]) => field.type === 'textarea' || field.type === 'custom' || field.type === 'section';

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-200 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
    >
      <div
        className={`fixed inset-0 backdrop-blur-[2px] transition-colors duration-300 ${isDark ? 'bg-slate-950/70' : 'bg-slate-900/50'}`}
        onClick={onClose}
      />
      <div
        className={`relative w-full ${sizeClasses[size]} max-h-[90vh] overflow-y-auto scrollbar-hide rounded-3xl border shadow-2xl ${isDark ? 'border-slate-800 bg-slate-950 text-slate-100' : 'border-slate-200 bg-white text-slate-900'}`}
      >
        <div className={`sticky top-0 z-10 border-b ${isDark ? 'border-slate-800 bg-slate-950/95' : 'border-slate-200 bg-white/95'} backdrop-blur-xl`}>
          <div
            className="h-1 w-full"
            style={{
              backgroundImage: isDark
                ? 'linear-gradient(90deg, #22d3ee, #0ea5e9, #6366f1, #22d3ee)'
                : 'linear-gradient(90deg, #0ea5e9, #2563eb, #06b6d4, #0ea5e9)',
              backgroundSize: '300% 100%',
              animation: 'modalGradientShift 8s ease-in-out infinite',
            }}
          />
          <div className="flex items-center justify-between gap-4 px-5 sm:px-6 py-4">
            <div className="min-w-0">
              <div className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${isDark ? 'bg-slate-900 text-cyan-300' : 'bg-sky-50 text-sky-700'}`}>
                Details
              </div>
              <h3 className={`mt-2 truncate text-lg sm:text-xl font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                <Translated text={title} />
              </h3>
            </div>
          <button
            onClick={onClose}
            className={`shrink-0 rounded-full border p-2.5 transition-all duration-200 ${isDark ? 'border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700 hover:bg-slate-800 hover:text-white' : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900'}`}
            aria-label="Close modal"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          </div>
        </div>

        <div className="p-5 sm:p-6">
          {data &&
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {fields.map((field, index) => {
              if (field.type === 'section' && field.render) {
                return (
                  <div key={index} className="md:col-span-2">
                    {field.render(undefined, data)}
                  </div>
                );
              }

              const fullWidth = isWideField(field);

              return (
                <div
                  key={index}
                  className={`rounded-2xl border p-4 shadow-sm ${fullWidth ? 'md:col-span-2' : ''} ${isDark ? 'border-slate-800 bg-slate-900/60' : 'border-slate-200 bg-slate-50/70'}`}
                >
                  <label className={`mb-2 block text-xs font-semibold uppercase tracking-[0.18em] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    <Translated text={field.label} />
                  </label>

                  {field.type === 'textarea' ? (
                    <textarea
                      value={field.key ? ((data[field.key] as unknown as string) || '') : ''}
                      onChange={(e) =>
                        field.onChange && field.onChange(e.target.value, data)
                      }
                      disabled={field.disabled}
                      rows={4}
                      className={`w-full resize-none rounded-xl border px-4 py-3 text-sm leading-6 outline-none transition-all duration-200 focus:ring-4 ${isDark ? 'border-slate-700 bg-slate-950 text-slate-100 placeholder-slate-500 focus:border-cyan-500 focus:ring-cyan-500/10' : 'border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:border-sky-500 focus:ring-sky-500/10'} disabled:cursor-not-allowed disabled:opacity-70`}
                      placeholder={typeof field.label === 'string' ? field.label : undefined}
                    />
                  ) : field.type === 'custom' && field.render ? (
                    <div className="min-w-0">{field.render(field.key ? data[field.key] : undefined, data)}</div>
                  ) : (
                    <input
                      type="text"
                      value={field.key ? ((data[field.key] as unknown as string) || '') : ''}
                      onChange={(e) =>
                        field.onChange && field.onChange(e.target.value, data)
                      }
                      disabled={field.disabled}
                      className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition-all duration-200 focus:ring-4 ${isDark ? 'border-slate-700 bg-slate-950 text-slate-100 placeholder-slate-500 focus:border-cyan-500 focus:ring-cyan-500/10' : 'border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:border-sky-500 focus:ring-sky-500/10'} disabled:cursor-not-allowed disabled:opacity-70`}
                      placeholder={typeof field.label === 'string' ? field.label : undefined}
                    />
                  )}
                </div>
              );
              })}
            </div>
          }
        </div>
        {footerContent && (
          <div className={`sticky bottom-0 flex justify-end gap-3 border-t px-5 sm:px-6 py-4 ${isDark ? 'border-slate-800 bg-slate-950/95' : 'border-slate-200 bg-white/95'} backdrop-blur-xl`}>
            {footerContent}
          </div>
        )}
      </div>
      <style>{`
        @keyframes modalGradientShift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>
    </div>
  );
};

export default CommonModal;
