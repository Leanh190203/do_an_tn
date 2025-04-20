import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Box,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import EmptyState from './EmptyState';

const DataTable = ({
  columns,
  data,
  searchable = true,
  searchPlaceholder = "Tìm kiếm...",
  searchFields = [],
  filterOptions = null,
  filterValue = '',
  onFilterChange = null,
  emptyStateProps = {},
  defaultSort = { field: null, direction: 'asc' }
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState(defaultSort);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSort = (field) => {
    setSortConfig(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Filter and search data
  const filteredData = data.filter(item => {
    const matchesSearch = searchable && searchTerm
      ? searchFields.some(field => {
          const value = field.split('.').reduce((obj, key) => obj?.[key], item);
          return value?.toString().toLowerCase().includes(searchTerm.toLowerCase());
        })
      : true;

    const matchesFilter = filterValue && onFilterChange
      ? item[filterOptions.field] === filterValue
      : true;

    return matchesSearch && matchesFilter;
  });

  // Sort data
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortConfig.field) return 0;
    
    const aValue = sortConfig.field.split('.').reduce((obj, key) => obj?.[key], a);
    const bValue = sortConfig.field.split('.').reduce((obj, key) => obj?.[key], b);
    
    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  // Paginate data
  const paginatedData = sortedData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box>
      <Box sx={{ p: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        {searchable && (
          <TextField
            sx={{ flexGrow: 1, minWidth: '200px' }}
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        )}

        {filterOptions && (
          <FormControl sx={{ minWidth: '200px' }}>
            <InputLabel>{filterOptions.label}</InputLabel>
            <Select
              value={filterValue}
              onChange={(e) => onFilterChange(e.target.value)}
              label={filterOptions.label}
            >
              {filterOptions.options.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </Box>

      {paginatedData.length === 0 ? (
        <EmptyState {...emptyStateProps} />
      ) : (
        <>
          <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
            <Table>
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.field}
                      align={column.align || 'left'}
                      sx={{ 
                        cursor: column.sortable ? 'pointer' : 'default',
                        '&:hover': column.sortable ? { backgroundColor: 'action.hover' } : {}
                      }}
                      onClick={() => column.sortable && handleSort(column.field)}
                    >
                      {column.headerName}
                      {column.sortable && sortConfig.field === column.field && (
                        <span>{sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}</span>
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedData.map((row, index) => (
                  <TableRow
                    key={row.id || index}
                    hover
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    {columns.map((column) => (
                      <TableCell
                        key={column.field}
                        align={column.align || 'left'}
                      >
                        {column.renderCell
                          ? column.renderCell(row)
                          : column.field.split('.').reduce((obj, key) => obj?.[key], row)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={filteredData.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25, 50]}
            labelRowsPerPage="Số hàng mỗi trang:"
            labelDisplayedRows={({ from, to, count }) => 
              `${from}-${to} trong số ${count}`
            }
          />
        </>
      )}
    </Box>
  );
};

export default DataTable;