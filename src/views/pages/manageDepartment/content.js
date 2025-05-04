import React from 'react';
import StyledTable from './StyledTable';
import { tableHeaderReplace } from 'utils/tableHeaderReplace';
import { TextField, Box, Grid } from '@mui/material';
import { useState } from 'react';
import { toast } from 'react-toastify';
import AddForm from './AddForm';
import { editDepartment } from 'utils/Service';

const tableHeader = ['Department Id', 'Department Name'];

export default function Content({ data, deleteAd, updateData,isExist }) {
  const [formOpen, setFormOpen] = useState(false);
  const [selectedData, setselectedData] = useState();
  const [searchDepartment, setSearchDepartment] = useState('');

  const filteredData = data.filter((item) => {
    // Filter by department name
    return searchDepartment.trim() === '' || 
           item.department_name.toLowerCase().includes(searchDepartment.toLowerCase());
  });

  const tableData = tableHeaderReplace(
    filteredData, 
    ['department_id', 'department_name'], 
    tableHeader
  );

  const actionHandle = (e) => {
    console.log(e);
    if (e.action === 'delete') {
      setselectedData(e.data);
      deleteAd(e.data._id)
        .then(() => {
          updateData();
        })
        .catch((error) => {
          console.error(error);
          toast.error(error.response.data.message);
        });
    } else if (e.action === 'edit') {
      const editData = {
        department_id: e.data['Department Id'],
        department_name: e.data['Department Name']
      };
      setselectedData(editData);
      setFormOpen(true);
    }
  };

  return (
    <>
      <Box sx={{ mb: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Search by Department Name"
              variant="outlined"
              size="small"
              fullWidth
              value={searchDepartment}
              onChange={(e) => setSearchDepartment(e.target.value)}
            />
          </Grid>
        </Grid>
      </Box>

      <AddForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setselectedData(null);
          updateData();
        }}
        data={selectedData}
        addData={editDepartment}
        isEdit={Boolean(selectedData)}
        getData={updateData} 
        isExist={isExist}
      />
      <StyledTable
        data={tableData}
        header={tableHeader}
        isShowSerialNo={false}
        isShowAction={true}
        actions={['edit']}
        onActionChange={actionHandle}
      />
    </>
  );
}