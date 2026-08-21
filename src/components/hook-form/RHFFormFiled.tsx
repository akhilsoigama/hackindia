import React, { ReactElement, isValidElement, cloneElement, useRef } from 'react';
import { useFormContext, Controller, RegisterOptions } from 'react-hook-form';
import {
  TextField,
  InputAdornment,
  SxProps,
  Theme,
  TextFieldProps,
} from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import { Input } from '../ui/input';
import { Translated } from '../common/translator/translator';
import { useTheme } from '@/theme/AppThemeProvider';


interface RHFFormFieldProps {
  name: string;
  label: string | React.ReactNode;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'date' | 'time' | 'datetime-local' | 'file' | 'textarea';
  placeholder?: string | React.ReactNode;
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
  hideDateIndicator?: boolean;
  hideTimeIndicator?: boolean;
  maxLength?: number;
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode'];
  pattern?: string;
  onInput?: React.FormEventHandler<HTMLInputElement | HTMLTextAreaElement>;
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
  hideDateIndicator = false,
  hideTimeIndicator = false,
  maxLength,
  inputMode,
  pattern,
  onInput,

  ...props
}) => {
  const { control, formState: { errors } } = useFormContext();
  const error = errors[name];
  const { mode } = useTheme();
  const isDark = mode === 'dark';
  const dateInputRef = useRef<HTMLInputElement | null>(null);
  const normalizedPlaceholder = typeof placeholder === 'string' ? placeholder : '';
  const showCustomDateAdornment = type === 'date' && !hideDateIndicator && !endAdornment;
  const showCustomTimeAdornment = type === 'time' && !hideTimeIndicator && !endAdornment;

  const openDatePicker = () => {
    const inputEl = dateInputRef.current;
    if (!inputEl) return;

    inputEl.focus();
    if (typeof inputEl.showPicker === 'function') {
      inputEl.showPicker();
    }
  };

  const renderIcon = (el: React.ReactNode) => {
    if (isValidElement(el)) {
      const element = el as ReactElement<{ sx?: SxProps<Theme> }>;
      return cloneElement(element, {
        sx: { ...(element.props.sx || {}), color: isDark ? '#fff' : 'rgb(55,65,81)', fontSize: '20px' },
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
              type={type === 'textarea' ? 'text' : type}
              label={typeof label === 'string' ? <Translated text={label} /> : label}
              placeholder={normalizedPlaceholder}
              disabled={disabled}
              required={required}
              multiline={type === 'textarea'}
              rows={type === 'textarea' ? 4 : undefined}
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
                  maxLength,
                  inputMode,
                  pattern,
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
        className={`block text-sm font-semibold mb-3 transition-colors duration-200 ${isDark ? 'text-slate-300' : 'text-slate-800'}`}
      >
        {typeof label === 'string' ? <Translated text={label} /> : label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <Controller
        name={name}
        control={control}
        rules={validation}
        render={({ field }) => (
          <div className="relative">
            {icon && (
              <span className={`absolute left-0 pl-4 transition-colors duration-200 ${type === 'textarea' ? 'top-3' : 'inset-y-0 flex items-center'} ${isDark ? 'text-white' : 'text-slate-500'}`}>
                {icon}
              </span>
            )}
            {type === 'textarea' ? (
              <textarea
                {...field}
                value={field.value ?? ''}
                id={name}
                placeholder={normalizedPlaceholder}
                disabled={disabled}
                rows={4}
                className={`
                  w-full rounded-md border py-2 text-sm transition-colors duration-200 outline-none
                  ${icon ? 'pl-12' : 'pl-4'}
                  ${endAdornment ? 'pr-12' : 'pr-4'}
                  ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
                  ${error
                    ? isDark
                      ? 'border-red-500 bg-red-950/30 text-red-200 placeholder-red-400/60 ring-1 ring-red-500/40'
                      : 'border-red-400 bg-red-50 text-red-900 placeholder-red-300 ring-1 ring-red-400/30'
                    : isDark
                      ? 'bg-slate-950/70 border-slate-700 text-slate-100 placeholder-slate-400'
                      : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 hover:border-slate-300'
                  }
                `}
              />
            ) : (
              <Input
                {...field}
                value={field.value ?? ''}
                type={type}
                onChange={(event) => {
                  if (type === 'number') {
                    const rawValue = event.target.value;
                    field.onChange(rawValue === '' ? undefined : Number(rawValue));
                    return;
                  }
                  field.onChange(event);
                }}
                ref={(el) => {
                  dateInputRef.current = el;
                  field.ref(el);
                }}
                id={name}
                placeholder={normalizedPlaceholder}
                disabled={disabled}
                autoComplete={autoComplete}
                min={min}
                max={max}
                maxLength={maxLength}
                inputMode={inputMode}
                pattern={pattern}
                onInput={onInput}
                className={`
                  ${icon ? 'pl-12' : 'pl-4'}
                  ${endAdornment || showCustomDateAdornment || showCustomTimeAdornment ? 'pr-12' : 'pr-4'}
                  ${type === 'date' ? 'scheme-light dark:scheme-dark' : ''}
                  ${type === 'time' ? 'scheme-light dark:scheme-dark' : ''}
                  ${showCustomDateAdornment ? '[&::-webkit-calendar-picker-indicator]:hidden [appearance:textfield]' : ''}
                  ${hideDateIndicator && type === 'date' ? '[&::-webkit-calendar-picker-indicator]:hidden [appearance:textfield]' : ''}
                  ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
                  ${showCustomTimeAdornment ? '[&::-webkit-calendar-picker-indicator]:hidden [appearance:textfield]' : ''}
                  ${hideTimeIndicator && type === 'time' ? '[&::-webkit-calendar-picker-indicator]:hidden [appearance:textfield]' : ''}
                  ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
                  ${error
                    ? isDark
                      ? 'border-red-500 bg-red-950/30 text-red-200 placeholder-red-400/60 ring-1 ring-red-500/40'
                      : 'border-red-400 bg-red-50 text-red-900 placeholder-red-300 ring-1 ring-red-400/30'
                    : isDark
                      ? 'bg-slate-950/70 border-slate-700 text-slate-100 placeholder-slate-400'
                      : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 hover:border-slate-300'
                  }
                `}
                {...props}
              />
            )}

            {showCustomDateAdornment && (
              <button
                type="button"
                onClick={openDatePicker}
                className={`absolute inset-y-0 right-0 flex items-center pr-3 ${isDark ? 'text-slate-200' : 'text-slate-600'}`}
                aria-label="Open calendar"
                tabIndex={-1}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4.5 w-4.5"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </button>
            )}
            {showCustomTimeAdornment && (
              <button
                type="button"
                onClick={openDatePicker}
                className={`absolute inset-y-0 right-0 flex items-center pr-3 ${isDark ? 'text-slate-200' : 'text-slate-600'}`}
                aria-label="Open Time"
                tabIndex={-1}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4.5 w-4.5"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="12" x2="12" y2="7" />
                  <line x1="12" y1="12" x2="16" y2="14" />
                </svg>
              </button>
            )}


            {endAdornment && (
              <span className="absolute inset-y-0 right-0 flex items-center pr-3">
                {typeof endAdornment === 'string' ? <Translated text={endAdornment} /> : endAdornment}
              </span>
            )}
          </div>
        )}
      />

      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -4, height: 0 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className={`mt-2 text-xs font-semibold flex items-center gap-1.5 px-2.5 py-1.5 rounded-md leading-tight ${isDark
                ? 'text-red-300 bg-red-950/50 border border-red-800/60'
                : 'text-red-700 bg-red-50 border border-red-200'
              }`}
          >
            <svg
              className="w-3.5 h-3.5 shrink-0"
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
