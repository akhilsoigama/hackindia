import React, { useEffect, useState } from 'react';
import { useDropzone, FileRejection } from 'react-dropzone';
import imageCompression from 'browser-image-compression';
import { Box, Typography, IconButton, CircularProgress } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

interface UploadedImage {
  file: File | null;
  preview: string;
  cloudinaryUrl: string;
  publicId: string | null;
}

interface ImageDropZoneProps {
  value?: string[] | string;
  onChange: (urls: string[] | string) => void;
  placeholderText?: string;
  maxSize?: number;
  maxFiles?: number;
  height?: string | number;
  width?: string | number;
  multiple?: boolean;
}
interface CloudinaryUploadResponse {
  asset_id: string;
  public_id: string;
  version: number;
  version_id: string;
  signature: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string;
  tags: string[];
  bytes: number;
  type: string;
  etag: string;
  placeholder: boolean;
  url: string;
  secure_url: string;
  original_filename: string;
}

const ImageDropZone: React.FC<ImageDropZoneProps> = ({
  value = [],
  onChange,
  placeholderText = 'Drag & drop images here, or click to select',
  maxSize = 5 * 1024 * 1024,
  maxFiles = 5,
  height = '300px',
  width = '100%',
  multiple = false,
}) => {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const uploadToCloudinary = async (file: File): Promise<CloudinaryUploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', import.meta.env.VITE_PUBLIC_CLOUDINARY_UPLOAD_PRESET || '');

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) throw new Error('Failed to upload image to Cloudinary');
    return await response.json();
  };

  const compressImage = async (file: File): Promise<File> => {
    const options = { maxSizeMB: 1, maxWidthOrHeight: 1920, useWebWorker: true };
    return await imageCompression(file, options);
  };

  const onDrop = async (acceptedFiles: File[], fileRejections: FileRejection[]) => {
    if (fileRejections.length > 0) {
      alert(`Some files were rejected. Max size: ${maxSize / 1024 / 1024}MB`);
      return;
    }
    if (images.length >= maxFiles) return;

    setIsUploading(true);

    try {
      const validFiles = acceptedFiles.slice(0, maxFiles - images.length);
      const newImages: UploadedImage[] = [];

      for (const file of validFiles) {
        try {
          const compressed = await compressImage(file);
          const cloudinaryResponse = await uploadToCloudinary(compressed);
          const preview = URL.createObjectURL(compressed);

          newImages.push({
            file: compressed,
            preview,
            cloudinaryUrl: cloudinaryResponse.secure_url,
            publicId: cloudinaryResponse.public_id,
          });
        } catch (err) {
          console.error('Error processing image:', err);
        }
      }

      const updatedImages = [...images, ...newImages];
      setImages(updatedImages);
      onChange(updatedImages.map((img) => img.cloudinaryUrl));
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = async (index: number) => {
    const imageToRemove = images[index];
    const newImages = [...images];
    newImages.splice(index, 1);

    if (imageToRemove.preview && imageToRemove.file) {
      URL.revokeObjectURL(imageToRemove.preview);
    }

    setImages(newImages);
    const urlsToSend = newImages.map((img) => img.cloudinaryUrl);
    onChange(multiple ? urlsToSend : urlsToSend[0] || '');
  };

  useEffect(() => {
    if (value) {
      const initialImages: UploadedImage[] = (Array.isArray(value) ? value : [value])
        .filter((url): url is string => !!url)
        .map((url) => ({
          cloudinaryUrl: url,
          preview: url,
          file: null,
          publicId: null,
        }));
      setImages(initialImages);
    }
  }, [value]);

  useEffect(() => {
    return () => {
      images.forEach((img) => {
        if (img.preview && img.file) {
          URL.revokeObjectURL(img.preview);
        }
      });
    };
  }, [images]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/jpeg': ['.jpeg', '.jpg'],
      'image/png': ['.png'],
      'image/gif': ['.gif'],
      'image/webp': ['.webp'],
    },
    maxSize,
    maxFiles,
    multiple,
    onDrop,
    disabled: isUploading || images.length >= maxFiles,
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
          cursor: images.length >= maxFiles ? 'not-allowed' : 'pointer',
          transition: 'all 0.3s ease',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          backgroundColor: isDragActive ? 'action.hover' : 'background.paper',
          borderColor: isDragActive ? 'primary.main' : 'divider',
          '&:hover': {
            borderColor: images.length >= maxFiles ? 'divider' : 'primary.main',
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
        ) : images.length > 0 ? (
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 2,
              maxHeight: '100%',
              overflow: 'auto',
            }}
          >
            {images.map((img, index) => (
              <Box
                key={index}
                sx={{
                  width: { xs: '45%', sm: '30%', md: '22%' },
                  minWidth: 120,
                  position: 'relative',
                  height: 120,
                  flexGrow: 1,
                }}
              >
                <Box
                  component="img"
                  src={img.preview}
                  alt={`Preview ${index + 1}`}
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
            {images.length < maxFiles && (
              <Box
                sx={{
                  width: { xs: '45%', sm: '30%', md: '22%' },
                  minWidth: 120,
                  height: 120,
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
              Supported formats: JPG, PNG, GIF, WEBP (Max {maxSize / 1024 / 1024}MB each)
            </Typography>
          </Box>
        )}
      </Box>

      {images.length > 0 && (
        <Typography
          variant="caption"
          sx={{ display: 'block', mt: 1, textAlign: 'center' }}
          className="dark:text-white text-black"
        >
          {images.length}/{maxFiles} images uploaded
        </Typography>
      )}
    </Box>
  );
};

export default ImageDropZone;
