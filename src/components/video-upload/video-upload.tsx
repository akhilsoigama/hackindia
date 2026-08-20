import React, { useState, useRef, ChangeEvent } from 'react';
import axios, { AxiosProgressEvent } from 'axios';
import { createFFmpeg, FFmpeg } from '@ffmpeg/ffmpeg';

interface CloudinaryResponse {
    public_id: string;
    secure_url: string;
    format: string;
    bytes: number;
    width: number;
    height: number;
    duration: number;
}

interface FFmpegProgress {
    ratio: number;
}

const VideoUpload: React.FC = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>('');
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [compressionProgress, setCompressionProgress] = useState(0);
    const [uploadedVideo, setUploadedVideo] = useState<CloudinaryResponse | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Handle file selection
    const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('video/')) {
            alert('Please select a video file');
            return;
        }

        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(file));
    };

    // Load FFmpeg
    const loadFFmpeg = async (): Promise<FFmpeg> => {
        const ffmpeg = createFFmpeg({
            log: true,
            progress: ({ ratio }: FFmpegProgress) => {
                setCompressionProgress(Math.round(ratio * 100));
            },
        });
        await ffmpeg.load();
        return ffmpeg;
    };

    // Convert File to Uint8Array
    const fetchFileAsUint8Array = async (file: File): Promise<Uint8Array> => {
        const buffer = await file.arrayBuffer();
        return new Uint8Array(buffer);
    };

    // Compress video
   const compressVideo = async (file: File): Promise<File> => {
    setCompressionProgress(0);
    const ffmpeg = await loadFFmpeg();

    ffmpeg.FS('writeFile', 'input.mp4', await fetchFileAsUint8Array(file));

    await ffmpeg.run(
        '-i', 'input.mp4',
        '-c:v', 'libx264',
        '-crf', '28',
        '-preset', 'slow',
        '-profile:v', 'baseline',
        '-level', '3.0',
        '-maxrate', '800k',
        '-bufsize', '1600k',
        '-vf', 'scale=640:-2',
        '-movflags', '+faststart',
        '-c:a', 'aac',
        '-b:a', '64k',
        '-ac', '1',
        '-ar', '22050',
        'output.mp4'
    );

    const data = ffmpeg.FS('readFile', 'output.mp4');

    const properArrayBuffer: ArrayBuffer = new Uint8Array(data).buffer;
    const blob = new Blob([properArrayBuffer], { type: 'video/mp4' });
    const compressedFile = new File([blob], 'compressed-video.mp4', { type: 'video/mp4' });
    setCompressionProgress(100);
    return compressedFile;
};


    // Upload to Cloudinary
    const uploadToCloudinary = async (file: File): Promise<CloudinaryResponse> => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_PRESET);

        const response = await axios.post<CloudinaryResponse>(
            `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/video/upload`,
            formData,
            {
                headers: { 'Content-Type': 'multipart/form-data' },
                onUploadProgress: (progressEvent: AxiosProgressEvent) => {
                    if (progressEvent.total) {
                        setUploadProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total));
                    }
                },
            }
        );
        return response.data;
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            alert('Please select a video file first');
            return;
        }

        const maxSize = 100 * 1024 * 1024; // 100 MB
        if (selectedFile.size > maxSize) {
            alert('File size too large. Max 100MB allowed');
            return;
        }

        setUploading(true);
        setUploadProgress(0);
        setCompressionProgress(0);

        try {
            const compressedFile = await compressVideo(selectedFile);
            const uploaded = await uploadToCloudinary(compressedFile);
            setUploadedVideo(uploaded);

            if (previewUrl) URL.revokeObjectURL(previewUrl);
            alert('Upload successful!');
        } catch (error) {
            console.error('Upload failed', error);
            alert('Upload failed. Check console for details.');
        } finally {
            setUploading(false);
        }
    };

    const handleReset = () => {
        setSelectedFile(null);
        setPreviewUrl('');
        setUploadedVideo(null);
        setUploadProgress(0);
        setCompressionProgress(0);

        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <div className="mt-5 mx-auto max-w-2xl">
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Upload & Compress Video</h2>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Select video file</label>
                    <input
                        type="file"
                        accept="video/*"
                        onChange={handleFileSelect}
                        ref={fileInputRef}
                        disabled={uploading}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    <p className="text-xs text-gray-400 mt-1">Supported formats: MP4, MOV, AVI (max 100MB)</p>
                </div>

                {previewUrl && (
                    <div className="mb-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-3">Preview</h3>
                        <video controls className="w-full rounded-xl shadow-md border border-gray-200" src={previewUrl} />
                    </div>
                )}

                {compressionProgress > 0 && compressionProgress < 100 && (
                    <div className="mb-4">
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                            <span>Compressing video...</span>
                            <span>{compressionProgress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${compressionProgress}%` }}
                            />
                        </div>
                    </div>
                )}

                {uploadProgress > 0 && uploadProgress < 100 && (
                    <div className="mb-4">
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                            <span>Uploading...</span>
                            <span>{uploadProgress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-green-400 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${uploadProgress}%` }}
                            />
                        </div>
                    </div>
                )}

                <div className="flex gap-4 mt-4">
                    <button
                        onClick={handleUpload}
                        disabled={!selectedFile || uploading}
                        className="flex-1 bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors"
                    >
                        {uploading ? 'Processing...' : 'Upload Video'}
                    </button>
                    <button
                        onClick={handleReset}
                        disabled={uploading}
                        className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl hover:bg-gray-200 disabled:opacity-50 transition-colors"
                    >
                        Reset
                    </button>
                </div>
            </div>

            {uploadedVideo && (
                <div className="bg-white rounded-2xl shadow-lg p-8">
                    <h3 className="text-2xl font-bold text-green-600 mb-4">✅ Video Uploaded Successfully!</h3>
                    <video controls className="w-full rounded-xl shadow-md border border-gray-200" src={uploadedVideo.secure_url} />
                    <p className="mt-2 text-sm text-gray-600 truncate">{uploadedVideo.secure_url}</p>
                </div>
            )}
        </div>
    );
};

export default VideoUpload;
