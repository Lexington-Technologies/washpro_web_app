import {
    Paper,
    Typography,
    Avatar,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
  } from '@mui/material';
  
  const columns = [
    { accessorKey: 'sn', header: 'SN' },
    { accessorKey: 'picture', header: 'Picture' },
    { accessorKey: 'ward', header: 'Ward' },
    { accessorKey: 'village', header: 'Village' },
    { accessorKey: 'hamlet', header: 'Hamlet' },
    { accessorKey: 'category', header: 'Category' },
  ];
  
  const WaterSourceRiskOverview = ({ data }) => {
    const table = useTable({
      columns,
      data: data.map((item, index) => ({
        sn: index + 1,
        picture: (
          <Avatar
            src="https://via.placeholder.com/50"
            alt="Water Source"
            sx={{ width: 40, height: 40 }}
          />
        ),
        ward: item.location.ward,
        village: item.location.village,
        hamlet: item.location.hamlet,
        category: item.waterSourceType,
      })),
    });
  
    return (
      <Paper sx={{ p: 2, mt: 4, borderRadius: 2, boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
          Water Source Risk Overview
        </Typography>
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: '#F1F1F5' }}>
              <TableRow>
                {columns.map((col) => (
                  <TableCell key={col.accessorKey} sx={{ fontWeight: 600 }}>
                    {col.header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{cell.renderValue()}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    );
  };

  export default WaterSourceRiskOverview;