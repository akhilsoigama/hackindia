import React, { useRef, useState, ChangeEvent } from 'react';
import axios from 'axios';
import { Controller, Path, useFormContext } from 'react-hook-form';
import { LessonFormData } from '../../hooks/useLectureUploadForm';
import { toast } from 'sonner';

interface RHFPDFUploadProps {
  name: keyof LessonFormData;
  label?: string;
  required?: boolean;
  className?: string;
}

const RHFPDFUpload: React.FC<RHFPDFUploadProps> = ({
  name,
  label = 'Upload PDF',
  required = false,
  className = '',
}) => {
  const { control } = useFormContext<LessonFormData>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadedUrl, setUploadedUrl] = useState<string>('');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string>('');

  const uploadFile = async (file: File, onChange: (value: string) => void) => {
    setIsUploading(true);
    setFileName(file.name);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_PRESET);

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/raw/upload`,
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

      const url = response.data.secure_url;
      setUploadedUrl(url);
      onChange(url);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error('PDF Upload Failed:', error.response?.data || error.message);
      } else if (error instanceof Error) {
        console.error('PDF Upload Failed:', error.message);
      } else {
        console.error('PDF Upload Failed:', error);
      }
      toast.error('Upload failed! Please try again.');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleReset = (onChange: (value: string) => void) => {
    setUploadedUrl('');
    setFileName('');
    onChange(''); // Reset RHF value
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>, onChange: (value: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      alert('Please select a PDF file');
      return;
    }

    // File size validation (5MB limit)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      alert('File size too large. Please select a PDF under 5MB.');
      return;
    }

    uploadFile(file, onChange);
  };

  return (
    <Controller
      control={control}
      name={name as Path<LessonFormData>}
      rules={{ required }}
      render={({ field: { onChange }, fieldState: { error } }) => (
        <div className={`mb-6 ${className}`}>
          {/* Label */}
          <label className="block text-sm font-medium text-gray-700 mb-3">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>

          {/* Upload Area */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors duration-200 bg-gray-50">
            <input
              type="file"
              accept="application/pdf"
              ref={fileInputRef}
              onChange={(e) => handleFileSelect(e, onChange)}
              disabled={isUploading}
              className="hidden"
              id={`pdf-upload-${name}`}
            />

            <label
              htmlFor={`pdf-upload-${name}`}
              className={`cursor-pointer flex flex-col items-center justify-center space-y-3 ${isUploading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
            >
              {/* Upload Icon */}
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
              </div>

              {/* Upload Text */}
              <div className="text-center">
                <p className="text-sm font-medium text-gray-700">
                  {isUploading ? 'Uploading...' : 'Click to upload PDF'}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  PDF files only (max 5MB)
                </p>
              </div>
            </label>
          </div>

          {/* File Name */}
          {fileName && !isUploading && (
            <div className="mt-3 flex items-center justify-between bg-green-50 border border-green-200 rounded-md p-3">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="text-sm font-medium text-green-800 truncate">
                  {fileName}
                </span>
              </div>
              <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
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
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Uploaded URL */}
          {uploadedUrl && !isUploading && (
            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-sm font-medium text-blue-700 mb-2">PDF Uploaded Successfully!</p>
              <a
                href={uploadedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:text-blue-800 underline truncate block"
              >
                View PDF
              </a>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <p className="mt-2 text-sm text-red-600 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error.message || 'This field is required'}
            </p>
          )}

          {/* Reset Button */}
          {(uploadedUrl || fileName) && !isUploading && (
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={() => handleReset(onChange)}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Remove PDF
              </button>
            </div>
          )}
        </div>
      )}
    />
  );
};

export default RHFPDFUpload;