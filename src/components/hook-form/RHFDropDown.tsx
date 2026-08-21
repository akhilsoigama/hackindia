import React from 'react';
import { useFormContext, Controller, RegisterOptions } from 'react-hook-form';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';
import { useTheme } from '@/theme/AppThemeProvider';
import { useEffect, useState } from 'react';
import { useRef } from 'react';
import { Translated } from '../common/translator/translator';

interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

interface RHFDropDownProps {
  name: string;
  label: string | React.ReactNode;
  options: SelectOption[];
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  validation?: RegisterOptions;
  value?: string | number;
  onChange?: (event: { target: { name: string; value: string | number } }) => void;
  fullWidth?: boolean;
  size?: 'small' | 'medium';
  variant?: 'outlined' | 'filled' | 'standard';
  icon?: React.ReactNode;
  endAdornment?: React.ReactNode;
}

const RHFDropDown: React.FC<RHFDropDownProps> = ({
  name,
  label,
  options,
  placeholder = 'Select an option',
  required = false,
  disabled = false,
  className = '',
  validation = {},
  value: externalValue,
  onChange: externalOnChange,
}) => {

  const { mode } = useTheme();
  const isDark = mode === 'dark';
  const labelClass = isDark ? 'text-slate-300' : 'text-slate-800';
  const errorClass = isDark
    ? 'mt-2 text-xs font-semibold flex items-center gap-1.5 px-2.5 py-1.5 rounded-md leading-tight text-red-300 bg-red-950/50 border border-red-800/60'
    : 'mt-2 text-xs font-semibold flex items-center gap-1.5 px-2.5 py-1.5 rounded-md leading-tight text-red-700 bg-red-50 border border-red-200';
  const dropdownBg = ` w-full px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-400'} font-medium transition-all duration-300 shadow-sm ${isDark ? 'bg-slate-950/70  text-slate-100 placeholder-slate-400 hover:border-slate-500' : 'bg-white border-slate-400 text-slate-900 placeholder-slate-400 hover:border-slate-500'}`;
  const dropdownErrorBg = isDark
    ? 'border-red-500 bg-red-950/30 text-red-200 ring-1 ring-red-500/40'
    : 'border-red-400 bg-red-50 text-red-900 ring-1 ring-red-400/30';
  const dropdownListBg =isDark ? 'bg-slate-950/70 border-slate-700  shadow-lg' : 'bg-white border-slate-400 shadow-lg';
  const optionClass =  ` ${isDark
    ? 'bg-slate-950 hover:bg-slate-700 text-slate-100'
    : 'bg-white hover:bg-slate-300 text-slate-900'}`;
  const borderClass = isDark ? 'border-b border-slate-700 ' : 'border-b border-slate-200';
  const formContext = useFormContext();
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [selected, setSelected] = useState(() => {
    const currentValue = externalValue || '';
    const found = options.find((opt) => String(opt.value) === String(currentValue));
    return found ? found.label : placeholder;
  });

  useEffect(() => {
    const currentValue = externalValue || '';
    const found = options.find((opt) => String(opt.value) === String(currentValue));
    setSelected(found ? found.label : placeholder);
  }, [externalValue, options, placeholder]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent | TouchEvent) => {
      if (!isOpen) return;
      const target = event.target as Node | null;
      if (wrapperRef.current && target && !wrapperRef.current.contains(target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('touchstart', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
    };
  }, [isOpen]);


  if (!formContext) {
    const handleSelect = (option: SelectOption) => {
      setSelected(option.label);
      setIsOpen(false);
      externalOnChange?.({
        target: { name, value: option.value },
      });
    };
    return (
      <div className={className} ref={wrapperRef}>
        <label htmlFor={name} className={`${labelClass} block text-sm font-semibold mb-3 transition-colors duration-200`}>
          {typeof label === 'string' ? <Translated text={label} /> : label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => setIsOpen((v) => !v)}
            className={`w-full px-4 py-3  transition-all duration-300 ${dropdownBg} flex items-center justify-between group`}
            type="button"
            id={name}
            disabled={disabled}
          >
            <span className="font-medium"><Translated text={selected} /></span>
            <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
              <ChevronDown className="w-5 h-5" />
            </motion.div>
          </motion.button>
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className={`absolute z-50 mt-2 max-h-64 w-full overflow-y-auto scrollbar-hide overflow-x-hidden rounded-lg border shadow-2xl ${dropdownListBg}`}
              >
                {options.map((option, index) => (
                  <motion.button
                    key={option.value}
                    type="button"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    onClick={() => handleSelect(option)}
                    className={`w-full px-4 py-3 text-left transition-colors duration-200 ${optionClass} flex items-center justify-between group ${
                      index !== options.length - 1 ? borderClass : ''
                    }`}
                    disabled={option.disabled}
                  >
                    <span className="font-medium"><Translated text={option.label} /></span>
                    {selected === option.label && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500, damping: 30 }}>
                        <Check className="w-5 h-5" />
                      </motion.div>
                    )}
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  }

  const {
    control,
    formState: { errors },
  } = formContext;

  const error = errors[name];

  return (
    <div className={className} ref={wrapperRef}>
      <label htmlFor={name} className={`${labelClass} block text-sm font-semibold mb-3 transition-colors duration-200`}>
        {typeof label === 'string' ? <Translated text={label} /> : label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <Controller
        name={name}
        control={control}
        rules={{
          required: required ? 'This field is required' : false,
          ...validation,
        }}
        render={({ field }) => {
          const resolvedValue = externalValue ?? field.value ?? '';
          const selectedOption = options.find((opt) => String(opt.value) === String(resolvedValue));
          const handleSelect = (option: SelectOption) => {
            field.onChange(option.value);
            externalOnChange?.({
              target: { name, value: option.value },
            });
            setIsOpen(false);
          };
          return (
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => setIsOpen((v) => !v)}
                className={`w-full px-4 py-3 rounded-lg transition-all duration-300 ${error ? dropdownErrorBg : dropdownBg} flex items-center justify-between group`}
                type="button"
                id={name}
                disabled={disabled}
              >
                <span className="font-medium"><Translated text={selectedOption ? selectedOption.label : placeholder}/></span>
                <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
                  <ChevronDown className="w-5 h-5" />
                </motion.div>
              </motion.button>
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className={`absolute z-50 mt-2 max-h-64 w-full overflow-y-auto scrollbar-hide overflow-x-hidden rounded-lg border shadow-2xl ${dropdownListBg}`}
                  >
                    {options.map((option, index) => (
                      <motion.button
                        key={option.value}
                        type="button"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                        onClick={() => handleSelect(option)}
                        className={`w-full px-4 py-3 text-left transition-colors duration-200 ${optionClass} flex items-center justify-between group ${
                          index !== options.length - 1 ? borderClass : ''
                        }`}
                        disabled={option.disabled}
                      >
                        <span className="font-medium"><Translated text={option.label} /></span>
                        {selectedOption && selectedOption.value === option.value && (
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500, damping: 30 }}>
                            <Check className="w-5 h-5" />
                          </motion.div>
                        )}
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -4, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                    exit={{ opacity: 0, y: -4, height: 0 }}
                    transition={{ duration: 0.18, ease: 'easeOut' }}
                    className={errorClass}
                  >
                    <svg fill="currentColor" viewBox="0 0 20 20" className="w-3.5 h-3.5 shrink-0">
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <Translated text={error.message as string}/>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        }}
      />
    </div>
  );
};

export default RHFDropDown;