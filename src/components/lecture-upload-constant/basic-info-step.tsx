import React, { useEffect, useMemo } from 'react';
import { UseFormWatch, UseFormSetValue, UseFormGetValues } from 'react-hook-form';

import { ContentType, LessonFormData } from '../../hooks/useLectureUploadForm';
import ContentTypeSelector from './lecture-content-type';
import ContentTypeFields from './content-type';
import RHFFormField from '../hook-form/RHFFormFiled';
import RHFDropDown from '../hook-form/RHFDropDown';
import { difficultyLevels, gradeLevels, subjects } from './lecture-upload-constant';
import { ILecture } from '../../types/material';
import { Translated } from '../common/translator/translator';
import { useTheme } from '@/theme/AppThemeProvider';
import { useDepartments } from '../../action/department';

interface BasicInfoStepProps {
  watch: UseFormWatch<LessonFormData>;
  setValue: UseFormSetValue<LessonFormData>;
  getValues: UseFormGetValues<LessonFormData>;
  currentData?: ILecture; // ✅ added
}

const BasicInfoStep: React.FC<BasicInfoStepProps> = ({
  watch,
  setValue,
  currentData,
}) => {

  const { mode } = useTheme();
  const isDark = mode === "dark";
  const { departments } = useDepartments();

  const departmentOptions = useMemo(
    () => (departments || []).map((department) => ({
      value: department.id,
      label: department.departmentName,
    })),
    [departments]
  );

  useEffect(() => {
    if (currentData) {
      setValue('title', currentData.title || '');
      setValue('description', currentData.description || '');
      setValue('subject', currentData.subject || '');
      setValue('std', currentData.std || ''); // std is now in ILecture
      setValue('departmentId', currentData.departmentId || undefined);
      setValue('chapterTopic', currentData.chapterTopic || '');
      setValue('learningObjectives', currentData.learningObjectives || '');
      setValue('difficultyLevel', currentData.difficultyLevel || 'Beginner');
      setValue('contentType', currentData.contentType);
      setValue('thumbnailUrl', currentData.thumbnailUrl || '');
      setValue('contentUrl', currentData.contentUrl || '');
      setValue('durationInSeconds', currentData.durationInSeconds || undefined);
      setValue('textContent', currentData.textContent || '');
      setValue('duration', undefined);
    }
  }, [currentData, setValue]);

  const handleContentTypeChange = (type: ContentType) => {
    setValue('contentType', type);
    if (type !== 'text') setValue('textContent', '');
    if (type !== 'video' && type !== 'audio') setValue('durationInSeconds', undefined);
    if (type !== 'video') setValue('thumbnailUrl', '');
  };

  return (
    <div className={`rounded-2xl space-y-6 border px-5 py-4 ${isDark ? 'border-slate-700 bg-slate-950/70' : 'border-slate-200 '}`}>
      <div className="mb-4">
        <h2 className={`text-3xl sm:text-4xl  font-bold ${isDark ? 'text-gray-100' : 'text-slate-950/70'} flex items-center gap-3`}>
        <Translated text="Student Material" /> {currentData ? <Translated text='Edit' /> : <Translated text='Create' />}
        </h2>
        <p className={`mt-1 text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          <Translated text="Configure the lecture details, content type, and upload assets." />
        </p>
      </div>

      <ContentTypeSelector
        watch={watch}
        onContentTypeChange={handleContentTypeChange}
      />

      <RHFFormField
        name="title"
        label={<Translated text="Material Title" />}
        type="text"
        placeholder="Enter Material title"
        required
      />

      <RHFFormField
        name="description"
        label={<Translated text="Description" />}
        placeholder="Enter Material description"
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <RHFDropDown
          name="subject"
          label={<Translated text="Subject" />}
          options={subjects.map(subject => ({ value: subject, label: subject }))}
          placeholder="Select a subject"
          required
        />

        <RHFDropDown
          name="std"
          label={<Translated text="Standard" />}
          options={gradeLevels.map(level => ({ value: level, label: level }))}
          placeholder="Select standard"
          required
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <RHFDropDown
          name="departmentId"
          label={<Translated text="Department" />}
          options={departmentOptions}
          placeholder="Select department"
        />

        <RHFDropDown
          name="difficultyLevel"
          label={<Translated text="Difficulty Level" />}
          options={difficultyLevels.map((level) => ({ value: level, label: level }))}
          placeholder="Select difficulty"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <RHFFormField
          name="chapterTopic"
          label={<Translated text="Chapter / Topic" />}
          placeholder="Example: Algebraic Expressions"
        />

        <RHFFormField
          name="learningObjectives"
          label={<Translated text="Learning Objectives" />}
          placeholder="What should students learn from this lecture?"
          type="textarea"
        />
      </div>


      <ContentTypeFields watch={watch} currentData={currentData} />
    </div>
  );
};

export default BasicInfoStep;
