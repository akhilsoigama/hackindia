import React from 'react';
import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from 'react-hook-form';
import Input, { type InputProps } from '@mui/material/Input';
import { cn } from '../../utils/utils';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

interface RHFVariantFieldProps<TFieldValues extends FieldValues>
  extends Omit<InputProps, 'name' | 'defaultValue'> {
  name: Path<TFieldValues>;
  control: Control<TFieldValues>;
  type?: React.HTMLInputTypeAttribute;
  className?: string;
  label?: string;
  helperText?: string;
  showPasswordToggle?: boolean;
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
  fullWidth?: boolean;
  variant?: 'standard' | 'outlined' | 'filled';
  size?: 'small' | 'medium';
}

function RHFVariantField<TFieldValues extends FieldValues>({
  name,
  control,
  type = 'text',
  className = '',
  label,
  helperText,
  showPasswordToggle = false,
  startAdornment,
  endAdornment,
  fullWidth = true,
  variant = 'outlined',
  size = 'medium',
  ...props
}: RHFVariantFieldProps<TFieldValues>) {
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => {
    setShowPassword((show) => !show);
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const inputType = showPasswordToggle && type === 'password'
    ? showPassword ? 'text' : 'password'
    : type;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <FormControl
          fullWidth={fullWidth}
          error={!!error}
          variant={variant}
          className={cn('mb-4', className)}
        >
          {label && (
            <InputLabel
              shrink
              htmlFor={name}
              className="mb-2 font-medium text-slate-700"
            >
              {label}
              {props.required && (
                <span className="ml-1 text-red-500">*</span>
              )}
            </InputLabel>
          )}

          <Input
            {...field}
            {...props}
            id={name}
            type={inputType}
            fullWidth={fullWidth}
            size={size}
            error={!!error}
            startAdornment={startAdornment && (
              <InputAdornment position="start">
                {startAdornment}
              </InputAdornment>
            )}
            endAdornment={
              showPasswordToggle && type === 'password' ? (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                    size="small"
                    className="text-slate-500 hover:text-slate-600"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ) : endAdornment ? (
                <InputAdornment position="end">
                  {endAdornment}
                </InputAdornment>
              ) : null
            }
            className={cn(
              'transition-all duration-200',
              error && 'border-red-500',
              'rounded-lg',
              variant === 'outlined' && 'border-2',
              size === 'small' ? 'py-1.5' : 'py-2.5'
            )}
            classes={{
              root: cn(
                'before:border-slate-200',
                'hover:before:border-blue-400',
                error && 'before:border-red-400 hover:before:border-red-400'
              ),
              focused: cn(
                'before:border-blue-500',
                'before:border-2',
                error && 'before:border-red-500'
              ),
              input: cn(
                'px-3',
                'text-slate-900',
                'placeholder:text-slate-400',
                'font-normal'
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: error ? '#f87171' : '#bae6fd', 
                borderWidth: '2px',
                transition: 'all 0.2s ease-in-out',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: error ? '#ef4444' : '#7dd3fc', 
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: error ? '#dc2626' : '#0ea5e9',
                borderWidth: '2px',
                boxShadow: error ? '0 0 0 3px rgba(239, 68, 68, 0.1)' : '0 0 0 3px rgba(14, 165, 233, 0.1)',
              },
              '&:before': {
                borderBottom: variant === 'standard' ? '2px solid #bae6fd' : 'none',
              },
              '&:after': {
                borderBottom: variant === 'standard' ? '2px solid #0ea5e9' : 'none',
              },
              '&:hover:not(.Mui-disabled):before': {
                borderBottom: variant === 'standard' ? '2px solid #7dd3fc' : 'none',
              },
              // Standard variant specific styles
              ...(variant === 'standard' && {
                '&:before': {
                  borderColor: error ? '#f87171' : '#bae6fd',
                },
                '&:hover:not(.Mui-disabled):before': {
                  borderColor: error ? '#ef4444' : '#7dd3fc',
                },
                '&:after': {
                  borderColor: error ? '#dc2626' : '#0ea5e9',
                },
              }),
              // Filled variant specific styles
              ...(variant === 'filled' && {
                backgroundColor: error ? '#fef2f2' : '#f0f9ff',
                '&:hover': {
                  backgroundColor: error ? '#fee2e2' : '#e0f2fe',
                },
                '&.Mui-focused': {
                  backgroundColor: error ? '#fef2f2' : '#f0f9ff',
                },
                '& .MuiFilledInput-underline:before': {
                  borderColor: error ? '#f87171' : '#bae6fd',
                },
                '& .MuiFilledInput-underline:after': {
                  borderColor: error ? '#dc2626' : '#0ea5e9',
                },
              }),
            }}
            onChange={(e) => {
              field.onChange(e.target.value);
              props.onChange?.(e);
            }}
          />

          {(error?.message || helperText) && (
            <FormHelperText
              className={cn(
                'mt-1.5 text-sm',
                error ? 'text-red-600' : 'text-slate-500'
              )}
            >
              {error?.message || helperText}
            </FormHelperText>
          )}
        </FormControl>
      )}
    />
  );
}

export default RHFVariantField;