import React from 'react';
import { UseFormWatch } from 'react-hook-form';
import { ContentType, LessonFormData } from '../../hooks/useLectureUploadForm';
import { contentTypeConfig } from './lecture-upload-constant';

interface ContentTypeSelectorProps {
  watch: UseFormWatch<LessonFormData>;
  onContentTypeChange: (type: ContentType) => void;
}

const ContentTypeSelector: React.FC<ContentTypeSelectorProps> = ({ 
  watch, 
  onContentTypeChange 
}) => {
  const contentType = watch('contentType');

  return (
    <div className="py-7">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Content Type *
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {(Object.entries(contentTypeConfig) as [ContentType, typeof contentTypeConfig[ContentType]][]).map(([type, config]) => {
          const isActive = contentType === type;
          return (
            <button
              key={type}
              type="button"
              onClick={() => onContentTypeChange(type as ContentType)}
              className={`
                flex flex-col items-center justify-center p-4 border-2 rounded-lg text-center 
                transition-all duration-300 ease-in-out
                ${isActive 
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-lg scale-105' 
                  : 'border-gray-200 bg-white text-gray-700 hover:border-indigo-400 hover:shadow-md hover:scale-105'
                }
                focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2
              `}
            >
              <div className="flex flex-col items-center">
                <span className="text-2xl mb-2">{config.icon}</span>
                <span className="text-sm font-medium">{config.label}</span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  );
};

export default ContentTypeSelector;
