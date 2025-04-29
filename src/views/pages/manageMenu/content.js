import React from 'react';
import StyledTable from './StyledTable';
import { tableHeaderReplace } from 'utils/tableHeaderReplace';
import { TextField, Box, Grid, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { useState } from 'react';
import { toast } from 'react-toastify';
import AddForm from './AddForm';

const tableHeader = ['Menu Type', 'From Time', 'To Time', 'Active'];

export default function Content({ data, deleteAd, updateData }) {
  const [formOpen, setFormOpen] = useState(false);
  const [selectedData, setselectedData] = useState();
  const [searchType, setSearchType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const status = ["true", "false"];


  const filteredData = data.filter((item) => {
    // const nameMatch = item.name.toLowerCase().includes(searchName.toLowerCase());
    // const tripTypeMatch = !searchStatus || item.tripType === filterStatus;
    // return nameMatch && tripTypeMatch;
    return item;
  });


  const tableData = tableHeaderReplace(
    filteredData,
    ['menuType', 'fromTime', 'toTime', 'active'],
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
              label="Search by Type"
              variant="outlined"
              size="small"
              fullWidth
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth size="small">
              <InputLabel>Active</InputLabel>
              <Select
                value={filterStatus}
                label="Active"
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                {status.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
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