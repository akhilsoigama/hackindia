import React from 'react';
import { UseFormWatch } from 'react-hook-form';
import { ContentType, LessonFormData } from '../../hooks/useLectureUploadForm';
import { contentTypeConfig } from './lecture-upload-constant';
import { Translated } from '../common/translator/translator';
import { useTheme } from '@/theme/AppThemeProvider';

interface ContentTypeSelectorProps {
  watch: UseFormWatch<LessonFormData>;
  onContentTypeChange: (type: ContentType) => void;
}

const ContentTypeSelector: React.FC<ContentTypeSelectorProps> = ({ 
  watch, 
  onContentTypeChange 
}) => {

  const { mode } = useTheme();
  const isDark = mode === "dark";
  const contentType = watch('contentType');

  return (
    <div className={`rounded-2xl border p-5 ${isDark ? 'border-slate-700 bg-slate-950/70' : 'border-slate-200 bg-white'}`}>
      <label className={`mb-4 block text-sm font-semibold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
        <Translated text="Content Type"/>
      </label>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
        {(Object.entries(contentTypeConfig) as [ContentType, typeof contentTypeConfig[ContentType]][]).map(([type, config]) => {
          const isActive = contentType === type;
          return (
            <button
              key={type}
              type="button"
              onClick={() => onContentTypeChange(type as ContentType)}
              className={`
                flex flex-col items-center justify-center rounded-2xl border p-4 text-center 
                transition-all duration-300 ease-in-out
                ${isActive 
                  ? (isDark
                    ? 'border-slate-400/60 bg-slate-500/15 text-slate-100 shadow-lg shadow-slate-900/30 scale-[1.02]'
                    : 'border-slate-500/70 bg-slate-100/70 text-slate-700 shadow-lg shadow-slate-200/40 scale-[1.02]') 
                  : (isDark
                    ? 'border-slate-700/50 bg-slate-950/40 text-slate-400 hover:border-slate-400/50 hover:bg-slate-900/60 hover:text-slate-200 hover:shadow-md hover:scale-[1.02]'
                    : 'border-slate-300/50 bg-slate-100/40 text-slate-600 hover:border-slate-400/60 hover:bg-slate-50/60 hover:text-slate-700 hover:shadow-md hover:scale-[1.02]')
                }
                focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2
              `}
            >
              <div className="flex flex-col items-center">
                <span className="text-2xl mb-2">{config.icon}</span>
                <span className="text-sm font-medium"><Translated text={config.label}/></span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  );
};

export default ContentTypeSelector;
