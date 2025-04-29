import React from 'react';
import StyledTable from 'ui-component/StyledTable';
import { tableHeaderReplace } from 'utils/tableHeaderReplace';
import { TextField, Box, Grid } from '@mui/material';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { deleteDriver } from '../../../utils/Service';
import DriverAdForm from './AdForm';
const tableHeader = ['Name', 'ContactNumber', 'Address', 'CompanyName', 'licenceType', 'licenceNumber'];

export default function Content({ data, updateData }) {
  const [formOpen, setFormOpen] = useState(false);
  const [selectedData, setselectedData] = useState();
  const [searchName, setSearchName] = useState('');
  const [searchCompany, setSearchCompany] = useState('');
  const [searchLicense, setSearchLicense] = useState('');

  const filteredData = data.filter((item) => {
    const nameMatch = item.name.toLowerCase().includes(searchName.toLowerCase());
    const companyMatch = item.companyName.toLowerCase().includes(searchCompany.toLowerCase());
    const licenseMatch = item.licenceNumber.toLowerCase().includes(searchLicense.toLowerCase());
    return nameMatch && companyMatch && licenseMatch;
  });

  const tableData = tableHeaderReplace(
    filteredData,
    ['name', 'contactNumber', 'address', 'companyName', 'licenceType', 'licenceNumber'],
    tableHeader
  );

  const admin = localStorage.getItem('role') === 'admin';

  const actionHandle = async (e) => {
    console.log(e.action);
    if (e.action == 'delete') {
      console.log(e.data._id);
      setselectedData(e.data);
      deleteDriver(e.data._id)
        .then(() => {
          updateData();
        })
        .catch((error) => {
          console.error(error);
          toast.error(error.response.data.message);
        });
    } else if (e.action == 'Edit') {
      console.log(e.action);
      setFormOpen(true);
      setselectedData(e.data);
    } else {
      console.log(e.action);
    }
  };

  return (
    <>
      <Box sx={{ mb: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <TextField
              label="Search by Name"
              variant="outlined"
              size="small"
              fullWidth
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
            />
          </Grid>
        {
          admin && (


       
          <Grid item xs={12} md={4}>
            <TextField
              label="Search by Company"
              variant="outlined"
              size="small"
              fullWidth
              value={searchCompany}
              onChange={(e) => setSearchCompany(e.target.value)}
            />
          </Grid>
             
            )
            }
          <Grid item xs={12} md={4}>
            <TextField
              label="Search by License Number"
              variant="outlined"
              size="small"
              fullWidth
              value={searchLicense}
              onChange={(e) => setSearchLicense(e.target.value)}
            />
          </Grid>
        </Grid>
      </Box>

      {formOpen && (
        <DriverAdForm
          open={formOpen}
          getData={updateData}
          data={selectedData}
          isEdit={true}
          onClose={() => {
            setFormOpen(false);
          }}
        />
      )}

      <StyledTable
        data={tableData}
        header={tableHeader}
        isShowSerialNo={true}
        isShowAction={admin}
        actions={['Edit', 'delete']}
        onActionChange={actionHandle}
      />
    </>
  );
}
