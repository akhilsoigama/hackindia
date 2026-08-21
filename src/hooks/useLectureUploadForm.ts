import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ILecture } from '../types/material';
import { useUser } from '../atoms/userAtom';


export const lessonSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  subject: z.string().min(1, 'Subject is required'),
  std: z.string().min(1, 'Grade level is required'),
  departmentId: z.number().optional(),
  chapterTopic: z.string().max(120, 'Chapter/Topic too long').optional(),
  learningObjectives: z.string().max(500, 'Learning objectives too long').optional(),
  difficultyLevel: z.enum(['Beginner', 'Intermediate', 'Advanced']).optional(),
  duration: z.string().optional().nullable(),
  contentType: z.enum(['video', 'pdf', 'audio', 'text', 'image']),
  description: z.string().optional(),

  thumbnailUrl: z.string().optional(),

  contentUrl: z.string().optional(),

  durationInSeconds: z.number().min(0).optional(),
  textContent: z.string().optional(),

  facultyId: z.number().min(1, 'facultyId is required')
})
  .refine((data) => {
    if (['video', 'pdf', 'audio', 'image'].includes(data.contentType)) {
      return data.contentUrl && data.contentUrl.length > 0;
    }
    return true;
  }, {
    message: 'Content URL is required',
    path: ['contentUrl']
  })
  .refine((data) => {
    if (['video', 'pdf', 'audio', 'image'].includes(data.contentType) && data.contentUrl) {
      return /^https?:\/\/.+/.test(data.contentUrl);
    }
    return true;
  }, {
    message: 'Invalid URL format',
    path: ['contentUrl']
  })
  .refine((data) => {
    if (data.contentType === 'video') {
      return data.thumbnailUrl && data.thumbnailUrl.length > 0;
    }
    return true;
  }, {
    message: 'Thumbnail is required',
    path: ['thumbnailUrl']
  })
  .refine((data) => {
    if (data.contentType === 'video' && data.thumbnailUrl) {
      return /^https?:\/\/.+/.test(data.thumbnailUrl);
    }
    return true;
  }, {
    message: 'Invalid thumbnail URL format',
    path: ['thumbnailUrl']
  })
  .refine((data) => {
    if (data.contentType === 'text') {
      return data.textContent && data.textContent.length > 0;
    }
    return true;
  }, {
    message: 'Text content is required',
    path: ['textContent']
  })
  .refine((data) => {
    if (['video', 'audio'].includes(data.contentType)) {
      return typeof data.durationInSeconds === 'number' && data.durationInSeconds > 0;
    }
    return true;
  }, {
    message: 'Duration is required',
    path: ['durationInSeconds']
  });

export type LessonFormData = z.infer<typeof lessonSchema>;

export interface Resource {
  type: string;
  title: string;
  url: string;
}

export type ContentType = 'video' | 'pdf' | 'audio' | 'text' | 'image';

export const useLessonForm = (currentData?: ILecture) => {
  const { user } = useUser()

  const facultyId = user?.authType === 'faculty'
    ? user?.data?.facultyId ?? undefined
    : undefined;

  const methods = useForm<LessonFormData>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      title: '',
      subject: '',
      std: '',
      departmentId: undefined,
      chapterTopic: '',
      learningObjectives: '',
      difficultyLevel: 'Beginner',
      contentType: 'video',
      description: '',
      thumbnailUrl: '',
      contentUrl: '',
      durationInSeconds: undefined,
      textContent: '',
      facultyId: facultyId
    }
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [newResource, setNewResource] = useState<Resource>({ type: 'link', title: '', url: '' });

  const { watch, reset } = methods;
  useEffect(() => {
    if (currentData) {
      reset({
        title: currentData.title || '',
        subject: currentData.subject || '',
        std: currentData.std || '',
        departmentId: currentData.departmentId ?? undefined,
        chapterTopic: currentData.chapterTopic || '',
        learningObjectives: currentData.learningObjectives || '',
        difficultyLevel: currentData.difficultyLevel || 'Beginner',
        contentType: currentData.contentType || 'video',
        description: currentData.description || '',
        thumbnailUrl: currentData.thumbnailUrl || '',
        contentUrl: currentData.contentUrl || '',
        durationInSeconds: currentData.durationInSeconds || undefined,
        textContent: currentData.textContent || '',
        facultyId: currentData?.facultyId,
      });
    } else {
      reset({
        facultyId: facultyId
      }, {
        keepDefaultValues: true
      });
    }
  }, [currentData, reset, facultyId]);

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 4));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  return {
    methods,
    currentStep,
    setCurrentStep,
    newResource,
    setNewResource,
    formData: watch(),
    nextStep,
    prevStep,
    reset,
    facultyId: facultyId
  };
};