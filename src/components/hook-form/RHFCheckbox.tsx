import React from 'react';
import { useFormContext, Controller, RegisterOptions } from 'react-hook-form';
import { NeonCheckbox } from '../ui/animated-check-box';

interface RHFCheckboxProps {
  name: string;
  label: string | React.ReactNode;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  validation?: RegisterOptions;
  description?: string;
  size?: 'small' | 'medium';
  color?: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
  placement?: 'end' | 'start' | 'top' | 'bottom';
  checked?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}


import { useTheme } from '@/theme/AppThemeProvider';
import { Translated } from '../common/translator/translator';

const RHFCheckbox: React.FC<RHFCheckboxProps> = ({
  name,
  label,
  required = false,
  disabled = false,
  className = '',
  validation = {},
  description,
  size = 'medium',
  color = 'primary',
  placement = 'end',
  checked: externalChecked,
  onChange: externalOnChange,
  ...props
}) => {
  const { mode } = useTheme();
  const isDark = mode === 'dark';
  const formContext = useFormContext();

  const labelClass = [
    isDark ? 'text-slate-100' : 'text-slate-900',
    size === 'small' ? 'text-sm' : 'text-base',
    'font-medium leading-snug',
    disabled ? 'opacity-70' : '',
  ].join(' ');
  const descClass = [
    isDark ? 'text-slate-400' : 'text-slate-500',
    'text-xs mt-1 leading-relaxed',
  ].join(' ');
  const errorClass = [
    isDark ? 'text-red-400' : 'text-red-600',
    'text-xs mt-1 font-medium leading-relaxed',
  ].join(' ');
  const boxBg = isDark ? 'bg-black/80' : 'bg-white';
  const requiredColorClass = {
    primary: 'text-blue-500',
    secondary: 'text-violet-500',
    error: 'text-red-500',
    info: 'text-cyan-500',
    success: 'text-green-500',
    warning: 'text-amber-500',
  }[color];
  const placementClass = {
    end: 'flex-row',
    start: 'flex-row-reverse justify-end',
    top: 'flex-col items-start',
    bottom: 'flex-col-reverse items-start',
  }[placement];

  const renderLabel = () => {
    const labelContent = typeof label === 'string' ? <Translated text={label} /> : label;
    return (
      <span className={labelClass}>
        {labelContent}
        {required && <span className={`ml-1 ${requiredColorClass}`}>*</span>}
      </span>
    );
  };

  if (!formContext || externalOnChange) {
    return (
      <div className={`flex flex-col gap-3 ${className}`}>
        <div className={`flex items-center gap-3 ${placementClass}`}>
          <NeonCheckbox
            name={name}
            checked={externalChecked || false}
            onChange={externalOnChange}
            disabled={disabled}
            label={renderLabel()}
            boxBg={boxBg}
            {...props}
          />
        </div>
        {description && (
          <div className={descClass}><Translated text={description} /></div>
        )}
      </div>
    );
  }

  const {
    control,
    formState: { errors },
  } = formContext;

  const error = errors[name];

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      <div className={`flex items-center gap-3 ${placementClass}`}>
        <Controller
          name={name}
          control={control}
          rules={{
            required: required ? 'This field is required' : false,
            ...validation,
          }}
          render={({ field }) => (
            <NeonCheckbox
              {...field}
              checked={field.value || false}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => field.onChange(e.target.checked)}
              disabled={disabled}
              label={renderLabel()}
              boxBg={boxBg}
              {...props}
            />
          )}
        />
      </div>
      {description && (
        <div className={descClass}><Translated text={description} /></div>
      )}
      {error && (
        <div className={errorClass}>{error.message as string}</div>
      )}
    </div>
  );
};

export default RHFCheckbox;