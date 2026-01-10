import React, { useState, useEffect } from 'react';
import StyledTable from './StyledTable';
import { tableHeaderReplace } from 'utils/tableHeaderReplace';
import { TextField, Box, Grid } from '@mui/material';
import ExportButtons from '../shared/ExportButtons';
const tableHeader = ['Employee Code', 'Employee Name', 'Employee Type', 'Breakfast Count', 'Breakfast Amount','Lunch Count','Lunch Amount', 'Dinner Count', 'Dinner Amount', 'Tea Count', 'Tea Amount', 'Snacks Count', 'Snacks Amount', 'Casual Meals Count', 'Casual Meals Amount', 'Canteen Total', 'AC Dine Charge', 'Total'];

export default function Content({ data, meta }) {
  const [searchEmployee, setSearchEmployee] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1); // reset to first page on search
  }, [searchEmployee]);

  const filteredData = data.filter((item) => {
    const searchText = searchEmployee.trim().toLowerCase();
    return item.employee_name.toLowerCase().includes(searchText) || item.employee_code.toLowerCase().includes(searchText);
  });

  const tableData = tableHeaderReplace(
    filteredData,
    ['employee_code', 'employee_name', 'employee_type', 'Breakfast_Count','Breakfast_Amount','Lunch_Count','Lunch_Amount', 'Dinner_Count', 'Dinner_Amount', 'Tea_Count', 'Tea_Amount', 'Snacks_Count', 'Snacks_Amount', 'Casual_Meals_Count', 'Casual_Meals_Amount', 'Canteen_Total', 'AC_Dine_Charge', 'Total'],
    tableHeader
  );

  return (
    <>
      <Box sx={{ mb: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              label="Search by Employee Name/Code"
              variant="outlined"
              size="small"
              fullWidth
              value={searchEmployee}
              onChange={(e) => setSearchEmployee(e.target.value)}
            />
          </Grid>
        </Grid>
      </Box>

      {tableData.length > 0 && <ExportButtons data={tableData} headers={tableHeader} fileName="Company_Canteen_Report" meta={meta} />}

      <StyledTable
        data={tableData}
        header={tableHeader}
        isShowSerialNo={true}
        isShowAction={false}
        rowsPerPage={10}
        page={page}
        onPageChange={(_, newPage) => setPage(newPage)}
      />
    </>
  );
}
