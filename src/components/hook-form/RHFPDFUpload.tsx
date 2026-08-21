import { useRef, useState, ChangeEvent, useEffect } from 'react';
import axios from 'axios';
import { Controller, FieldValues, Path, PathValue, useFormContext } from 'react-hook-form';
import { toast } from 'sonner';
import { Translated } from '../common/translator/translator';
import { useTheme } from '@/theme/AppThemeProvider';

interface RHFPDFUploadProps<TFieldValues extends FieldValues = FieldValues> {
  name: Path<TFieldValues>;
  label?: string | React.ReactNode;
  required?: boolean;
  className?: string;
  currentValue?: string;
}

function RHFPDFUpload<TFieldValues extends FieldValues = FieldValues>({
  name,
  label = 'Upload PDF',
  required = false,
  className = '',
  currentValue = '',
}: RHFPDFUploadProps<TFieldValues>) {
  const { mode } = useTheme();
  const isDark = mode === "dark";
  const { control, setValue } = useFormContext<TFieldValues>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadedUrl, setUploadedUrl] = useState<string>(currentValue);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string>('');

  useEffect(() => {
    if (currentValue) {
      setUploadedUrl(currentValue);
      const urlParts = currentValue.split('/');
      const extractedFileName = urlParts[urlParts.length - 1];
      setFileName(decodeURIComponent(extractedFileName));
    }
  }, [currentValue]);

  const uploadFile = async (file: File) => {
    setIsUploading(true);
    setFileName(file.name);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_PRESET_PDF);

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/raw/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
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
      setValue(name, url as PathValue<TFieldValues, Path<TFieldValues>>);
      toast.success(<Translated text='PDF uploaded successfully!' />);
    } catch (error) {
      console.error(<Translated text='PDF Upload Failed:' />, <Translated text={typeof error === 'string' ? error : (error instanceof Error ? error.message : String(error))} />);
      toast.error(<Translated text='Upload failed! Please try again.' />);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleReset = () => {
    setUploadedUrl('');
    setFileName('');
    setValue(name, '' as PathValue<TFieldValues, Path<TFieldValues>>);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = [
      'application/pdf',
      'application/x-pdf'
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error('Please select a valid PDF file');
      return;
    }

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error('File size too large. Please select a PDF under 10MB.');
      return;
    }

    uploadFile(file);
  };

  return (
    <Controller
      control={control}
      name={name}
      rules={{ required }}
      render={({ fieldState: { error } }) => (
        <div className={`mb-6 ${className}`}>
          <label className={`${isDark ? 'text-gray-100' : 'text-gray-700'} block text-sm font-semibold mb-3`}>
            {label}
            {required && <span className="ml-1 text-red-500">*</span>}
          </label>

          {/* Show current PDF info if exists */}
          {currentValue && !uploadedUrl && (
            <div className={`mb-4 rounded-xl border p-3 ${isDark ? 'border-slate-700 bg-slate-900/70' : 'border-slate-200 bg-slate-50'}`}>
              <p className={`mb-2 text-sm font-medium ${isDark ? 'text-teal-100' : 'text-slate-700'}`}>📄 Current PDF</p>
              <div className="flex items-center justify-between">
                <span className={`${isDark ? 'text-slate-300' : 'text-gray-600'} truncate text-sm`}>
                  <Translated text={fileName || 'Existing PDF'} />
                </span>
                <a
                  href={currentValue}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${isDark ? 'text-teal-300 hover:text-teal-200' : 'text-slate-600 hover:text-slate-800'} text-sm`}
                >
                  <Translated text="View PDF" />
                </a>
              </div>
            </div>
          )}

          <div className={`rounded-2xl border-2 border-dashed p-6 text-center transition-colors duration-200 ${isDark ? 'border-slate-700 bg-slate-950/60 hover:border-teal-400' : 'border-gray-300 bg-gray-50 hover:border-slate-400'}`}>
            <input
              type="file"
              accept=".pdf,application/pdf"
              ref={fileInputRef}
              onChange={handleFileSelect}
              disabled={isUploading}
              className="hidden"
              id={`pdf-upload-${name}`}
            />

            <label
              htmlFor={`pdf-upload-${name}`}
              className={`cursor-pointer flex flex-col items-center justify-center space-y-3 ${isUploading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
            >
              <div className={`flex h-12 w-12 items-center justify-center rounded-full ${isDark ? 'bg-teal-500/15' : 'bg-slate-100'}`}>
                <svg
                  className={`h-6 w-6 ${isDark ? 'text-teal-300' : 'text-slate-600'}`}
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

              <div className="text-center">
                <p className={`${isDark ? 'text-gray-100' : 'text-gray-700'} text-sm font-semibold`}>
                  {isUploading ? (<Translated text="Uploading..." />) : (<Translated text="Click to upload PDF" />)}
                </p>
                <p className={`${isDark ? 'text-slate-400' : 'text-gray-500'} mt-1 text-xs`}>
                  <Translated text="PDF files only (max 10MB)" />
                </p>
                {currentValue && (
                  <p className={`${isDark ? 'text-teal-300' : 'text-green-600'} mt-1 text-xs`}>
                    <Translated text="Current PDF will be replaced" />
                  </p>
                )}
              </div>
            </label>
          </div>

          {/* Rest of your existing JSX remains the same */}
          {fileName && !isUploading && (
            <div className={`mt-3 flex items-center justify-between rounded-xl border p-3 ${isDark ? 'border-teal-900/40 bg-teal-950/30' : 'border-green-200 bg-green-50'}`}>
              <div className="flex items-center space-x-2">
                <svg className={`h-5 w-5 ${isDark ? 'text-teal-300' : 'text-green-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className={`${isDark ? 'text-teal-200' : 'text-green-800'} truncate text-sm font-medium`}>
                  <Translated text={fileName} />
                </span>
              </div>
              <svg className={`h-4 w-4 ${isDark ? 'text-teal-300' : 'text-green-600'}`} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          )}

          {/* Upload Progress */}
          {isUploading && (
            <div className="mt-4 space-y-2">
              <div className={`${isDark ? 'text-slate-300' : 'text-gray-600'} flex justify-between text-sm`}>
                <span><Translated text="Uploading" /> {fileName}...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className={`${isDark ? 'bg-gray-700' : 'bg-gray-200'} h-2 w-full rounded-full`}>
                <div
                  className="h-2 rounded-full bg-slate-600 transition-all duration-300 ease-out"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Uploaded URL and Actions */}
          {uploadedUrl && !isUploading && (
            <div className="mt-3 space-y-3">
              <div className={`rounded-xl border p-3 ${isDark ? 'border-teal-900/40 bg-teal-950/30' : 'border-slate-200 bg-slate-50'}`}>
                <p className={`${isDark ? 'text-teal-100' : 'text-slate-700'} mb-2 text-sm font-medium`}>
                  {currentValue ? <Translated text="✅ PDF Updated Successfully!" /> : <Translated text="✅ PDF Uploaded Successfully!" />}
                </p>

                <div className="flex flex-wrap gap-2">
                  <a
                    href={uploadedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center rounded-md border border-transparent bg-slate-600 px-3 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-slate-700"
                  >
                    <Translated text="View PDF" />
                  </a>

                  <a
                    href={uploadedUrl}
                    download={fileName}
                    className={`inline-flex items-center rounded-md border px-3 py-2 text-sm font-medium transition-colors duration-200 ${isDark ? 'border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800' : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'}`}
                  >
                    <Translated text="Download" />
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <p className="mt-2 flex items-center text-sm text-red-500">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error.message || <Translated text="PDF upload is required" />}
            </p>
          )}

          {/* Reset Button */}
          {(uploadedUrl || fileName) && !isUploading && (
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={handleReset}
                className={`inline-flex items-center rounded-md border px-3 py-2 text-sm font-medium leading-4 shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 ${isDark ? 'border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800' : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'}`}
              >
                <Translated text="Remove PDF" />
              </button>
            </div>
          )}
        </div>
      )}
    />
  );
}

export default RHFPDFUpload;