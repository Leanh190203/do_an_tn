import React, { useState, useEffect } from 'react';
import {
  Box, Grid, Card, CardContent, Typography, IconButton, 
  Table, TableBody, TableCell, TableContainer, TableHead, 
  TableRow, Paper, CircularProgress, Button, Divider
} from '@mui/material';
import {
  Pets as PetsIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  TrendingUp as TrendingUpIcon,
  MoreVert as MoreVertIcon,
  Add as AddIcon,
  ShowChart as ShowChartIcon,
  Notifications as NotificationsIcon
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Dashboard.css';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import dashboardService from '../services/dashboardService';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPets: 0,
    totalCustomers: 0,
    totalAppointments: 0,
    recentAppointments: [],
    notifications: [],
    chartData: []
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await dashboardService.getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        toast.error('Lỗi khi tải dữ liệu bảng điều khiển');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleAddAppointment = () => {
    navigate('/appointments', { state: { openAddDialog: true } });
  };

  const handleViewAllAppointments = () => {
    navigate('/appointments');
  };

  const getStatusClass = (status) => {
    const statusMap = {
      'pending': 'pending',
      'confirmed': 'confirmed',
      'cancelled': 'cancelled',
      'completed': 'completed',
      'Pending': 'pending',
      'Confirmed': 'confirmed',
      'Cancelled': 'cancelled', 
      'Completed': 'completed'
    };
    return statusMap[status] || 'pending';
  };

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <Card className="dashboard-stat-card" sx={{ bgcolor: color }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h6" sx={{ color: 'white', mb: 1 }}>{title}</Typography>
            <Typography variant="h4" sx={{ color: 'white' }}>{value}</Typography>
          </Box>
          <Icon sx={{ fontSize: 40, color: 'white', opacity: 0.8 }} />
        </Box>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box className="dashboard-container">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" className="dashboard-title">
          Bảng Điều Khiển
        </Typography>
        <Box>
          <Button 
            startIcon={<AddIcon />} 
            variant="contained" 
            color="primary" 
            sx={{ mr: 2 }}
            onClick={handleAddAppointment}
          >
            Thêm lịch hẹn
          </Button>
          <IconButton>
            <NotificationsIcon />
          </IconButton>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Stats Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Tổng số thú cưng"
            value={stats.totalPets}
            icon={PetsIcon}
            color="#2196f3"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Khách hàng"
            value={stats.totalCustomers}
            icon={PersonIcon}
            color="#4caf50"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Lịch hẹn"
            value={stats.totalAppointments}
            icon={CalendarIcon}
            color="#ff9800"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Tăng trưởng"
            value="15%"
            icon={TrendingUpIcon}
            color="#f44336"
          />
        </Grid>

        {/* Chart */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Thống kê lượt khám trong tuần
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="visits" fill="#1976d2" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Notifications */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Thông báo mới
              </Typography>
              <Box sx={{ mt: 2 }}>
                {stats.notifications.length === 0 ? (
                  <Typography variant="body2" color="textSecondary">
                    Không có thông báo mới
                  </Typography>
                ) : (
                  stats.notifications.map((notification, index) => (
                    <React.Fragment key={notification.id}>
                      <Box sx={{ py: 1 }}>
                        <Typography variant="body1">{notification.message}</Typography>
                        <Typography variant="caption" color="textSecondary">
                          {notification.time}
                        </Typography>
                      </Box>
                      {index < stats.notifications.length - 1 && <Divider />}
                    </React.Fragment>
                  ))
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Appointments Table */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Lịch hẹn gần đây</Typography>
                <Button startIcon={<ShowChartIcon />} variant="outlined" onClick={handleViewAllAppointments}>
                  Xem tất cả
                </Button>
              </Box>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Thú cưng</TableCell>
                      <TableCell>Chủ</TableCell>
                      <TableCell>Ngày</TableCell>
                      <TableCell>Dịch vụ</TableCell>
                      <TableCell>Trạng thái</TableCell>
                      <TableCell align="right">Thao tác</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {stats.recentAppointments.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} align="center">
                          Không có lịch hẹn nào
                        </TableCell>
                      </TableRow>
                    ) : (
                      stats.recentAppointments.map((appointment) => (
                        <TableRow key={appointment.id} hover>
                          <TableCell>{appointment.petName}</TableCell>
                          <TableCell>{appointment.ownerName}</TableCell>
                          <TableCell>{appointment.date}</TableCell>
                          <TableCell>{appointment.service}</TableCell>
                          <TableCell>
                            <span className={`status-badge ${getStatusClass(appointment.status)}`}>
                              {appointment.status}
                            </span>
                          </TableCell>
                          <TableCell align="right">
                            <IconButton 
                              size="small"
                              onClick={() => navigate(`/appointments?id=${appointment.id}`)}
                            >
                              <MoreVertIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;