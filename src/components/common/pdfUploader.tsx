import React, { useEffect, useState } from 'react';
import { useDropzone, FileRejection } from 'react-dropzone';
import { Box, Typography, IconButton, CircularProgress } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

interface UploadedPDF {
  file: File | null;
  name: string;
  cloudinaryUrl: string;
  publicId: string | null;
}

interface PDFDropZoneProps {
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
  width?: number;
  height?: number;
  format?: string;
  resource_type: string;
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

const PDFDropZone: React.FC<PDFDropZoneProps> = ({
  value = [],
  onChange,
  placeholderText = 'Drag & drop PDFs here, or click to select',
  maxSize = 20 * 1024 * 1024, // default 20MB
  maxFiles = 5,
  height = '300px',
  width = '100%',
  multiple = false,
}) => {
  const [pdfs, setPdfs] = useState<UploadedPDF[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const uploadToCloudinary = async (file: File): Promise<CloudinaryUploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', import.meta.env.VITE_PUBLIC_CLOUDINARY_UPLOAD_PRESET || '');

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_PUBLIC_CLOUDINARY_CLOUD_NAME}/raw/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) throw new Error('Failed to upload PDF to Cloudinary');
    return await response.json();
  };

  const onDrop = async (acceptedFiles: File[], fileRejections: FileRejection[]) => {
    if (fileRejections.length > 0) {
      alert(`Some files were rejected. Max size: ${maxSize / 1024 / 1024}MB`);
      return;
    }
    if (pdfs.length >= maxFiles) return;

    setIsUploading(true);

    try {
      const validFiles = acceptedFiles.slice(0, maxFiles - pdfs.length);
      const newPDFs: UploadedPDF[] = [];

      for (const file of validFiles) {
        try {
          const cloudinaryResponse = await uploadToCloudinary(file);
          newPDFs.push({
            file,
            name: file.name,
            cloudinaryUrl: cloudinaryResponse.secure_url,
            publicId: cloudinaryResponse.public_id,
          });
        } catch (err) {
          console.error('Error uploading PDF:', err);
        }
      }

      const updatedPDFs = [...pdfs, ...newPDFs];
      setPdfs(updatedPDFs);
      onChange(updatedPDFs.map((pdf) => pdf.cloudinaryUrl));
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = (index: number) => {
    // const pdfToRemove = pdfs[index];
    const newPDFs = [...pdfs];
    newPDFs.splice(index, 1);
    setPdfs(newPDFs);
    const urlsToSend = newPDFs.map((pdf) => pdf.cloudinaryUrl);
    onChange(multiple ? urlsToSend : urlsToSend[0] || '');
  };

  useEffect(() => {
    if (value) {
      const initialPDFs: UploadedPDF[] = (Array.isArray(value) ? value : [value])
        .filter((url): url is string => !!url)
        .map((url) => ({
          cloudinaryUrl: url,
          name: url.split('/').pop() || 'file.pdf',
          file: null,
          publicId: null,
        }));
      setPdfs(initialPDFs);
    }
  }, [value]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'application/pdf': ['.pdf'] },
    maxSize,
    maxFiles,
    multiple,
    onDrop,
    disabled: isUploading || pdfs.length >= maxFiles,
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
          cursor: pdfs.length >= maxFiles ? 'not-allowed' : 'pointer',
          transition: 'all 0.3s ease',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          backgroundColor: isDragActive ? 'action.hover' : 'background.paper',
          borderColor: isDragActive ? 'primary.main' : 'divider',
          '&:hover': {
            borderColor: pdfs.length >= maxFiles ? 'divider' : 'primary.main',
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
        ) : pdfs.length > 0 ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, maxHeight: '100%', overflow: 'auto' }}>
            {pdfs.map((pdf, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  p: 1,
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: '4px',
                  backgroundColor: 'action.hover',
                }}
              >
                <Typography sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                  {pdf.name}
                </Typography>
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(index);
                  }}
                  size="small"
                >
                  <DeleteIcon color="error" fontSize="small" />
                </IconButton>
              </Box>
            ))}
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <CloudUploadIcon sx={{ fontSize: 48, color: 'action.active', mb: 1 }} />
            <Typography variant="body1" color="text.secondary" gutterBottom>
              {placeholderText}
            </Typography>
            <Typography variant="caption" color="text.disabled">
              Supported format: PDF (Max {maxSize / 1024 / 1024}MB)
            </Typography>
          </Box>
        )}
      </Box>

      {pdfs.length > 0 && (
        <Typography variant="caption" sx={{ display: 'block', mt: 1, textAlign: 'center' }}>
          {pdfs.length}/{maxFiles} PDFs uploaded
        </Typography>
      )}
    </Box>
  );
};

export default PDFDropZone;
