import React, { useState, useRef, ChangeEvent, useEffect, useCallback } from "react";
import axios, { AxiosProgressEvent } from "axios";
import { createFFmpeg, FFmpeg } from "@ffmpeg/ffmpeg";
import { useFormContext } from "react-hook-form";
import { toast } from "sonner";
import { useTheme } from '@/theme/AppThemeProvider';
import { ParticleButton } from "@/components/ui/particle-button";
import { FaUpload, FaRedoAlt, FaSpinner, FaCompress, FaCloudUploadAlt } from "react-icons/fa";

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

let ffmpegInstance: FFmpeg | null = null;

interface VideoUploadProps {
  name?: string;
  onUploadComplete?: (url: string) => void;
}

const VideoUpload: React.FC<VideoUploadProps> = ({
  name = "contentUrl",
  onUploadComplete
}) => {
  const { setValue, watch } = useFormContext();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [compressionProgress, setCompressionProgress] = useState(0);
  const [uploadedVideo, setUploadedVideo] = useState<CloudinaryResponse | null>(null);
  const [ffmpegLoaded, setFfmpegLoaded] = useState(false);
  const [ffmpegLoading, setFfmpegLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { mode } = useTheme();
  const isDark = mode === 'dark';

  const formContentUrl = watch(name);

  const debugCloudinaryConfig = () => {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_PRESET;

    if (!cloudName) {
      toast.error("Cloudinary cloud name is not configured");
    }
    if (!uploadPreset) {
      toast.error("Cloudinary upload preset is not configured");
    }

    return { cloudName, uploadPreset };
  };

  useEffect(() => {
    if (uploadedVideo?.secure_url) {
      setValue(name, uploadedVideo.secure_url);
      onUploadComplete?.(uploadedVideo.secure_url);
    }
  }, [uploadedVideo, setValue, name, onUploadComplete]);

  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("video/")) {
      toast.error("Please select a valid video file");
      return;
    }

    const validTypes = ['video/mp4', 'video/mov', 'video/avi', 'video/mkv', 'video/webm'];
    if (!validTypes.includes(file.type)) {
      toast.error("Please select MP4, MOV, AVI, MKV, or WebM file");
      return;
    }

    setSelectedFile(file);
    setUploadedVideo(null);
    setUploadProgress(0);
    setCompressionProgress(0);

    if (file.size > 1 * 1024 * 1024 && !ffmpegLoaded && !ffmpegLoading) {
      preloadFFmpeg();
    }
  };

  const preloadFFmpeg = useCallback(async (): Promise<FFmpeg> => {
    if (ffmpegInstance && ffmpegLoaded) {
      return ffmpegInstance;
    }

    setFfmpegLoading(true);

    try {
      const baseUrl = window.location.origin;
      const corePathOptions = [
        `${baseUrl}/ffmpeg/ffmpeg-core.js`,
        'https://unpkg.com/@ffmpeg/core@0.12.6/dist/ffmpeg-core.js',
        'https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.6/dist/ffmpeg-core.js'
      ];

      let ffmpeg: FFmpeg | null = null;
      let lastError: Error | null = null;

      for (const corePath of corePathOptions) {
        try {
          ffmpeg = createFFmpeg({
            log: true,
            corePath,
            progress: ({ ratio }: FFmpegProgress) => {
              const progress = Math.round(ratio * 100);
              setCompressionProgress(progress);
            },
          });

          await ffmpeg.load();
          break;
        } catch (error) {
          lastError = error as Error;
          continue;
        }
      }

      if (!ffmpeg) {
        throw lastError || new Error("All FFmpeg CDN attempts failed");
      }

      ffmpegInstance = ffmpeg;
      setFfmpegLoaded(true);
      setFfmpegLoading(false);
      return ffmpeg;
    } catch (err) {
      setFfmpegLoaded(false);
      setFfmpegLoading(false);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      throw new Error(`FFmpeg load failed: ${errorMessage}`);
    }
  }, [ffmpegLoaded]);

  const compressVideo = async (file: File): Promise<File> => {
    setCompressionProgress(0);

    try {
      const ffmpeg = await preloadFFmpeg();

      const inputData = await file.arrayBuffer();
      ffmpeg.FS("writeFile", "input.mp4", new Uint8Array(inputData));

      const compressionArgs = [
        "-i", "input.mp4",
        "-c:v", "libx264",
        "-crf", "28",
        "-preset", "medium",
        "-vf", "scale='min(720,iw)':-2",
        "-movflags", "+faststart",
        "-c:a", "aac",
        "-b:a", "128k",
        "-max_muxing_queue_size", "1024",
        "-y",
        "output.mp4"
      ];

      await ffmpeg.run(...compressionArgs);

      const outputData = ffmpeg.FS("readFile", "output.mp4");

      if (outputData.length === 0) {
        throw new Error("Compression produced empty file");
      }

      const blob = new Blob([new Uint8Array(outputData)], {
        type: "video/mp4"
      });

      const compressedFile = new File([blob], `compressed_${file.name}`, {
        type: "video/mp4",
        lastModified: Date.now()
      });
      
      try {
        ffmpeg.FS("unlink", "input.mp4");
        ffmpeg.FS("unlink", "output.mp4");
      } catch (cleanupError) {
        console.warn('FFmpeg cleanup failed:', cleanupError);
      }

      setCompressionProgress(100);
      return compressedFile;
    } catch (error) {
      console.error('Video compression failed:', error);
      toast.warning("Compression failed, uploading original file");
      return file;
    }
  };

  const uploadToCloudinary = async (file: File): Promise<CloudinaryResponse> => {
    const { cloudName, uploadPreset } = debugCloudinaryConfig();

    if (!cloudName || !uploadPreset) {
      const errorMsg = `Cloudinary configuration missing. Cloud: ${cloudName}, Preset: ${uploadPreset}`;
      console.error('❌', errorMsg);
      throw new Error(errorMsg);
    }

    if (!file || file.size === 0) {
      throw new Error("File is empty or invalid");
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);
    formData.append("resource_type", "video");
    
    try {
      const response = await axios.post<CloudinaryResponse>(
        `https://api.cloudinary.com/v1_1/${cloudName}/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          timeout: 300000,
          onUploadProgress: (progressEvent: AxiosProgressEvent) => {
            if (progressEvent.total && progressEvent.total > 0) {
              const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              setUploadProgress(progress);
              console.log('📤 Upload progress:', progress + '%');
            }
          },
        }
      );

      return response.data;
    } catch (error: unknown) {
      console.error('❌ Cloudinary upload failed:', error);

      if (axios.isAxiosError(error) && error.response) {
        console.error('📋 Cloudinary response error:', {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers
        });
      }

      throw error;
    }
  };

  const handleUpload = async () => {
    debugCloudinaryConfig();

    if (!selectedFile) {
      toast.error("Please select a video first!");
      return;
    }

    if (selectedFile.size > 500 * 1024 * 1024) {
      toast.error("File too large (Max 500MB allowed)");
      return;
    }

    if (selectedFile.size === 0) {
      toast.error("File is empty");
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    setCompressionProgress(0);

    try {
      let fileToUpload = selectedFile;
      let usedCompression = false;

      if (selectedFile.size > 1 * 1024 * 1024) {
        try {
          toast.info("Compressing video... This may take a moment.");
          fileToUpload = await compressVideo(selectedFile);
          usedCompression = true;
          toast.success("Compression completed!");
        } catch (compressionError) {
          console.warn('Compression failed, using original file:', compressionError);
          toast.warning("Compression skipped, uploading original file");
          fileToUpload = selectedFile;
          usedCompression = false;
        }
      } else {
        toast.info("File is small, skipping compression...");
      }

      toast.info("Uploading to Cloudinary...");
      const uploaded = await uploadToCloudinary(fileToUpload);
      setUploadedVideo(uploaded);

      const successMessage = `Video uploaded successfully! ${usedCompression ? '(Compressed)' : '(Original)'}`;
      toast.success(successMessage);

    } catch (error: unknown) {
      console.error('Upload process failed:', error);

      if (axios.isAxiosError(error)) {
        const cloudinaryError = (error.response?.data as { error?: { message?: string } } | undefined)?.error;
        const cloudinaryMessage = cloudinaryError?.message;

        switch (cloudinaryMessage) {
          case 'Upload preset required':
            toast.error("Cloudinary upload preset is missing or invalid");
            break;
          case 'Invalid Cloud Name':
            toast.error("Invalid Cloudinary cloud name configuration");
            break;
          case 'File is empty':
            toast.error("The file appears to be empty");
            break;
          case 'Upload preset not found':
            toast.error("Upload preset not found. Check Cloudinary dashboard.");
            break;
          default:
            if (cloudinaryMessage) {
              toast.error(`Cloudinary error: ${cloudinaryMessage}`);
            } else if (error.code === 'NETWORK_ERROR') {
              toast.error("Network error. Please check your internet connection.");
            } else if (error.code === 'TIMEOUT_ERROR') {
              toast.error("Upload timeout. Please try again.");
            } else {
              toast.error(`Upload failed: ${error.message || 'Unknown error'}`);
            }
        }
      } else if (error instanceof Error) {
        toast.error(`Upload failed: ${error.message || 'Unknown error'}`);
      } else {
        toast.error("Upload failed: Unknown error");
      }
    } finally {
      setUploading(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setUploadedVideo(null);
    setUploadProgress(0);
    setCompressionProgress(0);
    setValue(name, "");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  useEffect(() => {
    let mounted = true;

    const preloadIfNeeded = async () => {
      try {
        if (!ffmpegLoaded && !ffmpegLoading && mounted) {
          await preloadFFmpeg();
        }
      } catch (error) {
        console.log('FFmpeg preload failed (will load on demand):', error);
      }
    };

    preloadIfNeeded();

    return () => {
      mounted = false;
    };
  }, [ffmpegLoaded, ffmpegLoading, preloadFFmpeg]);

  return (
    <div className="my-8 mx-auto max-w-2xl">
      <div className={`rounded-2xl border p-6 shadow-md transition-colors duration-300 ${isDark ? 'border-slate-700 bg-slate-900 text-slate-100' : 'border-slate-200 bg-white text-slate-800'}`}>
        <h2 className={`mb-4 text-2xl font-bold ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
          🎥 Upload & Compress Video
        </h2>

        <div className={`mb-5 rounded-xl p-4 ${isDark ? 'border-slate-900/40 bg-slate-950/30' : 'border-slate-100 bg-slate-50'}`}>
          <p className={`text-sm ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
            <strong>Supported formats:</strong> MP4, MOV, AVI, MKV, WebM<br />
            <strong>Max file size:</strong> 500MB<br />
            <strong>Auto-compression:</strong> Files over 1MB will be compressed to 720p
          </p>
        </div>

        <input
          type="file"
          accept="video/mp4,video/mov,video/avi,video/mkv,video/webm"
          onChange={handleFileSelect}
          ref={fileInputRef}
          disabled={uploading}
          className={`block w-full text-sm ${isDark ? 'text-slate-300 file:bg-slate-900/40 file:text-slate-100 hover:file:bg-slate-900/60' : 'text-slate-500 file:bg-slate-50 file:text-slate-700 hover:file:bg-slate-100'} file:mr-4 file:rounded-full file:border-0 file:px-4 file:py-2 file:text-sm file:font-semibold disabled:opacity-50`}
        />

        {selectedFile && (
          <div className={`mt-4 rounded-xl border p-4 ${isDark ? 'border-slate-700 bg-slate-800/70' : 'border-slate-200 bg-slate-50'}`}>
            <p className={`text-sm font-medium ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>Selected file: {selectedFile.name}</p>
            <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
            </p>
            {selectedFile.size > 1 * 1024 * 1024 && (
              <div className="mt-2">
                {ffmpegLoading && (
                  <p className={`text-sm ${isDark ? 'text-amber-300' : 'text-yellow-600'}`}>
                    <FaSpinner className="inline mr-1 animate-spin" /> Loading FFmpeg for compression...
                  </p>
                )}
                {!ffmpegLoaded && !ffmpegLoading && (
                  <p className={`text-sm ${isDark ? 'text-orange-300' : 'text-orange-600'}`}>
                    ⚠️ FFmpeg not available - will upload original file
                  </p>
                )}
                {ffmpegLoaded && (
                  <p className={`text-sm ${isDark ? 'text-emerald-300' : 'text-green-600'}`}>
                    ✅ FFmpeg ready for compression
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Compression Progress */}
        {(compressionProgress > 0 && compressionProgress < 100) && (
          <div className="mt-4">
            <p className={`text-sm mb-1 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              <FaCompress className="inline mr-1" /> Compressing... {compressionProgress}%
            </p>
            <div className={`h-2 w-full rounded-full ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
              <div
                className="h-2 rounded-full bg-yellow-500 transition-all duration-300"
                style={{ width: `${compressionProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Upload Progress */}
        {(uploadProgress > 0 && uploadProgress < 100) && (
          <div className="mt-4">
            <p className={`text-sm mb-1 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              <FaCloudUploadAlt className="inline mr-1" /> Uploading... {uploadProgress}%
            </p>
            <div className={`h-2 w-full rounded-full ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
              <div
                className="h-2 rounded-full bg-green-500 transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Success Indicator */}
        {formContentUrl && (
          <div className={`mt-4 rounded-xl border p-3 ${isDark ? 'border-emerald-900/40 bg-emerald-950/30' : 'border-green-200 bg-green-50'}`}>
            <p className={`text-sm font-medium ${isDark ? 'text-emerald-200' : 'text-green-700'}`}>
              ✅ Video URL ready in form
            </p>
            {uploadedVideo && (
              <p className={`mt-1 text-xs ${isDark ? 'text-emerald-300' : 'text-green-600'}`}>
                Duration: {uploadedVideo.duration ? Math.round(uploadedVideo.duration) + 's' : 'N/A'} |
                Size: {(uploadedVideo.bytes / 1024 / 1024).toFixed(2)}MB
              </p>
            )}
          </div>
        )}

        {/* Action Buttons with ParticleButton */}
        <div className="flex gap-4 mt-6">
          <ParticleButton
            onClick={handleUpload}
            disabled={!selectedFile || uploading}
             className={`px-4 flex  items-center justify-center py-2 rounded-lg font-medium text-sm transition-all whitespace-nowrap ${
                    isDark
                      ? "bg-white text-slate-900 hover:bg-slate-100 shadow-sm"
                      : "bg-slate-800/80 text-white hover:bg-slate-800 shadow-sm"
                  }`}
            successDuration={800}
          >
            {uploading ? (
              <span className="flex items-center justify-center">
                <FaSpinner className="animate-spin mr-2 h-4 w-4" />
                Processing...
              </span>
            ) : (
              <span className="flex items-center justify-center">
                <FaUpload className="mr-2" />
                Upload Video
              </span>
            )}
          </ParticleButton>

          <ParticleButton
            onClick={handleReset}
            disabled={uploading}
            className={`flex items-center px-4 py-2 border rounded-lg text-sm font-medium ${isDark ? "text-slate-200 bg-slate-900 border-slate-800 hover:bg-slate-800" : "text-slate-700 bg-white border-slate-200 hover:bg-slate-50"}`}
            successDuration={600}
          >
            <span className="flex items-center justify-center">
              <FaRedoAlt className="mr-2" />
              Reset
            </span>
          </ParticleButton>
        </div>
      </div>
    </div>
  );
};

export default VideoUpload;