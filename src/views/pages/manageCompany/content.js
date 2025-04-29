import React from 'react';
import StyledTable from 'ui-component/StyledTable';
import { TextField, Box, Grid } from '@mui/material';
import { tableHeaderReplace } from 'utils/tableHeaderReplace';
import CompanyAdForm from './CompanyAdForm';
import { useState } from 'react';
import { toast } from 'react-toastify';
import {deleteCompany} from '../../../utils/Service'
const tableHeader = ['Name', 'Owner Name', 'ContactNumber','Address',"CompanyType"];

export default function Content({ data, updateData }) {
  const [formOpen, setFormOpen] = useState(false);
  const [selectedData, setselectedData] = useState();
  const [searchName, setSearchName] = useState('');
  const [searchOwner, setSearchOwner] = useState('');
  const [searchContact, setSearchContact] = useState('');


const filteredData = data.filter((item) => {
    const nameMatch = item.name.toLowerCase().includes(searchName.toLowerCase());
    const ownerMatch = item.ownerName.toLowerCase().includes(searchOwner.toLowerCase());
    const contactMatch = String(item.contactNumber).toLowerCase().includes(searchContact.toLowerCase());
    return nameMatch && ownerMatch && contactMatch;
  });

  const tableData = tableHeaderReplace(
    filteredData,
    ['name', 'ownerName', 'contactNumber', 'address', 'companyType'],
    tableHeader
  );



  const actionHandle = async (e) => {
    console.log(e);
    if (e.action == 'delete') {
      console.log(e.data._id);
      setselectedData(e.data);
      deleteCompany( e.data._id )
        .then(() => {
          updateData();
        })
        .catch((error) => {
          console.error(error);
          toast.error(error.response.data.message);
        });
    }else if(e.action == 'Edit'){
   setFormOpen(true);
   setselectedData(e.data);
      console.log("edit company")
    } else {
      setselectedData();
    }
     
  };

  return (
    <>

<Box sx={{ mb: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <TextField
              label="Search by Company Name"
              variant="outlined"
              size="small"
              fullWidth
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              label="Search by Owner Name"
              variant="outlined"
              size="small"
              fullWidth
              value={searchOwner}
              onChange={(e) => setSearchOwner(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              label="Search by Contact"
              variant="outlined"
              size="small"
              fullWidth
              value={searchContact}
              onChange={(e) => setSearchContact(e.target.value)}
            />
          </Grid>
        </Grid>
      </Box>

      {formOpen && (
        <CompanyAdForm
        getData={updateData} 
          open={formOpen}
          onClose={() => {
            setFormOpen(false);
          }}
          data={selectedData}
          isEdit={true}
        />
      )}
      
      <StyledTable
        data={tableData}
        header={tableHeader}
        isShowSerialNo={true}
        isShowAction={true}
        actions={['Edit','delete']}
        onActionChange={actionHandle}
      />
    </>
  );
}
