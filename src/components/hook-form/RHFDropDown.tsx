import React from 'react';
import { useFormContext, Controller, RegisterOptions } from 'react-hook-form';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Box,
  Typography,
  SelectChangeEvent,
  styled,
  alpha
} from '@mui/material';
import { KeyboardArrowDown } from '@mui/icons-material';

interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

interface RHFDropDownProps {
  name: string;
  label?: string;
  options: SelectOption[];
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  validation?: RegisterOptions;
  value?: string | number;
  onChange?: (event: SelectChangeEvent<string | number>) => void;
  fullWidth?: boolean;
  size?: 'small' | 'medium';
  variant?: 'outlined' | 'filled' | 'standard';
}

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  '& .MuiInputLabel-root': {
    position: 'relative',
    transform: 'none',
    marginBottom: theme.spacing(1),
    fontSize: '14px',
    fontWeight: 600,
    color: theme.palette.text.primary,
    '&.Mui-focused': {
      color: theme.palette.primary.main,
    },
    '&.Mui-error': {
      color: theme.palette.error.main,
    }
  }
}));

const StyledSelect = styled(Select, {
  shouldForwardProp: (prop) => prop !== 'error'
})<{ error?: boolean }>(({ theme, error }) => ({
  '& .MuiSelect-select': {
    padding: '12px 14px',
    borderRadius: '8px',
    backgroundColor: theme.palette.background.paper,
    transition: 'all 0.2s ease-in-out',
  },
  
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: error ? theme.palette.error.main : theme.palette.grey[400],
    borderWidth: '1.5px',
    transition: 'all 0.2s ease-in-out',
  },
  
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: error ? theme.palette.error.main : theme.palette.primary.main,
  },
  
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: error ? theme.palette.error.main : theme.palette.primary.main,
    borderWidth: '2px',
    boxShadow: `0 0 0 4px ${alpha(error ? theme.palette.error.main : theme.palette.primary.main, 0.1)}`,
  },
  
  '&.Mui-disabled': {
    opacity: 0.6,
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.grey[300],
    }
  }
}));

const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  padding: '10px 16px',
  margin: '2px 8px',
  borderRadius: '6px',
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.08),
  },
  '&.Mui-selected': {
    backgroundColor: alpha(theme.palette.primary.main, 0.12),
    fontWeight: 500,
    '&:hover': {
      backgroundColor: alpha(theme.palette.primary.main, 0.16),
    }
  },
  '&.Mui-disabled': {
    opacity: 0.5,
  }
}));

const RequiredAsterisk = styled('span')(({ theme }) => ({
  color: theme.palette.error.main,
  marginLeft: '4px',
}));

const ErrorMessage = styled(Box)(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  backgroundColor: alpha(theme.palette.error.main, 0.08),
  color: theme.palette.error.main,
  padding: '4px 12px',
  borderRadius: '6px',
  fontSize: '0.75rem',
  fontWeight: 500,
  marginTop: '8px',
  border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
}));

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
  fullWidth = true,
  size = 'medium',
  variant = 'outlined',
  ...props
}) => {
  const formContext = useFormContext();
  
  // Render menu item content
  const renderMenuItemContent = (option: SelectOption) => (
    <Typography 
      variant="body1"
      sx={{ 
        opacity: option.disabled ? 0.6 : 1,
        fontWeight: option.disabled ? 400 : 500
      }}
    >
      {option.label}
    </Typography>
  );

  if (!formContext || externalOnChange) {
    return (
      <StyledFormControl 
        fullWidth={fullWidth} 
        className={className}
        disabled={disabled}
        error={false}
      >
        {label && (
          <InputLabel shrink htmlFor={name}>
            {label}
            {required && <RequiredAsterisk>*</RequiredAsterisk>}
          </InputLabel>
        )}
        
        <StyledSelect
          id={name}
          name={name}
          value={externalValue || ''}
          disabled={disabled}
          size={size}
          variant={variant}
          IconComponent={KeyboardArrowDown}
          displayEmpty
          MenuProps={{
            PaperProps: {
              sx: {
                maxHeight: 320,
                marginTop: 1,
                borderRadius: 2,
                boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                border: '1px solid',
                borderColor: 'divider',
                '& .MuiList-root': {
                  padding: 1,
                }
              }
            }
          }}
          {...props}
        >
          <MenuItem value="" disabled>
            <Typography variant="body1" color="text.secondary">
              {placeholder}
            </Typography>
          </MenuItem>
          {options.map((option) => (
            <StyledMenuItem
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {renderMenuItemContent(option)}
            </StyledMenuItem>
          ))}
        </StyledSelect>
      </StyledFormControl>
    );
  }

  const {
    control,
    formState: { errors },
  } = formContext;

  const error = errors[name];

  return (
    <Controller
      name={name}
      control={control}
      rules={{ 
        required: required ? 'This field is required' : false, 
        ...validation 
      }}
      render={({ field }) => (
        <StyledFormControl 
          fullWidth={fullWidth} 
          className={className}
          disabled={disabled}
          error={!!error}
        >
          {label && (
            <InputLabel shrink htmlFor={name}>
              {label}
              {required && <RequiredAsterisk>*</RequiredAsterisk>}
            </InputLabel>
          )}
          
          <StyledSelect
            {...field}
            id={name}
            disabled={disabled}
            size={size}
            variant={variant}
            value={field.value || ''}
            error={!!error}
            IconComponent={KeyboardArrowDown}
            displayEmpty
            MenuProps={{
              PaperProps: {
                sx: {
                  maxHeight: 320,
                  marginTop: 1,
                  borderRadius: 2,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                  border: '1px solid',
                  borderColor: 'divider',
                  '& .MuiList-root': {
                    padding: 1,
                  }
                }
              }
            }}
            {...props}
          >
            <MenuItem value="" disabled>
              <Typography variant="body1" color="text.secondary">
                {placeholder}
              </Typography>
            </MenuItem>
            {options.map((option) => (
              <StyledMenuItem
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {renderMenuItemContent(option)}
              </StyledMenuItem>
            ))}
          </StyledSelect>
          
          {error && (
            <FormHelperText error={false}>
              <ErrorMessage>
                {error.message as string}
              </ErrorMessage>
            </FormHelperText>
          )}
        </StyledFormControl>
      )}
    />
  );
};

export default RHFDropDown;