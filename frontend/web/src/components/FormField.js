import React from 'react';
import {
  TextField,
  FormControl,
  FormHelperText,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  FormGroup
} from '@mui/material';

const FormField = ({
  type = 'text',
  name,
  label,
  value,
  onChange,
  onBlur,
  error,
  touched,
  options = [],
  multiple = false,
  required = false,
  ...props
}) => {
  const showError = touched && error;
  
  const renderField = () => {
    switch (type) {
      case 'select':
        return (
          <FormControl 
            error={showError}
            fullWidth
            required={required}
          >
            <InputLabel>{label}</InputLabel>
            <Select
              name={name}
              value={value || (multiple ? [] : '')}
              onChange={onChange}
              onBlur={onBlur}
              multiple={multiple}
              {...props}
            >
              {options.map((option) => (
                <MenuItem 
                  key={option.value} 
                  value={option.value}
                >
                  {option.label}
                </MenuItem>
              ))}
            </Select>
            {showError && (
              <FormHelperText>{error}</FormHelperText>
            )}
          </FormControl>
        );
        
      case 'checkbox':
        return (
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  name={name}
                  checked={value || false}
                  onChange={onChange}
                  onBlur={onBlur}
                  {...props}
                />
              }
              label={label}
            />
            {showError && (
              <FormHelperText error>{error}</FormHelperText>
            )}
          </FormGroup>
        );
        
      default:
        return (
          <TextField
            type={type}
            name={name}
            label={label}
            value={value || ''}
            onChange={onChange}
            onBlur={onBlur}
            error={showError}
            helperText={showError ? error : null}
            fullWidth
            required={required}
            {...props}
          />
        );
    }
  };

  return renderField();
};

export default FormField;