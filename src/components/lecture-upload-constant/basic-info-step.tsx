import React, { useEffect } from 'react';
import { UseFormWatch, UseFormSetValue, UseFormGetValues } from 'react-hook-form';

import { FaClock } from 'react-icons/fa';
import { ContentType, LessonFormData } from '../../hooks/useLectureUploadForm';
import ContentTypeSelector from './lecture-content-type';
import ContentTypeFields from './content-type';
import RHFFormField from '../hook-form/RHFFormFiled';
import RHFDropDown from '../hook-form/RHFDropDown';
import { gradeLevels, subjects } from './lecture-upload-constant';
import { ILecture } from '../../types/material';

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

  // Prefill form when editing existing lecture
useEffect(() => {
  if (currentData) {
    setValue('title', currentData.title || '');
    setValue('description', currentData.description || '');
    setValue('subject', currentData.subject || '');
    setValue('std', currentData.std || ''); // std is now in ILecture
    setValue('contentType', currentData.contentType);
    setValue('thumbnailUrl', currentData.thumbnailUrl || '');
    setValue('contentUrl', currentData.videoUrl || '');
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
    <div className="mb-5">
      <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
        Student Material {currentData ? 'Edit' : 'Create'}
      </h2>

      <ContentTypeSelector
        watch={watch}
        onContentTypeChange={handleContentTypeChange}
      />

      <RHFFormField
        name="title"
        label="Material Title"
        type="text"
        placeholder="Enter Material title"
        required
      />

      <RHFFormField
        name="description"
        label="Description"
        placeholder="Enter Material description"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <RHFDropDown
          name="subject"
          label="Subject"
          options={subjects.map(subject => ({ value: subject, label: subject }))}
          placeholder="Select a subject"
          required
        />

        <RHFDropDown
          name="std"
          label="Select STD"
          options={gradeLevels.map(level => ({ value: level, label: level }))}
          placeholder="Select grade level"
          required
        />
      </div>

      <RHFFormField
        name="duration"
        label="Estimated Duration"
        type="date"
        placeholder="e.g., 45 minutes, 2 class periods"
        icon={<FaClock className="text-indigo-500" />}
      />

      <ContentTypeFields watch={watch} />
    </div>
  );
};

export default BasicInfoStep;
