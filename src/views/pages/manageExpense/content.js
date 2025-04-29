import React from 'react';
import StyledTable from './StyledTable';
import { tableHeaderReplace } from 'utils/tableHeaderReplace';
import { TextField, Box, Grid, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { useState } from 'react';
import { toast } from 'react-toastify';
import AddForm from './AddForm';

const tableHeader = ['Date', 'Menu Type', 'Amount', 'Remarks'];

export default function Content({ data, deleteAd, updateData }) {
  const [formOpen, setFormOpen] = useState(false);
  const [selectedData, setselectedData] = useState();
  const [searchName, setSearchName] = useState('');



  const filteredData = data.filter((item) => {
    const nameMatch = item.name.toLowerCase().includes(searchName.toLowerCase());
    return nameMatch;
  });



  const tableData = tableHeaderReplace(
    filteredData,
    ['name', 'contact', 'address', 'details'],
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
          <Grid item xs={12}>
            <TextField
              label="Search by Name"
              variant="outlined"
              size="small"
              fullWidth
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
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