
import {
  Controller,
  useFormContext,
  FieldValues,
  Path,
  PathValue,
  RegisterOptions,
  FieldError,
} from 'react-hook-form';
import { FormControl, FormHelperText } from '@mui/material';
import { ImageDropZone } from '../image-dropzon';

interface RHFDropzoneFieldProps<T extends FieldValues> {
  name: Path<T>;
  helperText?: string;
  rules?: RegisterOptions<T, Path<T>>;
  defaultValue?: PathValue<T, Path<T>> | null;
}

const RHFDropzoneField = <T extends FieldValues>({
  name,
  helperText,
  rules = { required: 'Image is required' },
  defaultValue = null,
}: RHFDropzoneFieldProps<T>) => {
  // 👇 Automatically gets control, errors, etc. from FormProvider context
  const {
    control,
    formState: { errors },
  } = useFormContext<T>();

  const normalizedDefault =
    (defaultValue === null ? undefined : defaultValue) as PathValue<T, Path<T>> | undefined;

  const fieldError = errors?.[name] as FieldError | undefined;
  const errorMessage = fieldError?.message;

  return (
    <FormControl fullWidth error={Boolean(errorMessage)} className="mb-6">
      <FormHelperText className="text-xs mt-1 dark:text-gray-300">
        {helperText}
      </FormHelperText>
      <Controller
        name={name}
        control={control}
        defaultValue={normalizedDefault}
        rules={rules}
        render={({ field }) => (
          <ImageDropZone
            value={field.value as string | undefined}
            onChange={(val: string) => field.onChange(val)}

          />
        )}
      />

      <FormHelperText className="text-xs mt-1 dark:text-gray-300">
        {errorMessage}
      </FormHelperText>
    </FormControl>
  );
};

export default RHFDropzoneField;
