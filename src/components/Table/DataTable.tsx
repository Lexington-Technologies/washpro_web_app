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
    IconButton,
    TextField,
    InputAdornment,
    LinearProgress,
    Typography,
    Tooltip,
} from '@mui/material';
import {
    Search,
    ArrowUpward,
    ArrowDownward,
} from '@mui/icons-material';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

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

    const navigate = useNavigate();
    const table = useReactTable({
        data,
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
        <Box sx={{ width: '100%' }}>
            {/* Search Field */}
            {enableSearch && (
                <Box sx={{ mb: 2 }}>
                    <TextField
                        fullWidth
                        size="small"
                        value={globalFilter}
                        onChange={e => setSearch(e.target.value)}
                        placeholder={searchPlaceholder}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Box>
            )}

            {/* Table */}
            <TableContainer component={Paper}>
                {isLoading && (
                    <LinearProgress sx={{ borderTopLeftRadius: 4, borderTopRightRadius: 4 }} />
                )}
                <Table>
                    <TableHead>
                        {table.getHeaderGroups().map(headerGroup => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map(header => (
                                    <TableCell
                                        key={header.id}
                                        sx={{
                                            fontWeight: 'bold',
                                            bgcolor: '#f8fafc',
                                            cursor: enableSorting && header.column.getCanSort() ? 'pointer' : 'default',
                                            userSelect: 'none',
                                        }}
                                        onClick={header.column.getToggleSortingHandler()}
                                    >
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                            {flexRender(header.column.columnDef.header, header.getContext())}
                                            {enableSorting && header.column.getCanSort() && (
                                                <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center' }}>
                                                    {{
                                                        asc: <ArrowUpward sx={{ fontSize: 16 }} />,
                                                        desc: <ArrowDownward sx={{ fontSize: 16 }} />,
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
                                    colSpan={columns.length}
                                    align="center"
                                    sx={{ py: 8 }}
                                >
                                    <Typography color="text.secondary">
                                        {noDataMessage}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            table.getRowModel().rows.map(row => (
                                <TableRow
                                    key={row.id}
                                    sx={{ '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.04)' } }}
                                >
                                    {row.getVisibleCells().map(cell => (
                                        <TableCell sx={{ cursor: 'pointer', textDecoration: 'none',
                                            height: '40px',
                                         }} component={Link} to={`${cell.row.original?._id}`} key={cell.id}>
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
                />
            )}
        </Box>
    );
} 