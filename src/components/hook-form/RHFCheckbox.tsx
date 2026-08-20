import React from 'react';
import { useFormContext, Controller, RegisterOptions } from 'react-hook-form';
import {
  Checkbox,
  FormControlLabel,
  FormControl,
  FormHelperText,
  FormGroup,
  Typography,
  Box,
} from '@mui/material';
import { CheckBox as CheckBoxIcon, CheckBoxOutlineBlank } from '@mui/icons-material';

interface RHFCheckboxProps {
  name: string;
  label: string | React.ReactNode;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  validation?: RegisterOptions;
  description?: string;
  // MUI specific props
  size?: 'small' | 'medium';
  color?: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
  placement?: 'end' | 'start' | 'top' | 'bottom';
  // For use outside of React Hook Form context
  checked?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

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
  const formContext = useFormContext();
  
  // If we're using this outside of RHF context, use the controlled component approach
  if (!formContext || externalOnChange) {
    return (
      <FormControl component="fieldset" className={className}>
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                name={name}
                checked={externalChecked || false}
                onChange={externalOnChange}
                disabled={disabled}
                size={size}
                color={color}
                icon={<CheckBoxOutlineBlank />}
                checkedIcon={<CheckBoxIcon />}
                {...props}
              />
            }
            label={
              <Box>
                <Typography variant="body1" component="span">
                  {label}
                  {required && <span className="text-red-500 ml-1">*</span>}
                </Typography>
                {description && (
                  <Typography variant="caption" color="textSecondary" display="block">
                    {description}
                  </Typography>
                )}
              </Box>
            }
            labelPlacement={placement}
            disabled={disabled}
          />
        </FormGroup>
      </FormControl>
    );
  }

  const {
    control,
    formState: { errors },
  } = formContext;

  const error = errors[name];

  return (
    <FormControl 
      component="fieldset" 
      error={!!error}
      disabled={disabled}
      className={className}
      fullWidth
    >
      <Controller
        name={name}
        control={control}
        rules={{ 
          required: required ? 'This field is required' : false, 
          ...validation 
        }}
        render={({ field }) => (
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  {...field}
                  checked={field.value || false}
                  onChange={(e) => field.onChange(e.target.checked)}
                  disabled={disabled}
                  size={size}
                  color={error ? 'error' : color}
                  icon={<CheckBoxOutlineBlank />}
                  checkedIcon={<CheckBoxIcon />}
                  {...props}
                />
              }
              label={
                <Box>
                  <Typography 
                    variant="body1" 
                    component="span"
                    color={error ? 'error' : 'textPrimary'}
                  >
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                  </Typography>
                  {description && (
                    <Typography 
                      variant="caption" 
                      color={error ? 'error' : 'textSecondary'} 
                      display="block"
                    >
                      {description}
                    </Typography>
                  )}
                </Box>
              }
              labelPlacement={placement}
              disabled={disabled}
            />
          </FormGroup>
        )}
      />
      
      {error && (
        <FormHelperText error>
          {error.message as string}
        </FormHelperText>
      )}
    </FormControl>
  );
};

export default RHFCheckbox;