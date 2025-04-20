import React from 'react';
import { Box, Paper, Typography, Button } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';

const FormContainer = ({
  title,
  subtitle,
  children,
  onSubmit,
  loading = false,
  submitText = 'Lưu',
  cancelText = 'Hủy',
  onCancel,
  maxWidth = 600,
  error,
  disableSubmit = false
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(e);
  };

  return (
    <Box
      component={Paper}
      sx={{
        maxWidth,
        mx: 'auto',
        p: 3,
      }}
    >
      {title && (
        <Typography variant="h5" component="h2" gutterBottom>
          {title}
        </Typography>
      )}
      {subtitle && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {subtitle}
        </Typography>
      )}
      
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          '& .MuiTextField-root, & .MuiFormControl-root': { mb: 2 },
          display: 'flex',
          flexDirection: 'column',
          gap: 2
        }}
      >
        {children}

        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'flex-end',
          gap: 2,
          mt: 2 
        }}>
          {onCancel && (
            <Button
              onClick={onCancel}
              disabled={loading}
            >
              {cancelText}
            </Button>
          )}
          <LoadingButton
            type="submit"
            variant="contained"
            loading={loading}
            disabled={disableSubmit}
          >
            {submitText}
          </LoadingButton>
        </Box>
      </Box>
    </Box>
  );
};

export default FormContainer;