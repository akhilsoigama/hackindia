import React, { ReactElement, isValidElement, cloneElement } from 'react';
import { useFormContext, Controller, RegisterOptions } from 'react-hook-form';
import {
  TextField,
  InputAdornment,
  SxProps,
  Theme,
  TextFieldProps,
} from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';

interface RHFFormFieldProps {
  name: string;
  label: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'date' | 'time' | 'datetime-local' | 'file';
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  validation?: RegisterOptions;
  autoComplete?: string;
  icon?: React.ReactNode;
  endAdornment?: React.ReactNode;
  min?: string | number;
  max?: string | number;
  // MUI specific props
  useMUI?: boolean;
  variant?: 'standard' | 'outlined' | 'filled';
  size?: 'small' | 'medium';
  sx?: SxProps<Theme>;
  fullWidth?: boolean;

  InputProps?: TextFieldProps['InputProps'];
  InputLabelProps?: TextFieldProps['InputLabelProps'];
}

const RHFFormField: React.FC<RHFFormFieldProps> = ({
  name,
  label,
  type = 'text',
  placeholder = '',
  required = false,
  disabled = false,
  className = '',
  validation = {},
  autoComplete = 'off',
  icon,
  endAdornment,
  min,
  max,
  useMUI = false,
  variant = 'outlined',
  size = 'medium',
  sx = {},
  fullWidth = true,
  InputProps,
  InputLabelProps,
  ...props
}) => {
  const { control, formState: { errors } } = useFormContext();
  const error = errors[name];

  const renderIcon = (el: React.ReactNode) => {
    if (isValidElement(el)) {
      const element = el as ReactElement<{ sx?: SxProps<Theme> }>;
      return cloneElement(element, {
        sx: { ...(element.props.sx || {}), color: 'rgb(55,65,81)', fontSize: '20px' },
      });
    }
    return el;
  };


  if (useMUI) {
    return (
      <div className={className}>
        <Controller
          name={name}
          control={control}
          rules={validation}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth={fullWidth}
              type={type}
              label={label}
              placeholder={placeholder}
              disabled={disabled}
              required={required}
              variant={variant}
              size={size}
              error={!!error}
              helperText={error?.message as string}
              autoComplete={autoComplete}
              sx={sx}
              InputProps={{
                startAdornment: icon ? (
                  <InputAdornment position="start">
                    {renderIcon(icon)}
                  </InputAdornment>
                ) : undefined,
                endAdornment: endAdornment ? (
                  <InputAdornment position="end">
                    {renderIcon(endAdornment)}
                  </InputAdornment>
                ) : undefined,
                inputProps: {
                  min,
                  max,
                  ...props,
                },
                ...InputProps,
              }}
              InputLabelProps={{
                ...InputLabelProps,
              }}
            />
          )}
        />
      </div>
    );
  }

  // Non-MUI fallback
  return (
    <div className={`mb-5 ${className}`}>
      <label
        htmlFor={name}
        className="block text-sm font-semibold text-gray-700 mb-3 transition-colors duration-200"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <Controller
        name={name}
        control={control}
        rules={validation}
        render={({ field }) => (
          <div className="relative">
            {icon && (
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 transition-colors duration-200">
                {icon}
              </span>
            )}
            <input
              {...field}
              type={type}
              id={name}
              placeholder={placeholder}
              disabled={disabled}
              autoComplete={autoComplete}
              min={min}
              max={max}
              className={`
                w-full px-4 py-4 border-2 rounded-xl
                focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500
                transition-all duration-300 ease-in-out
                ${error
                  ? 'border-red-400 text-red-900 placeholder-red-300 bg-red-50'
                  : 'border-gray-200 placeholder-gray-400 bg-white hover:border-gray-300'
                }
                ${disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''}
                ${icon ? 'pl-12' : 'pl-4'}
                ${endAdornment ? 'pr-12' : 'pr-4'}
                shadow-sm
              `}
              {...props}
            />

            {endAdornment && (
              <span className="absolute inset-y-0 right-0 flex items-center pr-3">
                {endAdornment}
              </span>
            )}
          </div>
        )}
      />

      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-2 text-sm text-red-600 flex items-center"
          >
            <svg
              className="w-4 h-4 mr-2 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z"
                clipRule="evenodd"
              />
            </svg>
            {error.message as string}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RHFFormField;
