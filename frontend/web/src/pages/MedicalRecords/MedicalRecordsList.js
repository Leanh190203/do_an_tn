import React, { useState, useEffect } from 'react';
import { Box, Button, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DataGrid from '../../components/DataGrid';
import { useNavigate } from 'react-router-dom';

const MedicalRecordsList = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // TODO: Replace with actual API call
    const fetchRecords = async () => {
      try {
        // Simulated data - replace with API call
        const data = [
          {
            id: 1,
            patientName: 'Nguyễn Văn A',
            petName: 'Mèo Mướp',
            diagnosis: 'Viêm da',
            date: '2025-04-10',
            status: 'Đang điều trị'
          },
          // Add more sample data as needed
        ];
        setRecords(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching records:', error);
        setLoading(false);
      }
    };

    fetchRecords();
  }, []);

  const columns = [
    {
      field: 'patientName',
      headerName: 'Tên chủ',
      width: 200,
    },
    {
      field: 'petName',
      headerName: 'Tên thú cưng',
      width: 150,
    },
    {
      field: 'diagnosis',
      headerName: 'Chẩn đoán',
      width: 200,
    },
    {
      field: 'date',
      headerName: 'Ngày khám',
      width: 150,
    },
    {
      field: 'status',
      headerName: 'Trạng thái',
      width: 150,
    }
  ];

  const handleDeleteSelected = (selectedIds) => {
    // TODO: Implement delete functionality
    console.log('Deleting records:', selectedIds);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5" component="h1">
          Danh sách bệnh án
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/medical-records/new')}
        >
          Thêm bệnh án mới
        </Button>
      </Box>

      <DataGrid
        columns={columns}
        rows={records}
        loading={loading}
        title="Bệnh án"
        enableSelection={true}
        onDeleteSelected={handleDeleteSelected}
      />
    </Box>
  );
};

export default MedicalRecordsList;