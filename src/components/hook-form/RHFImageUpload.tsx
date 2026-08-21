
import {
  Controller,
  useFormContext,
  FieldValues,
  Path,
  PathValue,
  RegisterOptions,
  FieldError,
} from 'react-hook-form';
import { Box, Typography } from '@mui/material';
import { ImageDropZone } from '../image-dropzon';
import { useTheme } from '@/theme/AppThemeProvider';
// import { Translated } from '../common/translator/translator';

interface RHFDropzoneFieldProps<T extends FieldValues> {
  name: Path<T>;
  helperText?: string | React.ReactNode;
  rules?: RegisterOptions<T, Path<T>>;
  defaultValue?: PathValue<T, Path<T>> | null;
}

const RHFDropzoneField = <T extends FieldValues>({
  name,
  helperText,
  rules,
  defaultValue,
}: RHFDropzoneFieldProps<T>) => {
  const {
    control,
    formState: { errors },
  } = useFormContext<T>();
  const { mode } = useTheme();
  const isDark = mode === 'dark';

  const normalizedDefault =
    (defaultValue === null ? undefined : defaultValue) as PathValue<T, Path<T>> | undefined;

  const fieldError = errors?.[name] as FieldError | undefined;
  const errorMessage = fieldError?.message;

  return (
    <Box
      sx={{
        mb: 3,
        overflow: 'hidden',
        borderRadius: '1rem',
        border: '1px solid',
        borderColor: isDark ? 'rgba(55, 65, 81, 1)' : 'rgba(229, 231, 235, 1)',
        backgroundColor: isDark ? '#020c1c' : '#ffffff',
        p: 2,
        boxShadow: 3,
        transition: 'all 0.3s ease',
      }}
    >
      {helperText && (
        <Typography
          variant="caption"
          sx={{
            display: 'block',
            mb: 1.5,
            color: isDark ? '#d1d5db' : '#475569',
            fontWeight: 500,
          }}
        >
          {helperText}
        </Typography>
      )}
      <Controller
        name={name}
        control={control}
        defaultValue={normalizedDefault}
        rules={rules}
        render={({ field }) => (
          <ImageDropZone
            value={field.value ?? ''}
            onChange={(val: string) => field.onChange(val || null)}
          />
        )}
      />
      {errorMessage && (
        <Typography variant="caption" sx={{ mt: 1, display: 'block', color: '#ef4444' }}>
          {errorMessage} required
        </Typography>
      )}
    </Box>
  );
};

export default RHFDropzoneField;
