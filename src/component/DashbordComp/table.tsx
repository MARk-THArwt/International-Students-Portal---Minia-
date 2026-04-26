import * as React from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Toolbar,
  Typography,
  Paper,
  TextField,
  MenuItem,
} from '@mui/material';

// ================== TYPES ==================
interface Data {
  id: number;
  title: string;
  subtitle?: string;
  category: string;
  date: string;
  status: 'Success' | 'In Review' | 'Paid';
}

// ================== DATA ==================
function createData(
  id: number,
  title: string,
  subtitle: string,
  category: string,
  date: string,
  status: Data['status'],
): Data {
  return { id, title, subtitle, category, date, status };
}

const rows: Data[] = [
  createData(1, 'Document Uploaded', 'Transcript_Final.pdf', 'Admission', 'Oct 02, 2026', 'Success'),
  createData(2, 'Visa Extension Request', 'Ref: #VS-2023-899', 'Immigration', 'Sep 28, 2026', 'In Review'),
  createData(3, 'Registration Fee', '$250.00 via Stripe', 'Finance', 'Sep 15, 2026', 'Paid'),
];

// ================== STATUS STYLE ==================
const getStatusStyle = (status: string) => {
  switch (status) {
    case 'Success':
      return { bgcolor: '#D1FADF', color: '#027A48' };
    case 'In Review':
      return { bgcolor: '#FEF0C7', color: '#B54708' };
    case 'Paid':
      return { bgcolor: '#D1FADF', color: '#027A48' };
    default:
      return {};
  }
};

// ================== COMPONENT ==================
export function DashboardTable() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  // FILTER STATES
  const [search, setSearch] = React.useState('');
  const [categoryFilter, setCategoryFilter] = React.useState('All');
  const [statusFilter, setStatusFilter] = React.useState('All');

  // ================== FILTER ==================
  const filteredRows = React.useMemo(() => {
    return rows.filter((row) => {
      const matchesSearch =
        row.title.toLowerCase().includes(search.toLowerCase()) ||
        row.subtitle?.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        categoryFilter === 'All' || row.category === categoryFilter;

      const matchesStatus =
        statusFilter === 'All' || row.status === statusFilter;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [search, categoryFilter, statusFilter]);

  // ================== PAGINATION ==================
  const visibleRows = React.useMemo(
    () =>
      filteredRows.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      ),
    [filteredRows, page, rowsPerPage],
  );

  // ================== UI ==================
  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>

        {/* FILTER BAR */}
                    <span className='text-2xl font-bold text-[rgba(30,41,59,1)] justify-self-start ml-2'>Recent Activity</span>
        <Toolbar sx={{ display: 'flex', gap: 2, flexWrap: 'wrap',justifyContent:'center' }}>
           <TextField
            size="small"
            label="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <TextField
            select
            size="small"
            label="Category"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            {['All', 'Admission', 'Immigration', 'Finance'].map((c) => (
              <MenuItem key={c} value={c}>{c}</MenuItem>
            ))}
          </TextField>

          <TextField
            select
            size="small"
            label="Status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            {['All', 'Success', 'In Review', 'Paid'].map((s) => (
              <MenuItem key={s} value={s}>{s}</MenuItem>
            ))}
          </TextField>
        </Toolbar>

        {/* TABLE */}
        <TableContainer>
          <Table>

            {/* HEAD */}
            <TableHead>
              <TableRow>
                <TableCell>REQUEST / ACTION</TableCell>
                <TableCell>CATEGORY</TableCell>
                <TableCell>DATE</TableCell>
                <TableCell>STATUS</TableCell>
              </TableRow>
            </TableHead>

            {/* BODY */}
            <TableBody>
              {visibleRows.map((row) => (
                <TableRow key={row.id} hover>

                  <TableCell>
                    <Typography fontWeight={600}>{row.title}</Typography>
                    <Typography variant="body2" color="gray">
                      {row.subtitle}
                    </Typography>
                  </TableCell>

                  <TableCell>{row.category}</TableCell>
                  <TableCell>{row.date}</TableCell>

                  <TableCell>
                    <Box
                      sx={{
                        px: 2,
                        py: 0.5,
                        borderRadius: '20px',
                        display: 'inline-block',
                        fontSize: '12px',
                        fontWeight: 500,
                        ...getStatusStyle(row.status),
                      }}
                    >
                      {row.status}
                    </Box>
                  </TableCell>

                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* PAGINATION */}
        <TablePagination
          component="div"
          rowsPerPageOptions={[5, 10]}
          count={filteredRows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) =>
            setRowsPerPage(parseInt(e.target.value, 10))
          }
        />
      </Paper>
    </Box>
  );
}