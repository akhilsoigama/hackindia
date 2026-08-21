import React, { useRef, useState, ChangeEvent } from 'react';
import axios from 'axios';
import { Controller, useFormContext, Path } from 'react-hook-form';
import { LessonFormData } from '../../hooks/useLectureUploadForm';
import { NavLink } from 'react-router-dom';
import { Translated } from '../common/translator/translator';
import { useTheme } from '@/theme/AppThemeProvider';

interface RHFAudioUploadProps {
    name: keyof LessonFormData;
    label?: string | React.ReactNode;
    required?: boolean;
    className?: string;
}

const RHFAudioUpload: React.FC<RHFAudioUploadProps> = ({
    name,
    label = 'Upload Audio',
    required = false,
    className = '',
}) => {
    const { control } = useFormContext<LessonFormData>();
    const { mode } = useTheme();
    const isDark = mode === 'dark';
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploadProgress, setUploadProgress] = useState<number>(0);
    // const [uploadedUrl, setUploadedUrl] = useState<string>('');
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const [fileName, setFileName] = useState<string>('');
    const [audioDuration, setAudioDuration] = useState<string>('');

    // Get audio duration from file
    const getAudioDuration = (file: File): Promise<string> => {
        return new Promise((resolve) => {
            const audio = new Audio();
            const objectUrl = URL.createObjectURL(file);

            audio.addEventListener('loadedmetadata', () => {
                const duration = audio.duration;
                const minutes = Math.floor(duration / 60);
                const seconds = Math.floor(duration % 60);
                resolve(`${minutes}:${seconds.toString().padStart(2, '0')}`);
                URL.revokeObjectURL(objectUrl);
            });

            audio.addEventListener('error', () => {
                resolve('Unknown');
                URL.revokeObjectURL(objectUrl);
            });

            audio.src = objectUrl;
        });
    };

    // Upload audio to Cloudinary
    const uploadFile = async (file: File, onChange: (value: string) => void) => {
        setIsUploading(true);
        setFileName(file.name);
        setUploadProgress(0);

        try {
            const duration = await getAudioDuration(file);
            setAudioDuration(duration);

            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_PRESET);
            formData.append('resource_type', 'video');

            const response = await axios.post(
                `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/video/upload`,
                formData,
                {
                    headers: { 'Content-Type': 'multipart/form-data' },
                    onUploadProgress: (progressEvent) => {
                        if (progressEvent.total) {
                            const progress = Math.round(
                                (progressEvent.loaded * 100) / progressEvent.total
                            );
                            setUploadProgress(progress);
                        }
                    },
                }
            );

            const url = response.data.secure_url as string;
            // setUploadedUrl(url);
            onChange(url);
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                console.error(<Translated text='Audio Upload Failed:'/>, error.response || error.message);
                alert(<Translated text='Upload failed! Please try again.'/>);
            } else if (error instanceof Error) {
                console.error(<Translated text='Audio Upload Failed:'/>, error.message);
                alert(<Translated text='Upload failed! Please try again.'/>);
            } else {
                console.error(<Translated text='Unexpected error:'/>, error);
                alert(<Translated text='Upload failed! Please try again.'/>);
            }
        } finally {
            setIsUploading(false);
            setUploadProgress(0);
        }
    };

    // Reset file input and state
    const handleReset = (onChange: (value: string) => void) => {
        // setUploadedUrl('');
        setFileName('');
        setAudioDuration('');
        onChange('');
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    // Handle file selection
    const handleFileSelect = (e: ChangeEvent<HTMLInputElement>, onChange: (value: string) => void) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('audio/')) {
            alert(<Translated text='Please select an audio file (MP3, WAV, etc.)'/>);
            return;
        }

        const maxSize = 50 * 1024 * 1024; // 50MB
        if (file.size > maxSize) {
            alert(<Translated text='File size too large. Please select an audio file under 50MB.'/>);
            return;
        }

        uploadFile(file, onChange);
    };

    return (
        <Controller
            control={control}
            name={name as Path<LessonFormData>}
            rules={{ required }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
                <div className={`mb-6 ${className}`}>
                    {/* Label */}
                    <label className={`${isDark ? 'text-gray-100' : 'text-gray-700'} block text-sm font-semibold mb-3`}>
                        <Translated text={typeof label === 'string' ? label : String(label ?? '')} />
                        {required && <span className="text-red-500 ml-1">*</span>}
                    </label>

                    {/* Upload Area */}
                    <div className={`rounded-2xl border-2 border-dashed p-6 text-center transition-colors duration-200 ${isDark ? 'border-slate-700 bg-slate-950/60 hover:border-violet-400' : 'border-gray-300 bg-gray-50 hover:border-purple-400'}`}>
                        <input
                            type="file"
                            accept="audio/*"
                            ref={fileInputRef}
                            onChange={(e) => handleFileSelect(e, onChange)}
                            disabled={isUploading}
                            className="hidden"
                            id={`audio-upload-${name}`}
                        />

                        <label
                            htmlFor={`audio-upload-${name}`}
                            className={`cursor-pointer flex flex-col items-center justify-center space-y-3 ${isUploading ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                        >
                            <div className={`flex h-12 w-12 items-center justify-center rounded-full ${isDark ? 'bg-violet-500/15' : 'bg-purple-100'}`}>
                                <svg
                                    className={`h-6 w-6 ${isDark ? 'text-violet-300' : 'text-purple-600'}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 001.414 1.414m-2.828-9.9a9 9 0 012.728-2.728"
                                    />
                                </svg>
                            </div>

                            <div className="text-center">
                                <p className={`${isDark ? 'text-gray-100' : 'text-gray-700'} text-sm font-semibold`}>
                                    {isUploading ? <Translated text="Uploading Audio..." /> : <Translated text="Click to upload audio" />}
                                </p>
                                <p className={`${isDark ? 'text-slate-400' : 'text-gray-500'} mt-1 text-xs`}>
                                    <Translated text="MP3, WAV, AAC files (max 50MB)"/>
                                </p>
                            </div>
                        </label>
                    </div>

                    {/* File Info */}
                    {fileName && !isUploading && (
                        <div className={`mt-3 flex items-center justify-between rounded-xl border p-3 ${isDark ? 'border-emerald-900/40 bg-emerald-950/30' : 'border-green-200 bg-green-50'}`}>
                            <div className="flex items-center space-x-3">
                                <svg
                                    className={`h-5 w-5 ${isDark ? 'text-emerald-300' : 'text-green-600'}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                                    />
                                </svg>
                                <div>
                                    <span className={`${isDark ? 'text-emerald-200' : 'text-green-800'} block text-sm font-medium`}>{fileName}</span>
                                    {audioDuration && <span className={`${isDark ? 'text-emerald-300' : 'text-green-600'} text-xs`}><Translated text="Duration: "/><Translated text={audioDuration}/></span>}
                                </div>
                            </div>
                            <svg className={`h-4 w-4 ${isDark ? 'text-emerald-300' : 'text-green-600'}`} fill="currentColor" viewBox="0 0 20 20">
                                <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </div>
                    )}

                    {/* Upload Progress */}
                    {isUploading && (
                        <div className="mt-4 space-y-2">
                            <div className={`${isDark ? 'text-slate-300' : 'text-gray-600'} flex justify-between text-sm`}>
                                <span><Translated text="Uploading" /> <Translated text={`${ fileName }...`} /></span>
                                <span><Translated text={`${ uploadProgress }%`} /></span>
                            </div>
                            <div className={`${isDark ? 'bg-gray-700' : 'bg-gray-200'} h-2 w-full rounded-full`}>
                                <div
                                    className="h-2 rounded-full bg-violet-600 transition-all duration-300 ease-out"
                                    style={{ width: `${uploadProgress}%` }}
                                />
                            </div>
                            {audioDuration && (
                                <p className={`${isDark ? 'text-slate-400' : 'text-gray-500'} text-center text-xs`}><Translated text="Duration: "/> <Translated text={audioDuration}/></p>
                            )}
                        </div>
                    )}

                    {/* Audio Player */}
                    {value && !isUploading && (
                        <div className={`mt-4 rounded-xl border p-4 ${isDark ? 'border-violet-900/40 bg-violet-950/30' : 'border-purple-200 bg-purple-50'}`}>
                            <p className={`${isDark ? 'text-violet-100' : 'text-purple-700'} mb-3 flex items-center text-sm font-medium`}>
                                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                <Translated text="Audio Preview" />
                            </p>
                            <audio controls className="w-full rounded-lg shadow-sm" preload="metadata">
                                {/* Ensure value is string */}
                                {typeof value === 'string' && (
                                    <>
                                        <source src={value} type="audio/mpeg" />
                                        <source src={value} type="audio/wav" />
                                        <source src={value} type="audio/aac" />
                                    </>
                                )}
                                <Translated text="Your browser does not support the audio element." />
                            </audio>
                            <div className={`${isDark ? 'text-violet-300' : 'text-purple-600'} mt-2 flex items-center justify-between text-xs`}>
                                <span><Translated text="Ready to use in your lesson" /></span>
                                {/* Use NavLink instead of <a> */}
                                {typeof value === 'string' && (
                                    <NavLink
                                        to={value}
                                        target="_blank"
                                        className={`${isDark ? 'hover:text-violet-200' : 'hover:text-purple-800'} underline`}
                                    >
                                        <Translated text="Open in new tab" />
                                    </NavLink>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <p className="mt-2 flex items-center text-sm text-red-500">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                    fillRule="evenodd"
                                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            {error.message || <Translated text='This field is required'/>}
                        </p>
                    )}

                    {/* Reset Button */}
                    {(value || fileName) && !isUploading && (
                        <div className="mt-4 flex justify-end">
                            <button
                                type="button"
                                onClick={() => handleReset(onChange)}
                                className={`inline-flex items-center rounded-md border px-3 py-2 text-sm font-medium leading-4 shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 ${isDark ? 'border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800' : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'}`}
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                    />
                                </svg>
                                <Translated text="Remove Audio" />
                            </button>
                        </div>
                    )}
                </div>
            )}
        />
    );
};

export default RHFAudioUpload;
