import React, { useEffect, useState } from 'react';
import { useDropzone, FileRejection } from 'react-dropzone';
import { Box, Typography, IconButton, CircularProgress } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

interface UploadedVideo {
  file: File | null;
  preview: string;
  cloudinaryUrl: string;
  publicId: string | null;
}

interface VideoDropZoneProps {
  value?: string[] | string;
  onChange: (urls: string[] | string) => void;
  placeholderText?: string;
  maxSize?: number;
  maxFiles?: number;
  height?: string | number;
  width?: string | number;
  multiple?: boolean;
}
interface CloudinaryVideoUploadResponse {
  asset_id: string;
  public_id: string;
  version: number;
  version_id: string;
  signature: string;
  width?: number;
  height?: number;
  format?: string;
  resource_type: string; // should be "video"
  created_at: string;
  bytes: number;
  type: string;
  etag: string;
  placeholder: boolean;
  url: string;
  secure_url: string;
  original_filename: string;
  folder?: string;
}

const VideoDropZone: React.FC<VideoDropZoneProps> = ({
  value = [],
  onChange,
  placeholderText = 'Drag & drop videos here, or click to select',
  maxSize = 500 * 1024 * 1024, // default 500MB
  maxFiles = 3,
  height = '300px',
  width = '100%',
  multiple = false,
}) => {
  const [videos, setVideos] = useState<UploadedVideo[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const uploadToCloudinary = async (file: File): Promise<CloudinaryVideoUploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', import.meta.env.VITE_PUBLIC_CLOUDINARY_UPLOAD_PRESET || '');

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_PUBLIC_CLOUDINARY_CLOUD_NAME}/video/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) throw new Error('Failed to upload video to Cloudinary');
    return await response.json();
  };

  const onDrop = async (acceptedFiles: File[], fileRejections: FileRejection[]) => {
    if (fileRejections.length > 0) {
      alert(`Some files were rejected. Max size: ${maxSize / 1024 / 1024}MB`);
      return;
    }
    if (videos.length >= maxFiles) return;

    setIsUploading(true);

    try {
      const validFiles = acceptedFiles.slice(0, maxFiles - videos.length);
      const newVideos: UploadedVideo[] = [];

      for (const file of validFiles) {
        try {
          const cloudinaryResponse = await uploadToCloudinary(file);
          const preview = URL.createObjectURL(file);

          newVideos.push({
            file,
            preview,
            cloudinaryUrl: cloudinaryResponse.secure_url,
            publicId: cloudinaryResponse.public_id,
          });
        } catch (err) {
          console.error('Error uploading video:', err);
        }
      }

      const updatedVideos = [...videos, ...newVideos];
      setVideos(updatedVideos);
      onChange(updatedVideos.map((v) => v.cloudinaryUrl));
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = async (index: number) => {
    const videoToRemove = videos[index];
    const newVideos = [...videos];
    newVideos.splice(index, 1);

    if (videoToRemove.preview && videoToRemove.file) {
      URL.revokeObjectURL(videoToRemove.preview);
    }

    setVideos(newVideos);
    const urlsToSend = newVideos.map((v) => v.cloudinaryUrl);
    onChange(multiple ? urlsToSend : urlsToSend[0] || '');
  };

  useEffect(() => {
    if (value) {
      const initialVideos: UploadedVideo[] = (Array.isArray(value) ? value : [value])
        .filter((url): url is string => !!url)
        .map((url) => ({
          cloudinaryUrl: url,
          preview: url,
          file: null,
          publicId: null,
        }));
      setVideos(initialVideos);
    }
  }, [value]);

  useEffect(() => {
    return () => {
      videos.forEach((v) => {
        if (v.preview && v.file) {
          URL.revokeObjectURL(v.preview);
        }
      });
    };
  }, [videos]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'video/mp4': ['.mp4'],
      'video/quicktime': ['.mov'],
      'video/x-msvideo': ['.avi'],
      'video/webm': ['.webm'],
      'video/x-matroska': ['.mkv'],
    },
    maxSize,
    maxFiles,
    multiple,
    onDrop,
    disabled: isUploading || videos.length >= maxFiles,
  });

  return (
    <Box sx={{ width, height }}>
      <Box
        {...getRootProps()}
        sx={{
          border: '2px dashed',
          borderRadius: '8px',
          p: 3,
          textAlign: 'center',
          cursor: videos.length >= maxFiles ? 'not-allowed' : 'pointer',
          transition: 'all 0.3s ease',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          backgroundColor: isDragActive ? 'action.hover' : 'background.paper',
          borderColor: isDragActive ? 'primary.main' : 'divider',
          '&:hover': {
            borderColor: videos.length >= maxFiles ? 'divider' : 'primary.main',
          },
        }}
      >
        <input {...getInputProps()} />

        {isUploading ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <CircularProgress size={60} thickness={4} />
            <Typography variant="body2" sx={{ mt: 2 }}>
              Uploading...
            </Typography>
          </Box>
        ) : videos.length > 0 ? (
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 2,
              maxHeight: '100%',
              overflow: 'auto',
            }}
          >
            {videos.map((vid, index) => (
              <Box
                key={index}
                sx={{
                  width: { xs: '100%', sm: '48%', md: '30%' },
                  minWidth: 200,
                  position: 'relative',
                  height: 180,
                  flexGrow: 1,
                }}
              >
                <Box
                  component="video"
                  src={vid.preview}
                  controls
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '4px',
                    border: '1px solid',
                    borderColor: 'divider',
                  }}
                />
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(index);
                  }}
                  sx={{
                    position: 'absolute',
                    top: 4,
                    right: 4,
                    backgroundColor: 'background.paper',
                    '&:hover': { backgroundColor: 'action.hover' },
                  }}
                  size="small"
                >
                  <DeleteIcon color="error" fontSize="small" />
                </IconButton>
              </Box>
            ))}
            {videos.length < maxFiles && (
              <Box
                sx={{
                  width: { xs: '100%', sm: '48%', md: '30%' },
                  minWidth: 200,
                  height: 180,
                  border: '1px dashed',
                  borderColor: 'divider',
                  borderRadius: '4px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'action.hover',
                }}
              >
                <CloudUploadIcon color="action" />
                <Typography variant="caption" color="text.secondary">
                  Add more
                </Typography>
              </Box>
            )}
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <CloudUploadIcon sx={{ fontSize: 48, color: 'action.active', mb: 1 }} />
            <Typography variant="body1" color="text.secondary" gutterBottom>
              {placeholderText}
            </Typography>
            <Typography variant="caption" color="text.disabled">
              Supported formats: MP4, MOV, AVI, WEBM, MKV (Max {maxSize / 1024 / 1024}MB each)
            </Typography>
          </Box>
        )}
      </Box>

      {videos.length > 0 && (
        <Typography
          variant="caption"
          sx={{ display: 'block', mt: 1, textAlign: 'center' }}
          className="dark:text-white text-black"
        >
          {videos.length}/{maxFiles} videos uploaded
        </Typography>
      )}
    </Box>
  );
};

export default VideoDropZone;
