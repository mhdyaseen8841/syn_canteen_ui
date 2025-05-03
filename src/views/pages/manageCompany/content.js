import React from 'react';
import StyledTable from './StyledTable';
import { tableHeaderReplace } from 'utils/tableHeaderReplace';
import { TextField, Box, Grid } from '@mui/material';
import { useState } from 'react';
import { toast } from 'react-toastify';
import AddForm from './AddForm';
// import { useNavigate } from 'react-router-dom';

const tableHeader = ['Company Id', 'Company Name'];

export default function Content({ data, deleteAd, updateData }) {
  const [formOpen, setFormOpen] = useState(false);
  const [selectedData, setselectedData] = useState();
  const [searchCompany, setSearchCompany] = useState('');

  // const navigate = useNavigate();

  const handleRowClick = (companyId) => {
    // navigate(`/employees/${companyId}`);
  };


  const filteredData = data.filter((item) => {
    // Filter by company name
    return searchCompany.trim() === '' || 
           item.company_name.toLowerCase().includes(searchCompany.toLowerCase());
  });

  const tableData = tableHeaderReplace(
    filteredData, 
    ['company_id', 'company_name'], 
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
        company_id: e.data.company_id,
        company_name: e.data.company_name
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
              label="Search by Company Name"
              variant="outlined"
              size="small"
              fullWidth
              value={searchCompany}
              onChange={(e) => setSearchCompany(e.target.value)}
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
        isEdit={Boolean(selectedData)}
      />
      <StyledTable
        data={tableData}
        header={tableHeader}
        isShowSerialNo={false}
        isShowAction={false}
        onClickAction={(id) => handleRowClick(id)}
        actions={['edit', 'delete']}
        onActionChange={actionHandle}
      />
    </>
  );
}