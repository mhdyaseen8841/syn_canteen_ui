import React, { useState, useEffect } from 'react';
import StyledTable from './StyledTable';
import { tableHeaderReplace } from 'utils/tableHeaderReplace';
import {
  TextField,
  Box,
  Grid,
  FormControlLabel,
  Switch
} from '@mui/material';
import ExportButtons from '../shared/ExportButtons';
import {  formatDate } from 'utils/formatDateTime';
/* ================= HEADERS ================= */

const tableHeader = [
  'Employee Code', 'Employee Name', 'Employee Type', 'Plant code',
  'Breakfast Count', 'Breakfast Amount',
  'Lunch Count', 'Lunch Amount',
  'Dinner Count', 'Dinner Amount',
  'Tea Count', 'Tea Amount',
  'Snacks Count', 'Snacks Amount',
  'Casual Meals Count', 'Casual Meals Amount',
  'Canteen Total', 'GST (2.5%) ', 'AC Dine Charge', 'Total'
];

const tableDataKeys = [
  'employee_code', 'employee_name', 'employee_type', 'plant_code',
  'Breakfast_Count', 'Breakfast_Amount',
  'Lunch_Count', 'Lunch_Amount',
  'Dinner_Count', 'Dinner_Amount',
  'Tea_Count', 'Tea_Amount',
  'Snacks_Count', 'Snacks_Amount',
  'Casual_Meals_Count', 'Casual_Meals_Amount',
  'Canteen_Total', 'GST', 'AC_Dine_Charge', 'Total'
];

const countOnlyHeader = [
  'Employee Code', 'Employee Name', 'Employee Type', 'Plant code',
  'Breakfast Count', 'Lunch Count', 'Dinner Count',
  'Tea Count', 'Snacks Count', 'Casual Meals Count'
];

const countOnlyKeys = [
  'employee_code', 'employee_name', 'employee_type', 'plant_code',
  'Breakfast_Count', 'Lunch_Count', 'Dinner_Count',
  'Tea_Count', 'Snacks_Count', 'Casual_Meals_Count'
];

const dateReportHeader = [
  'Employee Code', 'Employee Name', 'Employee Type', 'Plant code',  'Date',
  'Breakfast Count', 'Breakfast Amount',
  'Lunch Count', 'Lunch Amount',
  'Dinner Count', 'Dinner Amount',
  'Tea Count', 'Tea Amount',
  'Snacks Count', 'Snacks Amount',
  'Casual Meals Count', 'Casual Meals Amount'
];

const dateReportKeys = [
  'employee_code', 'employee_name', 'employee_type', 'plant_code',  'transaction_date',
  'Breakfast_Count', 'Breakfast_Amount',
  'Lunch_Count', 'Lunch_Amount',
  'Dinner_Count', 'Dinner_Amount',
  'Tea_Count', 'Tea_Amount',
  'Snacks_Count', 'Snacks_Amount',
  'Casual_Meals_Count', 'Casual_Meals_Amount'
];

/* ================= COMPONENT ================= */

export default function Content({
  data,
  meta,
  dateReport,
  onDateToggle
}) {
  const [searchEmployee, setSearchEmployee] = useState('');
  const [page, setPage] = useState(1);
  const [countOnly, setCountOnly] = useState(false);

  useEffect(() => {
    setPage(1);
  }, [searchEmployee, countOnly, dateReport]);

  const filteredData = data.filter((item) => {
    const s = searchEmployee.trim().toLowerCase();
    return (
      item.employee_name?.toLowerCase().includes(s) ||
      item.employee_code?.toLowerCase().includes(s)
    );
  });

  let currentHeaders = tableHeader;
  let currentKeys = tableDataKeys;

  if (countOnly) {
    currentHeaders = countOnlyHeader;
    currentKeys = countOnlyKeys;
  } else if (dateReport) {
    currentHeaders = dateReportHeader;
    currentKeys = dateReportKeys;
  }

  const processedData = dateReport
  ? filteredData.map(item => ({
      ...item,
      transaction_date: formatDate(item.transaction_date),
    }))
  : filteredData;

  const tableData = tableHeaderReplace(
  processedData,
  currentKeys,
  currentHeaders
);


  return (
    <>
     <Box sx={{ mb: 2 }}>
  <Grid container spacing={2} alignItems="center">
    {/* Search */}
    <Grid item xs={12} md={6}>
      <TextField
        label="Search by Employee Name/Code"
        size="small"
        fullWidth
        value={searchEmployee}
        onChange={(e) => setSearchEmployee(e.target.value)}
      />
    </Grid>

    {/* Switches */}
    <Grid item xs={12} md={6}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: { xs: 'flex-start', md: 'flex-end' },
          gap: 3,
          flexWrap: 'wrap'
        }}
      >
        <FormControlLabel
          control={
            <Switch
              checked={countOnly}
              onChange={(e) => setCountOnly(e.target.checked)}
            />
          }
          label="Count Only"
        />

        <FormControlLabel
          control={
            <Switch
              checked={dateReport}
              onChange={(e) => onDateToggle(e.target.checked)}
            />
          }
          label="Date"
        />
      </Box>
    </Grid>
  </Grid>
</Box>


      {tableData.length > 0 && (
        <ExportButtons
          data={tableData}
          headers={currentHeaders}
          fileName="Company_Canteen_Report"
          meta={meta}
        />
      )}

      <StyledTable
        data={tableData}
        header={currentHeaders}
        isShowSerialNo
        isShowAction={false}
        rowsPerPage={10}
        page={page}
        onPageChange={(_, newPage) => setPage(newPage)}
      />
    </>
  );
}
