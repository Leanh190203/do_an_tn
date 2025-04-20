import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  Divider,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Pets as PetsIcon,
  People as PeopleIcon,
  EventNote as EventNoteIcon,
  Assessment as AssessmentIcon,
  ExitToApp as ExitToAppIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();
  const drawerWidth = 240;

  const menuItems = [
    { text: 'Tổng quan', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Thú cưng', icon: <PetsIcon />, path: '/pets' },
    { text: 'Khách hàng', icon: <PeopleIcon />, path: '/customers' },
    { text: 'Lịch hẹn', icon: <EventNoteIcon />, path: '/appointments' },
    { text: 'Báo cáo', icon: <AssessmentIcon />, path: '/reports' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          bgcolor: '#1a237e',
          color: 'white',
        },
      }}
    >
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="h6" sx={{ color: 'white' }}>
          Quản lý thú cưng
        </Typography>
      </Box>
      <Divider sx={{ bgcolor: 'rgba(255,255,255,0.12)' }} />
      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            onClick={() => navigate(item.path)}
            sx={{
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.08)',
              },
            }}
          >
            <ListItemIcon sx={{ color: 'white' }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
      <Divider sx={{ bgcolor: 'rgba(255,255,255,0.12)', mt: 'auto' }} />
      <List>
        <ListItem
          button
          onClick={handleLogout}
          sx={{
            '&:hover': {
              bgcolor: 'rgba(255,255,255,0.08)',
            },
          }}
        >
          <ListItemIcon sx={{ color: 'white' }}>
            <ExitToAppIcon />
          </ListItemIcon>
          <ListItemText primary="Đăng xuất" />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;
