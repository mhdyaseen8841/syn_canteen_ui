import React from 'react';
import StyledTable from './StyledTable';
import { tableHeaderReplace } from 'utils/tableHeaderReplace';
import { TextField, Box, Grid, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { useState } from 'react';
import { Chip } from '@mui/material';
import { toast } from 'react-toastify';
import AddForm from './AddForm';
import { editEmployee } from 'utils/Service';

const tableHeader = [
  'Employee Code',
  'Employee Name',
  'Employee Type',
  'Company',
  'Department',
  'Premium Enabled',
  'Active'
];

export default function Content({ data, deleteAd, updateData,selectedCompany,type }) {
  const [formOpen, setFormOpen] = useState(false);
  const [selectedData, setselectedData] = useState();
  const [searchEmployee, setSearchEmployee] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const status = ['1', '0'];

  const filteredData = data.filter((item) => {
    // Filter by employee name or code
    const searchMatch = searchEmployee.trim() === '' || 
      item.employee_name.toLowerCase().includes(searchEmployee.toLowerCase()) ||
      item.employee_code.toLowerCase().includes(searchEmployee.toLowerCase());

    // Filter by active status
    const statusMatch = filterStatus === '' || item.Active.toString() === filterStatus;

    return searchMatch && statusMatch;
  });

  const tableData = tableHeaderReplace(
    filteredData, 
    [
      'employee_code',
      'employee_name',
      'employee_type',
      'company_id',
      'department_name',
      'premium_enabled',
      'Active'
    ], 
    tableHeader
  ).map((item) => ({
    ...item,
    'Premium Enabled': item['Premium Enabled'] === 1 ? 'Yes' : 'No',
    'Employee Type': type,
    'Active': item['Active'] === 1 ? 'Yes' : 'No'
  }));

  const actionHandle = (e) => {
    console.log(e);
    if (e.action === 'delete') {
      setselectedData(e.data);
     
    } else if (e.action === 'edit') {
      const editData = {
        employee_id: e.data.employee_id,
        employee_code: e.data['Employee Code'],
        employee_name: e.data['Employee Name'],
        company_id: e.data.company_id,
        department_id: e.data.department_id,
        premium_enabled: e.data['Premium Enabled'] === 'Yes' ? 1 : 0,
        active: e.data['Active'] === 'Yes' ? 1 : 0
      };
      setselectedData(editData);
      setFormOpen(true);
    }
  };

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
                    {type === '1' ? 'Active' : 'Inactive'}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

{
  formOpen && (



      <AddForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setselectedData(null);
          updateData();
        }}
       addData={editEmployee}
       getData={updateData}
        data={selectedData}
        selectedCompany={selectedCompany}
        isEdit={Boolean(selectedData)}
        type={type}
      />

    )
}
<StyledTable
  data={tableData}
  header={tableHeader}
  isShowSerialNo={true}
  isShowAction={true}
  actions={['edit', 'delete']}
  onActionChange={actionHandle}
  rowsPerPage={20} // Optional
/>

    </>
  );
}