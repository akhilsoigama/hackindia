import React, { useRef, useState, ChangeEvent } from 'react';
import axios from 'axios';
import { Controller, useFormContext, Path } from 'react-hook-form';
import { LessonFormData } from '../../hooks/useLectureUploadForm';
import { NavLink } from 'react-router-dom';

interface RHFAudioUploadProps {
    name: keyof LessonFormData;
    label?: string;
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
                console.error('Audio Upload Failed:', error.response || error.message);
                alert('Upload failed! Please try again.');
            } else if (error instanceof Error) {
                console.error('Audio Upload Failed:', error.message);
                alert('Upload failed! Please try again.');
            } else {
                console.error('Unexpected error:', error);
                alert('Upload failed! Please try again.');
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
            alert('Please select an audio file (MP3, WAV, etc.)');
            return;
        }

        const maxSize = 50 * 1024 * 1024; // 50MB
        if (file.size > maxSize) {
            alert('File size too large. Please select an audio file under 50MB.');
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
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                        {label}
                        {required && <span className="text-red-500 ml-1">*</span>}
                    </label>

                    {/* Upload Area */}
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-400 transition-colors duration-200 bg-gray-50">
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
                            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                                <svg
                                    className="w-6 h-6 text-purple-600"
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
                                <p className="text-sm font-medium text-gray-700">
                                    {isUploading ? 'Uploading Audio...' : 'Click to upload audio'}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    MP3, WAV, AAC files (max 50MB)
                                </p>
                            </div>
                        </label>
                    </div>

                    {/* File Info */}
                    {fileName && !isUploading && (
                        <div className="mt-3 flex items-center justify-between bg-green-50 border border-green-200 rounded-md p-3">
                            <div className="flex items-center space-x-3">
                                <svg
                                    className="w-5 h-5 text-green-600"
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
                                    <span className="text-sm font-medium text-green-800 block">{fileName}</span>
                                    {audioDuration && <span className="text-xs text-green-600">Duration: {audioDuration}</span>}
                                </div>
                            </div>
                            <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
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
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Uploading {fileName}...</span>
                                <span>{uploadProgress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-purple-600 h-2 rounded-full transition-all duration-300 ease-out"
                                    style={{ width: `${uploadProgress}%` }}
                                />
                            </div>
                            {audioDuration && (
                                <p className="text-xs text-gray-500 text-center">Duration: {audioDuration}</p>
                            )}
                        </div>
                    )}

                    {/* Audio Player */}
                    {value && !isUploading && (
                        <div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                            <p className="text-sm font-medium text-purple-700 mb-3 flex items-center">
                                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                Audio Preview
                            </p>
                            <audio controls className="w-full rounded-lg bg-white shadow-sm" preload="metadata">
                                {/* Ensure value is string */}
                                {typeof value === 'string' && (
                                    <>
                                        <source src={value} type="audio/mpeg" />
                                        <source src={value} type="audio/wav" />
                                        <source src={value} type="audio/aac" />
                                    </>
                                )}
                                Your browser does not support the audio element.
                            </audio>
                            <div className="mt-2 flex justify-between items-center text-xs text-purple-600">
                                <span>Ready to use in your lesson</span>
                                {/* Use NavLink instead of <a> */}
                                {typeof value === 'string' && (
                                    <NavLink
                                        to={value}
                                        target="_blank"
                                        className="hover:text-purple-800 underline"
                                    >
                                        Open in new tab
                                    </NavLink>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <p className="mt-2 text-sm text-red-600 flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                    fillRule="evenodd"
                                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            {error.message || 'This field is required'}
                        </p>
                    )}

                    {/* Reset Button */}
                    {(value || fileName) && !isUploading && (
                        <div className="mt-4 flex justify-end">
                            <button
                                type="button"
                                onClick={() => handleReset(onChange)}
                                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-200"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                    />
                                </svg>
                                Remove Audio
                            </button>
                        </div>
                    )}
                </div>
            )}
        />
    );
};

export default RHFAudioUpload;
