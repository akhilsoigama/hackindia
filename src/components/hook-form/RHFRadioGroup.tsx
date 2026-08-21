import React from 'react';
import { Controller, RegisterOptions, useFormContext } from 'react-hook-form';
import { useTheme } from '@/theme/AppThemeProvider';
import { Translated } from '../common/translator/translator';

export interface RadioOption {
  label: string;
  value: string | number;
  disabled?: boolean;
  description?: string;
}

interface RadioButtonProps {
  checked: boolean;
  disabled?: boolean;
  label: string | React.ReactNode;
  description?: string | React.ReactNode;
  name: string;
  onChange: (value: string | number) => void;
  optionValue: string | number;
}

export interface RHFRadioGroupProps {
  name: string;
  label?: string;
  options: RadioOption[];
  required?: boolean;
  disabled?: boolean;
  className?: string;
  validation?: RegisterOptions;
  direction?: 'row' | 'column';
  onChange?: (value: string | number) => void;
}

export const RadioButton: React.FC<RadioButtonProps> = ({
  checked,
  disabled = false,
  label,
  description,
  name,
  onChange,
  optionValue,
}) => {
  const { mode } = useTheme();
  const isDark = mode === 'dark';

  return (
    <label
      className={`flex items-start gap-3 rounded-lg border px-3 py-2 transition-colors ${
        disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
      } ${
        checked
          ? isDark
            ? 'border-blue-500 bg-blue-900/20'
            : 'border-blue-500 bg-blue-50'
          : isDark
            ? 'border-slate-700 bg-slate-900 hover:border-slate-600'
            : 'border-slate-200 bg-white hover:border-slate-300'
      }`}
    >
      <input
        type="radio"
        name={name}
        checked={checked}
        disabled={disabled}
        onChange={() => onChange(optionValue)}
        className="mt-1 h-4 w-4 accent-blue-600"
      />
      <span className="flex-1">
        <span className={`block text-sm font-medium ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
          {label}
        </span>
        {description && (
          <span className={`block text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            {description}
          </span>
        )}
      </span>
    </label>
  );
};

const RHFRadioGroup: React.FC<RHFRadioGroupProps> = ({
  name,
  label,
  options,
  required = false,
  disabled = false,
  className = '',
  validation = {},
  direction = 'column',
  onChange,
}) => {
  const { mode } = useTheme();
  const isDark = mode === 'dark';
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const error = errors[name];

  return (
    <div className={className}>
      {label && (
        <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <Controller
        name={name}
        control={control}
        rules={{
          required: required ? 'This field is required' : false,
          ...validation,
        }}
        render={({ field }) => (
          <div className={direction === 'row' ? 'grid grid-cols-1 md:grid-cols-2 gap-2' : 'space-y-2'}>
            {options.map((option) => (
              <RadioButton
                key={String(option.value)}
                name={name}
                label={<Translated text={option.label}/>}
                description={<Translated text={option.description ?? ''}/>}
                checked={String(field.value) === String(option.value)}
                optionValue={option.value}
                disabled={disabled || option.disabled}
                onChange={(value) => {
                  field.onChange(value);
                  onChange?.(value);
                }}
              />
            ))}
          </div>
        )}
      />

      {error && <p className="mt-2 text-sm text-red-500"><Translated text={error.message as string}/></p>}
    </div>
  );
};

export default RHFRadioGroup;
