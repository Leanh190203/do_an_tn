import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

const PageHeader = ({
  title,
  subtitle,
  action,
  actionText = 'Thêm mới',
  actionIcon = <AddIcon />,
  children
}) => {
  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        gap: 2
      }}>
        <Box>
          <Typography variant="h4" sx={{ color: 'primary.main', mb: 0.5 }}>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Box>
        {action && (
          <Button
            variant="contained"
            startIcon={actionIcon}
            onClick={action}
          >
            {actionText}
          </Button>
        )}
      </Box>
      {children && (
        <Box sx={{ mt: 3 }}>
          {children}
        </Box>
      )}
    </Box>
  );
};

export default PageHeader;