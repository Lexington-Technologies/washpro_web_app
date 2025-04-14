import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  SortingState,
  ColumnDef,
} from '@tanstack/react-table';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  TextField,
  InputAdornment,
  LinearProgress,
  Typography,
  Button,
} from '@mui/material';
import {
  Search,
  ArrowUpward,
  ArrowDownward,
} from '@mui/icons-material';
import { useState } from 'react';

interface DataTableProps<T extends object> {
  data: T[];
  columns: ColumnDef<T, any>[];
  isLoading?: boolean;
  enableSearch?: boolean;
  searchPlaceholder?: string;
  enablePagination?: boolean;
  enableSorting?: boolean;
  noDataMessage?: string;
  onRowClick?: (row: T) => void;
  viewButtonText?: string;
}

export function DataTable<T extends object>({
  data,
  columns,
  isLoading = false,
  enableSearch = true,
  searchPlaceholder = "Search...",
  enablePagination = true,
  enableSorting = true,
  noDataMessage = "No data available",
  onRowClick,
  viewButtonText = "View",
}: DataTableProps<T>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');

  // Ensure data is an array
  const tableData = Array.isArray(data) ? data : [];

  const table = useReactTable({
    data: tableData,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    enableSorting,
  });

  return (
    <Box sx={{ width: '100%', py: 2, px: 3, bgcolor: '#f4f6f8', borderRadius: '12px' }}>
      {/* Search */}
      {enableSearch && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
          <TextField
            fullWidth
            size="small"
            value={globalFilter}
            onChange={e => setGlobalFilter(e.target.value)}
            placeholder={searchPlaceholder}
            sx={{
              width: '50%',
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
                backgroundColor: '#ffffff',
                '&:hover': {
                  backgroundColor: '#f1f5f9',
                },
                '& fieldset': {
                  borderColor: 'transparent',
                },
                '&:hover fieldset': {
                  borderColor: 'transparent',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'primary.main',
                  borderWidth: '1px',
                },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: 'text.secondary' }} />
                </InputAdornment>
              ),
            }}
          />
        </Box>
      )}

      {/* Table */}
      <TableContainer 
        component={Paper} 
        sx={{
          boxShadow: 'none',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: '12px',
          overflow: 'hidden',
          mb: 2,
        }}
      >
        {isLoading && (
          <LinearProgress sx={{ height: '2px' }} />
        )}
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {/* Add Serial Number Header */}
                <TableCell
                  sx={{
                    fontWeight: 600,
                    bgcolor: '#25306B',
                    color: 'white',
                    fontSize: '0.875rem',
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    textTransform: 'uppercase',
                    letterSpacing: '0.025em',
                  }}
                >
                  SN
                </TableCell>
                {headerGroup.headers.map(header => (
                  <TableCell
                    key={header.id}
                    sx={{
                      fontWeight: 600,
                      bgcolor: '#25306B',
                      color: 'white',
                      fontSize: '0.875rem',
                      borderBottom: '1px solid',
                      borderColor: 'divider',
                      cursor: enableSorting && header.column.getCanSort() ? 'pointer' : 'default',
                      userSelect: 'none',
                      textTransform: 'uppercase',
                      letterSpacing: '0.025em',
                      '&:hover': enableSorting && header.column.getCanSort() ? {
                        color: '#B0BEC5',
                      } : {},
                    }}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.2 }}>
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {enableSorting && header.column.getCanSort() && (
                        <Box component="span" sx={{ 
                          display: 'inline-flex', 
                          alignItems: 'center',
                          color: header.column.getIsSorted() ? 'primary.main' : 'inherit',
                        }}>
                          {{
                            asc: <ArrowUpward sx={{ fontSize: 14 }} />,
                            desc: <ArrowDownward sx={{ fontSize: 14 }} />,
                          }[header.column.getIsSorted() as string] ?? null}
                        </Box>
                      )}
                    </Box>
                  </TableCell>
                ))}
                {onRowClick && (
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      bgcolor: '#25306B',
                      color: 'white',
                      fontSize: '0.875rem',
                      borderBottom: '1px solid',
                      borderColor: 'divider',
                      textTransform: 'uppercase',
                      letterSpacing: '0.025em',
                    }}
                  >
                    Actions
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableHead>
          <TableBody>
            {table.getRowModel().rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (onRowClick ? 1 : 0)}
                  align="center"
                  sx={{ py: 12 }}
                >
                  <Typography 
                    color="text.secondary" 
                    sx={{ 
                      fontSize: '0.875rem',
                    }}
                  >
                    {noDataMessage}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row, index) => (
                <TableRow
                  key={row.id}
                  sx={{
                    bgcolor: index % 2 === 0 ? '#f8fafc' : '#e0e0e0',
                    '&:hover': { 
                      bgcolor: 'rgba(0, 0, 0, 0.08)',
                      transition: 'background-color 0.2s ease',
                    },
                  }}
                >
                  {/* Add Serial Number Cell */}
                  <TableCell 
                    sx={{
                      height: '52px',
                      fontSize: '0.875rem',
                      borderBottom: '1px solid',
                      borderColor: 'divider',
                    }}
                  >
                    {index + 1}
                  </TableCell>
                  {row.getVisibleCells().map(cell => (
                    <TableCell 
                      key={cell.id}
                      sx={{
                        height: '52px',
                        fontSize: '0.875rem',
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                      }}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                  {onRowClick && (
                    <TableCell>
                      <Button 
                        variant="outlined" 
                        size="small"
                        onClick={() => onRowClick(row.original)}
                        sx={{ 
                          textTransform: 'none',
                          borderColor: '#25306B',
                          color: '#25306B',
                          '&:hover': {
                            backgroundColor: '#25306B',
                            color: 'white',
                          }
                        }}
                      >
                        {viewButtonText}
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      {enablePagination && (
        <TablePagination
          component="div"
          count={table.getFilteredRowModel().rows.length}
          page={table.getState().pagination.pageIndex}
          onPageChange={(_, page) => table.setPageIndex(page)}
          rowsPerPage={table.getState().pagination.pageSize}
          onRowsPerPageChange={e => {
            table.setPageSize(Number(e.target.value));
          }}
          rowsPerPageOptions={[5, 10, 25, 50]}
          sx={{
            '.MuiTablePagination-select': {
              borderRadius: '6px',
            },
            '.MuiTablePagination-selectIcon': {
              color: 'text.secondary',
            },
          }}
        />
      )}
    </Box>
  );
}