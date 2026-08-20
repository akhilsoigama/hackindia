// hooks/useLessonForm.ts
import { useState, useEffect } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ILecture } from '../types/material';

// ----------------- Zod Schema -----------------
export const lessonSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  subject: z.string().min(1, 'Subject is required'),
  std: z.string().min(1, 'Grade level is required'),
  duration: z.string().optional(),
  contentType: z.enum(['video', 'pdf', 'audio', 'text', 'image']),
  description: z.string().optional(),

  // Updated URL validation (non-deprecated)
  thumbnailUrl: z.string()
    .optional()
    .refine(val => !val || /^https?:\/\/.+/.test(val), 'Invalid URL format'),

  contentUrl: z.string()
    .optional()
    .refine(val => !val || /^https?:\/\/.+/.test(val), 'Invalid URL format'),

  durationInSeconds: z.number().min(1).optional(),
  textContent: z.string().optional(),
});

export type LessonFormData = z.infer<typeof lessonSchema>;

// ----------------- Resource Interface -----------------
export interface Resource {
  type: string;
  title: string;
  url: string;
}

export type ContentType = 'video' | 'pdf' | 'audio' | 'text' | 'image';

// ----------------- Custom Hook -----------------
export const useLessonForm = (currentData?: ILecture) => {
  const methods: UseFormReturn<LessonFormData> = useForm<LessonFormData>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      title: '',
      subject: '',
      std: '',
      duration: '',
      contentType: 'video',
      description: '',
      thumbnailUrl: '',
      contentUrl: '',
      durationInSeconds: undefined,
      textContent: ''
    }
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [newResource, setNewResource] = useState<Resource>({ type: 'link', title: '', url: '' });

  const { watch, reset,formState:{errors} } = methods;
  console.log(errors)

  // Prefill form with ILecture data if editing
  useEffect(() => {
    if (currentData) {
      reset({
        title: currentData.title || '',
        subject: currentData.subject || '',
        std: currentData.std || '',
        duration: currentData.duration || '',
        contentType: currentData.contentType || 'video',
        description: currentData.description || '',
        thumbnailUrl: currentData.thumbnailUrl || '',
        contentUrl: currentData.videoUrl || '',
        durationInSeconds: currentData.durationInSeconds || undefined,
        textContent: currentData.textContent || ''
      });
    }
  }, [currentData, reset]);

  // Step navigation helpers
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
    reset
  };
};
