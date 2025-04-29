import React from 'react';
import StyledTable from './StyledTable';
import { tableHeaderReplace } from 'utils/tableHeaderReplace';
import { TextField, Box, Grid, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { useState } from 'react';
import { toast } from 'react-toastify';
import AddForm from './AddForm';

const tableHeader = ['Emp id/Contracts', 'Date', 'Menu', 'No Of Coupons', 'Reason'];

export default function Content({ data, deleteAd, updateData }) {
  const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
  const [formOpen, setFormOpen] = useState(false);
  const [selectedData, setselectedData] = useState();
  const [searchEmpId, setSearchEmpId] = useState('');
  const [searchDate, setSearchDate] = useState(today); // Set default to today
  
  const status = ["true", "false"];


  const filteredData = data.filter((item) => {
    const empIdMatch = item.empId.toLowerCase().includes(searchEmpId.toLowerCase());
    const dateMatch = !searchDate || item.date.includes(searchDate);
    return empIdMatch && dateMatch;
  });



  const tableData = tableHeaderReplace(
    filteredData,
    ['empId', 'date', 'menu', 'no_of_coupons', 'reason'],
    tableHeader
  );

  const actionHandle = (e) => {
    console.log(e);
    if (e.action == 'delete') {
      console.log(e.data._id);
      setselectedData(e.data);
      deleteAd(e.data._id)
        .then(() => {})
        .catch((error) => {
          console.error(error);
          toast.error(error.response.data.message);
        });
    } else {
      setselectedData();
    }
    updateData();
  };

  return (
    <>
     <Box sx={{ mb: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              label="Search by Employee ID"
              variant="outlined"
              size="small"
              fullWidth
              value={searchEmpId}
              onChange={(e) => setSearchEmpId(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Search by Date"
              type="date"
              variant="outlined"
              size="small"
              fullWidth
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
              InputLabelProps={{
                shrink: true
              }}
            />
          </Grid>
          
        </Grid>
      </Box>

      <AddForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
        }}
        data={selectedData}
        isEdit={true}
      />
      <StyledTable
        data={tableData}
        header={tableHeader}
        isShowSerialNo={true}
        isShowAction={true}
        actions={['delete']}
        onActionChange={actionHandle}
      />
    </>
  );
}