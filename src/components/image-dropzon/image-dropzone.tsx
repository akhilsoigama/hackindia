'use client';
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useDropzone, FileRejection } from 'react-dropzone';
import imageCompression from 'browser-image-compression';
import { Box, Typography, IconButton, CircularProgress } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { toast } from 'sonner';
import { Translated } from '../common/translator/translator';
import { useTheme } from '@/theme/AppThemeProvider';

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
  objectFit?: 'cover' | 'contain' | 'fill' | 'scale-down';
}

const ImageDropZone: React.FC<ImageDropZoneProps> = ({
  value,
  onChange,
  placeholderText = <Translated text="Drag & drop image here, or click to select" />,
  maxSize = 5 * 1024 * 1024,
  height = '300px',
  width = '100%',
  objectFit = 'contain',
}) => {
  const [image, setImage] = useState<UploadedImage | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const { mode } = useTheme();
  const isDark = mode === 'dark';

  const uploadToCloudinary = useCallback(async (file: File): Promise<{ secure_url: string; public_id: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_PRESET || '');

    formData.append('folder', 'nabha-learn');
    formData.append('tags', 'user_upload');

    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    if (!cloudName) {
      throw new Error('Cloudinary cloud name is not configured');
    }

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
        mode: 'cors',
        credentials: 'omit'
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Cloudinary upload error:', errorData);
      throw new Error(`Cloudinary upload failed: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
    }

    return await response.json();
  }, []);

  const compressImage = useCallback(async (file: File): Promise<File> => {
    try {
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        fileType: file.type
      };
      return await imageCompression(file, options);
    } catch (error) {
      console.warn('Image compression failed, using original file:', error);
      return file;
    }
  }, []);

  const onDrop = useCallback(async (acceptedFiles: File[], fileRejections: FileRejection[]) => {
    if (fileRejections.length > 0) {
      const rejection = fileRejections[0];
      if (rejection.errors.some(error => error.code === 'file-too-large')) {
        toast.error(`${<Translated text="File too large. Max size:" />} ${maxSize / 1024 / 1024}MB`);
      } else if (rejection.errors.some(error => error.code === 'file-invalid-type')) {
        toast.error(<Translated text="Invalid file type. Please use JPG, PNG, GIF, or WEBP." />);
      } else {
        toast.error(<Translated text="File rejected. Please try another file." />);
      }
      return;
    }

    const file = acceptedFiles[0];
    if (!file) return;

    setIsUploading(true);
    setImageLoaded(false);

    try {
      const localPreview = URL.createObjectURL(file);

      setImage({
        file: file,
        preview: localPreview,
        cloudinaryUrl: '',
        publicId: null,
      });

      const compressed = await compressImage(file);
      const cloudinaryResponse = await uploadToCloudinary(compressed);

      const cloudinaryUrl = cloudinaryResponse.secure_url;

      URL.revokeObjectURL(localPreview);

      setImage({
        file: compressed,
        preview: cloudinaryUrl,
        cloudinaryUrl: cloudinaryUrl,
        publicId: cloudinaryResponse.public_id,
      });

      onChange(cloudinaryUrl);
      toast.success(<Translated text="Image uploaded successfully!" />);
    } catch (error: unknown) {
      console.error('Upload error:', error);

      if (image?.preview.startsWith('blob:')) {
        URL.revokeObjectURL(image.preview);
      }

      setImage(null);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast.error(<Translated text="Failed to upload image:" /> + ` ${errorMessage}`);
    } finally {
      setIsUploading(false);
    }
  }, [maxSize, compressImage, uploadToCloudinary, onChange, image?.preview]);

  const handleRemove = useCallback((e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }

    if (image?.preview && image.preview.startsWith('blob:')) {
      URL.revokeObjectURL(image.preview);
    }
    setImage(null);
    setImageLoaded(false);
    onChange('');
    toast.info(<Translated text="Image removed" />);
  }, [onChange, image?.preview]);

  useEffect(() => {
    if (value && value !== image?.cloudinaryUrl) {
      setImage({
        file: null,
        preview: value,
        cloudinaryUrl: value,
        publicId: null,
      });
      setImageLoaded(false);
    } else if (!value && image) {
      if (image.preview.startsWith('blob:')) {
        URL.revokeObjectURL(image.preview);
      }
      setImage(null);
      setImageLoaded(false);
    }
  }, [value, image]);

  useEffect(() => {
    return () => {
      if (image?.preview && image.preview.startsWith('blob:')) {
        URL.revokeObjectURL(image.preview);
      }
    };
  }, [image?.preview]);

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
    disabled: isUploading,
  });

  const containerDimensions = useMemo(() => ({
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  }), [width, height]);

  return (
    <Box
      sx={{
        width: containerDimensions.width,
        height: containerDimensions.height,
        position: 'relative',
        flexShrink: 0,
      }}
    >
      <Box
        {...getRootProps()}
        sx={{
          border: '2px dashed',
          borderRadius: '16px',
          height: '100%',
          width: '100%',
          padding: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          cursor: isUploading ? 'not-allowed' : 'pointer',
          transition: 'all 0.3s ease',
          backgroundColor: isUploading
            ? (isDark ? '#020c1c' : 'background.paper')
            : isDragActive
              ? (isDark ? 'rgba(37, 99, 235, 0.16)' : 'action.hover')
              : (isDark ? '#020c1c' : 'background.paper'),
          borderColor: isDragActive
            ? 'primary.main'
            : (isDark ? 'rgba(148, 163, 184, 0.35)' : 'divider'),
          overflow: 'hidden',
          position: 'relative',
          '&:hover': !isUploading ? {
            backgroundColor: isDark ? '#020c1c' : 'action.hover',
            borderColor: 'primary.main',
          } : {},
        }}
      >
        <input {...getInputProps()} />

        {isUploading ? (
          <Box sx={{ textAlign: 'center', position: 'absolute', zIndex: 2 }}>
            <CircularProgress size={60} thickness={4} />
            <Typography
              variant="body2"
              sx={{
                mt: 1,
                color: isDark ? '#e5e7eb' : '#111827',
                fontWeight: 500,
              }}
            >
              <Translated text="Uploading..." />
            </Typography>
          </Box>
        ) : image ? (
          <Box
            sx={{
              width: '100%',
              height: '100%',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
            }}
          >

            {!imageLoaded && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: isDark ? '#020c1c' : 'action.hover',
                  zIndex: 1,
                }}
              >
                <CircularProgress size={40} />
              </Box>
            )}

            <Box
              component="img"
              src={image.preview}
              alt="Preview"
              sx={{
                maxWidth: '100%',
                maxHeight: '100%',
                width: 'auto',
                height: 'auto',
                objectFit: objectFit,
                borderRadius: '12px',
                border: '1px solid',
                borderColor: isDark ? '#020c1c' : 'divider',
                display: 'block',
                opacity: imageLoaded ? 1 : 0,
                transition: 'opacity 0.3s ease',
                backgroundColor: isDark ? '#020c1c' : 'background.paper',
              }}
              crossOrigin='anonymous'
              loading="eager"
              onLoad={() => {
                setImageLoaded(true);
              }}
              onError={(e) => {
                console.error('Image failed to load:', image.preview);
                const target = e.target as HTMLImageElement;

                if (target.src.startsWith('blob:')) {
                  target.style.display = 'none';
                  toast.error(<Translated text="Failed to display image preview" />);
                } else {
                  setImageLoaded(true);
                  toast.error(<Translated text="Failed to load image" />);
                }
              }}
            />

            <IconButton
              onClick={handleRemove}
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                backgroundColor: isDark ? '#020c1c' : 'background.paper',
                color: isDark ? '#e5e7eb' : '#475569',
                '&:hover': { backgroundColor: isDark ? '#020c1c' : 'action.hover' },
                boxShadow: 2,
                zIndex: 3,
              }}
              size="small"
              aria-label="Remove image"
            >
              <DeleteIcon color="error" fontSize="small" />
            </IconButton>
          </Box>
        ) : (
          <Box sx={{ textAlign: 'center', px: 2 }}>
            <CloudUploadIcon sx={{ fontSize: 48, color: isDark ? 'rgba(148, 163, 184, 0.9)' : 'action.active', mb: 1 }} />
            <Typography
              variant="body1"
              sx={{
                color: isDark ? '#f3f4f6' : '#334155',
                fontWeight: 500,
              }}
              gutterBottom
            >
              {placeholderText}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: isDark ? '#cbd5e1' : '#64748b',
                display: 'inline-block',
              }}
            >
              <Translated text="Supported: JPG, PNG, GIF, WEBP" /> (<Translated text="Max" /> {maxSize / 1024 / 1024}<Translated text="MB" />)
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ImageDropZone;