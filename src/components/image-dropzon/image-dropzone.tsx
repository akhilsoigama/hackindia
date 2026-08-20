'use client';
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
  value?: string; 
  onChange: (url: string) => void;
  placeholderText?: string;
  maxSize?: number;
  height?: string | number;
  width?: string | number;
}

const ImageDropZone: React.FC<ImageDropZoneProps> = ({
  value,
  onChange,
  placeholderText = 'Drag & drop image here, or click to select',
  maxSize = 5 * 1024 * 1024,
  height = '300px',
  width = '100%',
}) => {
  const [image, setImage] = useState<UploadedImage | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const uploadToCloudinary = async (file: File): Promise<{ secure_url: string; public_id: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_PRESET || '');

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
      { method: 'POST', body: formData }
    );

    if (!response.ok) throw new Error('Failed to upload image to Cloudinary');
    return await response.json();
  };

  const compressImage = async (file: File): Promise<File> => {
    const options = { maxSizeMB: 1, maxWidthOrHeight: 1920, useWebWorker: true };
    return await imageCompression(file, options);
  };

  // ✅ Handle Drop
  const onDrop = async (acceptedFiles: File[], fileRejections: FileRejection[]) => {
    if (fileRejections.length > 0) {
      alert(`Some files were rejected. Max size: ${maxSize / 1024 / 1024}MB`);
      return;
    }

    const file = acceptedFiles[0];
    if (!file) return;

    setIsUploading(true);

    try {
      const compressed = await compressImage(file);
      const preview = URL.createObjectURL(compressed);

      setImage({
        file: compressed,
        preview,
        cloudinaryUrl: '',
        publicId: null,
      });

      const cloudinaryResponse = await uploadToCloudinary(compressed);
      setImage({
        file: compressed,
        preview,
        cloudinaryUrl: cloudinaryResponse.secure_url,
        publicId: cloudinaryResponse.public_id,
      });

      onChange(cloudinaryResponse.secure_url);
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  // ✅ Remove Image
  const handleRemove = () => {
    if (image?.preview && image.file) URL.revokeObjectURL(image.preview);
    setImage(null);
    onChange('');
  };

  useEffect(() => {
    if (value) {
      setImage({
        file: null,
        preview: value,
        cloudinaryUrl: value,
        publicId: null,
      });
    } else {
      setImage(null);
    }
  }, [value]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/jpeg': ['.jpeg', '.jpg'],
      'image/png': ['.png'],
      'image/gif': ['.gif'],
      'image/webp': ['.webp'],
    },
    maxSize,
    multiple: false,
    onDrop,
    disabled: isUploading || !!image,
  });

  return (
    <Box sx={{ width, height, position: 'relative' }}>
      <Box
        {...getRootProps()}
        sx={{
          border: '2px dashed',
          borderRadius: '8px',
          height: '100%',
          padding:2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          cursor: image ? 'not-allowed' : 'pointer',
          transition: '0.3s',
          backgroundColor: isDragActive ? 'action.hover' : 'background.paper',
          borderColor: isDragActive ? 'primary.main' : 'divider',
          overflow: 'hidden',
        }}
      >
        <input {...getInputProps()} />

        {isUploading ? (
          <Box sx={{ textAlign: 'center' }}>
            <CircularProgress size={60} thickness={4} />
            <Typography variant="body2" sx={{ mt: 1 }}>
              Uploading...
            </Typography>
          </Box>
        ) : image ? (
          <Box sx={{ width: '100%', height: '100%', position: 'relative' }}>
            <Box
              component="img"
              src={image.preview}
              alt="Preview"
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: '8px',
                border: '1px solid',
                borderColor: 'divider',
              }}
            />
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                handleRemove();
              }}
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                backgroundColor: 'background.paper',
                '&:hover': { backgroundColor: 'action.hover' },
              }}
              size="small"
            >
              <DeleteIcon color="error" fontSize="small" />
            </IconButton>
          </Box>
        ) : (
          <Box sx={{ textAlign: 'center' }}>
            <CloudUploadIcon sx={{ fontSize: 48, color: 'action.active', mb: 1 }} />
            <Typography variant="body1" color="text.secondary" gutterBottom>
              {placeholderText}
            </Typography>
            <Typography variant="caption" color="text.disabled">
              Supported: JPG, PNG, GIF, WEBP (Max {maxSize / 1024 / 1024}MB)
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ImageDropZone;
