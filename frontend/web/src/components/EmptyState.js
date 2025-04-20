import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { InboxOutlined as InboxIcon } from '@mui/icons-material';

const EmptyState = ({
  icon: IconComponent = InboxIcon,
  title = 'Không có dữ liệu',
  description = 'Chưa có dữ liệu nào được thêm vào.',
  action,
  actionText,
  sx = {}
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: 4,
        ...sx
      }}
    >
      <IconComponent
        sx={{
          fontSize: 48,
          color: 'text.secondary',
          mb: 2
        }}
      />
      <Typography
        variant="h6"
        color="text.primary"
        gutterBottom
      >
        {title}
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        align="center"
        sx={{ mb: action ? 3 : 0 }}
      >
        {description}
      </Typography>
      {action && (
        <Button
          variant="contained"
          onClick={action}
        >
          {actionText}
        </Button>
      )}
    </Box>
  );
};

export default EmptyState;