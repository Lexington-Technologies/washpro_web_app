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
} from '@mui/material';
import {
    Search,
    ArrowUpward,
    ArrowDownward,
} from '@mui/icons-material';
import { useState } from 'react';
import { Link } from 'react-router-dom';

interface DataTableProps<T extends object> {
    data: T[];
    columns: ColumnDef<T, any>[];
    isLoading?: boolean;
    enableSearch?: boolean;
    searchPlaceholder?: string;
    enablePagination?: boolean;
    enableSorting?: boolean;
    noDataMessage?: string;
    setSearch?: (search: string) => void;
    setPage?: (page: number) => void;
    setLimit?: (limit: number) => void;
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
    setSearch,
    setPage,
    setLimit
}: DataTableProps<T>) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [selectedWard, setSelectedWard] = useState('');
    const [selectedVillage, setSelectedVillage] = useState('');
    const [selectedHamlet, setSelectedHamlet] = useState('');

    // Ensure data is an array
    const tableData = Array.isArray(data) ? data : [];

    // Add S/N column to the beginning of columns array
    const columnsWithSN: ColumnDef<T, any>[] = [
        {
            id: 'serialNumber',
            header: 'S/N',
            cell: ({ row }) => {
                const pageSize = table.getState().pagination.pageSize;
                const pageIndex = table.getState().pagination.pageIndex;
                return pageIndex * pageSize + row.index + 1;
            },
            enableSorting: false,
        },
        ...columns
    ];

    const table = useReactTable({
        data: tableData,
        columns: columnsWithSN, // Use the modified columns array
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

    // Add filters for ward, village, and hamlet
    const handleFilterChange = (columnId: string, value: string) => {
        table.getColumn(columnId)?.setFilterValue(value);
    };

    // Function to get unique values for select options
    const getUniqueValues = (data: T[], key: keyof T) => {
        return Array.from(new Set(data.map(item => item[key]))).filter(Boolean);
    };

    const wards = getUniqueValues(tableData, 'ward');
    const villages = selectedWard ? getUniqueValues(tableData.filter(item => item.ward === selectedWard), 'village') : [];
    const hamlets = selectedVillage ? getUniqueValues(tableData.filter(item => item.village === selectedVillage), 'hamlet') : [];

    return (
        <Box sx={{ width: '100%', py: 2, px: 3, bgcolor: '#f4f6f8', borderRadius: '12px' }}>
            {/* Filters and Search */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <TextField
                    select
                    // label="Ward"
                    variant="outlined"
                    size="small"
                    value={selectedWard}
                    onChange={(e) => {
                        setSelectedWard(e.target.value);
                        handleFilterChange('ward', e.target.value);
                        setSelectedVillage('');
                        setSelectedHamlet('');
                    }}
                    SelectProps={{
                        native: true,
                    }}
                    sx={{ minWidth: 120 }}
                >
                    <option value="">All Wards</option>
                    {wards.map(ward => (
                        <option key={ward} value={ward}>{ward}</option>
                    ))}
                </TextField>
                <TextField
                    select
                    // label="Village"
                    variant="outlined"
                    size="small"
                    value={selectedVillage}
                    onChange={(e) => {
                        setSelectedVillage(e.target.value);
                        handleFilterChange('village', e.target.value);
                        setSelectedHamlet('');
                    }}
                    SelectProps={{
                        native: true,
                    }}
                    disabled={!selectedWard}
                    sx={{ minWidth: 120 }}
                >
                    <option value="">All Villages</option>
                    {villages.map(village => (
                        <option key={village} value={village}>{village}</option>
                    ))}
                </TextField>
                <TextField
                    select
                    // label="Hamlet"
                    variant="outlined"
                    size="small"
                    value={selectedHamlet}
                    onChange={(e) => {
                        setSelectedHamlet(e.target.value);
                        handleFilterChange('hamlet', e.target.value);
                    }}
                    SelectProps={{
                        native: true,
                    }}
                    disabled={!selectedVillage}
                    sx={{ minWidth: 120 }}
                >
                    <option value="">All Hamlets</option>
                    {hamlets.map(hamlet => (
                        <option key={hamlet} value={hamlet}>{hamlet}</option>
                    ))}
                </TextField>
                {enableSearch && (
                    <TextField
                        fullWidth
                        size="small"
                        value={globalFilter}
                        onChange={e => setGlobalFilter(e.target.value)}
                        placeholder={searchPlaceholder}
                        sx={{
                            width: '50%',
                            marginLeft: 'auto',
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
                            '& input': {
                                textTransform: 'capitalize',
                            }
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
                                {headerGroup.headers.map(header => (
                                    <TableCell
                                        key={header.id}
                                        sx={{
                                            fontWeight: 600,
                                            bgcolor: '#e3f2fd',
                                            color: 'text.secondary',
                                            fontSize: '0.875rem',
                                            borderBottom: '1px solid',
                                            borderColor: 'divider',
                                            cursor: enableSorting && header.column.getCanSort() ? 'pointer' : 'default',
                                            userSelect: 'none',
                                            py: 2,
                                            px: 3,
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.025em',
                                            '&:hover': enableSorting && header.column.getCanSort() ? {
                                                color: 'text.primary',
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
                                    <Typography 
                                        color="text.secondary" 
                                        sx={{ 
                                            fontSize: '0.875rem',
                                            textTransform: 'capitalize',
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
                                    {row.getVisibleCells().map(cell => (
                                        <TableCell 
                                            component={Link} 
                                            to={`${cell.row.original?._id}`} 
                                            key={cell.id}
                                            sx={{
                                                cursor: 'pointer',
                                                textDecoration: 'none',
                                                color: 'text.primary',
                                                height: '52px',
                                                fontSize: '0.875rem',
                                                borderBottom: '1px solid',
                                                borderColor: 'divider',
                                                py: 2,
                                                px: 3,
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
                    count={table.getFilteredRowModel().rows.length}
                    page={table.getState().pagination.pageIndex}
                    onPageChange={(_, page) => setPage(page)}
                    rowsPerPage={table.getState().pagination.pageSize}
                    onRowsPerPageChange={e => setLimit(Number(e.target.value))}
                    rowsPerPageOptions={[5, 10, 25, 50]}
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