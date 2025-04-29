import React from 'react';
import { Autocomplete, TextField, Box, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import StyledTable from 'ui-component/StyledTable';
import { tableHeaderReplace } from 'utils/tableHeaderReplace';
import CompanyAdForm from './UserAdForm';
import { useState } from 'react';
import { toast } from 'react-toastify';
import {deleteUser} from '../../../utils/Service'
const tableHeader = ['Name', 'User Name','Company Name', 'Contact Number','Address',"Email", 'Role', 'Status'];

export default function Content({ data, updateData,companyData}) {
  const [formOpen, setFormOpen] = useState(false);
  const [selectedData, setselectedData] = useState();
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const tableData = tableHeaderReplace(data, ['name', 'userName', 'company', 'phone', 'address','email','role','status' ], tableHeader);

  const handleCompanyChange = (event, newValue) => {
    setSelectedCompany(newValue);
    updateData(newValue?._id); // Pass companyId to updateData when company is selected
  };


  const handleDelete = async () => {
    try {
      await deleteUser(userToDelete._id);
      toast.success('User deleted successfully');
      updateData();
      setDeleteConfirmOpen(false);
      setUserToDelete(null);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Error deleting user');
    }
  };

  const actionHandle = async (e) => {
    console.log(e);
    if (e.action == 'delete') {
      console.log(e.data)
      setUserToDelete(e.data);
      setDeleteConfirmOpen(true);
    }else if(e.action == 'Edit'){
   setFormOpen(true);
   console.log(e.data)
   setselectedData(e.data);
      console.log("edit company")
    } else {
      setselectedData();
    }
     
  };

  return (
    <>

<Box sx={{ mb: 2 }}>
        <Autocomplete
          options={companyData || []}
          getOptionLabel={(option) => option.name || ''}
          value={selectedCompany}
          onChange={handleCompanyChange}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Search Company"
              variant="outlined"
              size="small"
              fullWidth
            />
          )}
        />
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
      
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete user `{userToDelete?.Name}`?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error">Delete</Button>
        </DialogActions>
      </Dialog>

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
