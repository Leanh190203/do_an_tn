import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Divider,
  CircularProgress,
  Fade
} from '@mui/material';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import reportService from '../services/reportService';
import { toast } from 'react-toastify';
import '../styles/Reports.css';

const Reports = () => {
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState({
    monthlyData: [],
    serviceData: [],
    petTypeData: [],
    statusData: []
  });

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        const data = await reportService.getReportsData();
        setReportData(data);
      } catch (error) {
        console.error('Failed to fetch report data:', error);
        toast.error('Lỗi khi tải dữ liệu báo cáo');
      } finally {
        setLoading(false);
      }
    };

    fetchReportData();
  }, []);

  const COLORS = ['#3f51b5', '#00bcd4', '#4caf50', '#f44336', '#ff9800', '#9c27b0'];
  const GRADIENTS = [
    ['#3f51b5', '#5c6bc0'],
    ['#00bcd4', '#4dd0e1'],
    ['#4caf50', '#66bb6a'],
    ['#f44336', '#ef5350'],
    ['#ff9800', '#ffa726'],
    ['#9c27b0', '#ba68c8']
  ];

  const getStatusName = (status) => {
    const statusMap = {
      'pending': 'Chờ xác nhận',
      'confirmed': 'Đã xác nhận',
      'cancelled': 'Đã hủy',
      'completed': 'Hoàn thành'
    };
    return statusMap[status] || status;
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || !payload.length) return null;
    
    return (
      <div style={{
        backgroundColor: 'rgba(255, 255, 255, 0.98)',
        padding: '12px 16px',
        border: 'none',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
        borderRadius: '12px',
      }}>
        <p style={{ margin: 0, fontWeight: 500 }}>{`${label}: ${payload[0].value}`}</p>
      </div>
    );
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  return (
    <Fade in timeout={500}>
      <Box className="reports-container">
        <Typography variant="h4" className="reports-title animate-fade-in">
          Báo cáo & Thống kê
        </Typography>

        <Grid container spacing={3}>
          {/* Monthly Visits Chart */}
          <Grid item xs={12} md={8} className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <Card className="report-card">
              <CardHeader
                title="Lượt khám theo tháng"
              />
              <CardContent className="report-chart-container">
                <ResponsiveContainer>
                  <LineChart
                    data={reportData.monthlyData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                  >
                    <defs>
                      <linearGradient id="visitColor" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3f51b5" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#3f51b5" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
                    <XAxis 
                      dataKey="month" 
                      stroke="#666"
                      tick={{ fill: '#666', fontSize: 12 }}
                    />
                    <YAxis 
                      stroke="#666"
                      tick={{ fill: '#666', fontSize: 12 }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="visits"
                      stroke="#3f51b5"
                      strokeWidth={3}
                      dot={{ r: 6, fill: "#3f51b5", strokeWidth: 2 }}
                      activeDot={{ r: 8, strokeWidth: 2 }}
                      name="Số lượt khám"
                      fill="url(#visitColor)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Service Distribution Chart */}
          <Grid item xs={12} md={4} className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <Card className="report-card">
              <CardHeader
                title="Phân bổ dịch vụ"
              />
              <CardContent className="report-chart-container">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={reportData.serviceData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                      nameKey="name"
                    >
                      {reportData.serviceData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={COLORS[index % COLORS.length]}
                          stroke="none"
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="report-legend">
                  {reportData.serviceData.map((entry, index) => (
                    <div key={`legend-${index}`} className="legend-item">
                      <div
                        className="legend-color"
                        style={{ 
                          background: `linear-gradient(135deg, ${GRADIENTS[index % GRADIENTS.length][0]}, ${GRADIENTS[index % GRADIENTS.length][1]})` 
                        }}
                      />
                      <span>{`${entry.name}: ${entry.value}`}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </Grid>

          {/* Pet Types Distribution */}
          <Grid item xs={12} md={6} className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <Card className="report-card">
              <CardHeader
                title="Phân bổ loại thú cưng"
              />
              <CardContent className="report-chart-container">
                <ResponsiveContainer>
                  <BarChart
                    data={reportData.petTypeData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                  >
                    <defs>
                      {GRADIENTS.map((gradient, index) => (
                        <linearGradient
                          key={`gradient-${index}`}
                          id={`barColor-${index}`}
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop offset="5%" stopColor={gradient[0]} stopOpacity={0.8}/>
                          <stop offset="95%" stopColor={gradient[1]} stopOpacity={0.3}/>
                        </linearGradient>
                      ))}
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
                    <XAxis dataKey="name" stroke="#666" />
                    <YAxis stroke="#666" />
                    <Tooltip />
                    <Bar
                      dataKey="count"
                      radius={[4, 4, 0, 0]}
                      name="Số lượng"
                    >
                      {reportData.petTypeData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={`url(#barColor-${index % GRADIENTS.length})`}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Appointment Status Distribution */}
          <Grid item xs={12} md={6} className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <Card className="report-card">
              <CardHeader
                title="Trạng thái lịch hẹn"
              />
              <CardContent className="report-chart-container">
                <ResponsiveContainer>
                  <PieChart>
                    <defs>
                      {GRADIENTS.map((gradient, index) => (
                        <linearGradient
                          key={`gradient-${index}`}
                          id={`pieColor-${index}`}
                          x1="0"
                          y1="0"
                          x2="1"
                          y2="1"
                        >
                          <stop offset="0%" stopColor={gradient[0]}/>
                          <stop offset="100%" stopColor={gradient[1]}/>
                        </linearGradient>
                      ))}
                    </defs>
                    <Pie
                      data={reportData.statusData.map(item => ({
                        ...item,
                        name: getStatusName(item.name)
                      }))}
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      dataKey="count"
                      nameKey="name"
                      labelLine={false}
                      label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {reportData.statusData.map((entry, index) => (
                        <Cell 
                          key={`status-cell-${index}`} 
                          fill={`url(#pieColor-${index % GRADIENTS.length})`}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="report-legend">
                  {reportData.statusData.map((entry, index) => (
                    <div key={`legend-${index}`} className="legend-item">
                      <div
                        className="legend-color"
                        style={{ 
                          background: `linear-gradient(135deg, ${GRADIENTS[index % GRADIENTS.length][0]}, ${GRADIENTS[index % GRADIENTS.length][1]})` 
                        }}
                      />
                      <span>{`${getStatusName(entry.name)}: ${entry.count}`}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Fade>
  );
};

export default Reports;