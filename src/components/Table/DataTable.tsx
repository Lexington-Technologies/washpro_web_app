import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    getSortedRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    SortingState,
    ColumnDef,
    PaginationState,
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
    totalCount?: number;
    onPaginationChange?: (pagination: { pageIndex: number; pageSize: number }) => void;
    pagination?: PaginationState;
    onRowClick?: (row: T) => void;
    wardFilter?: string;
    villageFilter?: string;
    hamletFilter?: string;
    onFilterChange?: (filters: { ward?: string; village?: string; hamlet?: string }) => void;
    searchQuery?: string;
    onSearchChange?: (search: string) => void;
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
    totalCount = 0,
    onPaginationChange,
    pagination: controlledPagination,
    onRowClick,
    wardFilter = '',
    villageFilter = '',
    hamletFilter = '',
    searchQuery,
    onSearchChange,
    onFilterChange,
  }: DataTableProps<T>) {
    const [sorting, setSorting] = useState<SortingState>([]);
     // Use an internal search state for input control.
    const [internalSearch, setInternalSearch] = useState<string>(searchQuery || '');
    const [globalFilter, setGlobalFilter] = useState('');
  
    const [localPagination, setLocalPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });
  
    // Use controlled pagination if provided; otherwise local state.
    const pagination = controlledPagination || localPagination;
    const setPagination = onPaginationChange || setLocalPagination;
  
    const tableData = Array.isArray(data) ? data : [];
  
    const columnsWithSN: ColumnDef<T, any>[] = [
        {
            id: 'serialNumber',
            header: 'S/N',
            cell: ({ row }) => pagination.pageIndex * pagination.pageSize + row.index + 1,
            enableSorting: false,
        },
        ...columns
    ];
  
    const table = useReactTable({
        data: tableData,
        columns: columnsWithSN,
        state: {
            sorting,
            globalFilter,
            pagination,
        },
        onSortingChange: setSorting,
        onGlobalFilterChange: setGlobalFilter,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        manualPagination: !!onPaginationChange,
        pageCount: Math.ceil(totalCount / pagination.pageSize),
        enableSorting,
    });

    const getUniqueValues = (data: T[], key: keyof T) => {
        return Array.from(new Set(data.map(item => item[key]))).filter(Boolean);
    };
  
    const wards = getUniqueValues(tableData, 'ward');
    const villages = wardFilter && wardFilter !== 'All'
      ? getUniqueValues(tableData.filter(item => item.ward === wardFilter), 'village')
      : [];
    const hamlets = villageFilter && villageFilter !== 'All'
      ? getUniqueValues(tableData.filter(item => item.village === villageFilter), 'hamlet')
      : [];
  
  
    const handlePageChange = (event: unknown, newPage: number) => {
        setPagination({ pageIndex: newPage, pageSize: pagination.pageSize });
    };
  
    const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newPageSize = parseInt(event.target.value, 10);
        setPagination({ pageIndex: 0, pageSize: newPageSize });
    };
  
    return (
        <Box sx={{ width: '100%', py: 2, px: 3, bgcolor: '#f4f6f8', borderRadius: '12px' }}>
            {/* Filters and Search */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                {/* Ward Filter */}
                <TextField
                    select
                    variant="outlined"
                    size="small"
                    value={wardFilter}
                    onChange={(e) =>
                      onFilterChange?.({ ward: e.target.value, village: '', hamlet: '' })
                    }
                    SelectProps={{ native: true }}
                    sx={{ minWidth: 120 }}
                >
                    <option value="">All Wards</option>
                    {wards.map(ward => (
                      <option key={ward} value={ward}>
                        {ward}
                      </option>
                    ))}
                </TextField>
  
                {/* Village Filter */}
                <TextField
                    select
                    variant="outlined"
                    size="small"
                    value={villageFilter}
                    onChange={(e) =>
                      onFilterChange?.({ ward: wardFilter, village: e.target.value, hamlet: '' })
                    }
                    SelectProps={{ native: true }}
                    disabled={!wardFilter}
                    sx={{ minWidth: 120 }}
                >
                    <option value="">All Villages</option>
                    {villages.map(village => (
                      <option key={village} value={village}>
                        {village}
                      </option>
                    ))}
                </TextField>
  
                {/* Hamlet Filter */}
                <TextField
                    select
                    variant="outlined"
                    size="small"
                    value={hamletFilter}
                    onChange={(e) =>
                      onFilterChange?.({ ward: wardFilter, village: villageFilter, hamlet: e.target.value })
                    }
                    SelectProps={{ native: true }}
                    disabled={!villageFilter}
                    sx={{ minWidth: 120 }}
                >
                    <option value="">All Hamlets</option>
                    {hamlets.map(hamlet => (
                      <option key={hamlet} value={hamlet}>
                        {hamlet}
                      </option>
                    ))}
                </TextField>
  
                {enableSearch && (
                    <TextField
                        fullWidth
                        size="small"
                        value={internalSearch}
                        onChange={e => setInternalSearch(e.target.value)}
                        onKeyPress={e => {
                        if (e.key === 'Enter' && onSearchChange) {
                            onSearchChange(internalSearch);
                        }
                        }}
                        placeholder={searchPlaceholder}
                        sx={{
                        width: '50%',
                        marginLeft: 'auto',
                        '& .MuiOutlinedInput-root': {
                            borderRadius: '8px',
                            backgroundColor: '#ffffff',
                            '&:hover': { backgroundColor: '#f1f5f9' },
                            '& fieldset': { borderColor: 'transparent' },
                            '&:hover fieldset': { borderColor: 'transparent' },
                            '&.Mui-focused fieldset': {
                            borderColor: 'primary.main',
                            borderWidth: '1px',
                            },
                        },
                        '& input': { textTransform: 'capitalize' }
                        }}
                        InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                            <Search sx={{ color: 'text.secondary' }} />
                            </InputAdornment>
                        ),
                        }}
                    />
                    )}
                </Box>
  
            {/* Table */}
            <TableContainer component={Paper} sx={{
                boxShadow: 'none',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: '12px',
                overflow: 'hidden',
                mb: 2,
            }}>
                {isLoading && <LinearProgress sx={{ height: '2px' }} />}
                <Table sx={{ minWidth: 650 }}>
                    <TableHead>
                        {table.getHeaderGroups().map(headerGroup => (
                            <TableRow key={headerGroup.id}>
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
                                            '&:hover': enableSorting && header.column.getCanSort() ? { color: '#B0BEC5' } : {},
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
                                                    {({
                                                      asc: <ArrowUpward sx={{ fontSize: 14 }} />,
                                                      desc: <ArrowDownward sx={{ fontSize: 14 }} />
                                                    }[header.column.getIsSorted() as string]) ?? null}
                                                </Box>
                                            )}
                                        </Box>
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableHead>
                    <TableBody>
                        {table.getRowModel().rows.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={columnsWithSN.length}
                                    align="center"
                                    sx={{ py: 12 }}
                                >
                                    <Typography color="text.secondary" sx={{ fontSize: '0.875rem', textTransform: 'capitalize' }}>
                                        {noDataMessage}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            table.getRowModel().rows.map((row, index) => (
                                <TableRow
                                    key={row.id}
                                    onClick={() => onRowClick?.(row.original)}
                                    sx={{
                                        cursor: 'pointer',
                                        bgcolor: index % 2 === 0 ? '#f8fafc' : '#e0e0e0',
                                        '&:hover': {
                                            bgcolor: 'rgba(0, 0, 0, 0.08)',
                                            transition: 'background-color 0.2s ease',
                                        },
                                    }}
                                >
                                    {row.getVisibleCells().map(cell => (
                                        <TableCell
                                            key={cell.id}
                                            sx={{
                                                height: '52px',
                                                fontSize: '0.875rem',
                                                borderBottom: '1px solid',
                                                borderColor: 'divider',
                                                textTransform: 'capitalize',
                                            }}
                                        >
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
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
                    count={totalCount}
                    page={pagination.pageIndex}
                    onPageChange={handlePageChange}
                    rowsPerPage={pagination.pageSize}
                    onRowsPerPageChange={handleRowsPerPageChange}
                    rowsPerPageOptions={[5, 10, 25, 50, 100]}
                    sx={{
                        '.MuiTablePagination-select': {
                            borderRadius: '6px',
                            textTransform: 'capitalize',
                        },
                        '.MuiTablePagination-selectIcon': {
                            color: 'text.secondary',
                        },
                        '.MuiTablePagination-displayedRows': {
                            textTransform: 'capitalize',
                        }
                    }}
                />
            )}
        </Box>
    );
  }
  
  