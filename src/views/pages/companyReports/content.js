import React, { useState, useEffect } from 'react';
import StyledTable from './StyledTable';
import { tableHeaderReplace } from 'utils/tableHeaderReplace';
import { TextField, Box, Grid, FormControlLabel, Switch } from '@mui/material';
import ExportButtons from '../shared/ExportButtons';
const tableHeader = ['Employee Code', 'Employee Name', 'Employee Type', 'Plant code', 'Breakfast Count', 'Breakfast Amount','Lunch Count','Lunch Amount', 'Dinner Count', 'Dinner Amount', 'Tea Count', 'Tea Amount', 'Snacks Count', 'Snacks Amount', 'Casual Meals Count', 'Casual Meals Amount', 'Canteen Total', 'GST (2.5%) ', 'AC Dine Charge', 'Total'];

const tableDataKeys = ['employee_code', 'employee_name', 'employee_type', 'plant_code', 'Breakfast_Count','Breakfast_Amount','Lunch_Count','Lunch_Amount', 'Dinner_Count', 'Dinner_Amount', 'Tea_Count', 'Tea_Amount', 'Snacks_Count', 'Snacks_Amount', 'Casual_Meals_Count', 'Casual_Meals_Amount', 'Canteen_Total', 'GST','AC_Dine_Charge', 'Total'];

const countOnlyHeader = ['Employee Code', 'Employee Name', 'Employee Type', 'Plant code', 'Breakfast Count', 'Lunch Count', 'Dinner Count', 'Tea Count', 'Snacks Count', 'Casual Meals Count'];

const countOnlyKeys = ['employee_code', 'employee_name', 'employee_type', 'plant_code', 'Breakfast_Count', 'Lunch_Count', 'Dinner_Count', 'Tea_Count', 'Snacks_Count', 'Casual_Meals_Count'];

export default function Content({ data, meta }) {
  const [searchEmployee, setSearchEmployee] = useState('');
  const [page, setPage] = useState(1);
  const [countOnly, setCountOnly] = useState(false);

  useEffect(() => {
    setPage(1); // reset to first page on search
  }, [searchEmployee]);

  const filteredData = data.filter((item) => {
    const searchText = searchEmployee.trim().toLowerCase();
    return item.employee_name.toLowerCase().includes(searchText) || item.employee_code.toLowerCase().includes(searchText);
  });

  const currentHeaders = countOnly ? countOnlyHeader : tableHeader;
  const currentKeys = countOnly ? countOnlyKeys : tableDataKeys;

  const tableData = tableHeaderReplace(
    filteredData,
    currentKeys,
    currentHeaders
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
          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={<Switch checked={countOnly} onChange={(e) => setCountOnly(e.target.checked)} />}
              label="Count Only"
            />
          </Grid>
        </Grid>
      </Box>

      {tableData.length > 0 && <ExportButtons data={tableData} headers={currentHeaders} fileName="Company_Canteen_Report" meta={meta} />}

      <StyledTable
        data={tableData}
        header={currentHeaders}
        isShowSerialNo={true}
        isShowAction={false}
        rowsPerPage={10}
        page={page}
        onPageChange={(_, newPage) => setPage(newPage)}
      />
    </>
  );
}
