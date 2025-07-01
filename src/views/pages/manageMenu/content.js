import React from 'react';
import StyledTable from './StyledTable';
import { tableHeaderReplace } from 'utils/tableHeaderReplace';
import { TextField, Box, Grid, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { useState } from 'react';
import { toast } from 'react-toastify';
import AddForm from './AddForm';
import { formatTime } from 'utils/formatTime';
import { editMenu } from 'utils/Service';

const tableHeader = ['Menu', 'Fixed Menu Rate', 'Start Time', 'End Time', 'Active'];

export default function Content({ data, updateData }) {
  const [formOpen, setFormOpen] = useState(false);
  const [selectedData, setselectedData] = useState();
  const [searchType, setSearchType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const status = ['1', '0'];

  const filteredData = data.filter((item) => {
    // Filter by menu name
    const menuNameMatch = searchType.trim() === '' || item.menu_name.toLowerCase().includes(searchType.toLowerCase());

    // Filter by active status
    const statusMatch = filterStatus === '' || item.Active.toString() === filterStatus;

    // Return true if both conditions match
    return menuNameMatch && statusMatch;
  });

  const tableData = tableHeaderReplace(filteredData, [ 'menu_name','fixed_menu_rate', 'start_time', 'end_time', 'Active'], tableHeader).map(
    (item) => ({
      ...item,
      'Start Time': formatTime(item['Start Time']),
      'End Time': formatTime(item['End Time']),
      Active: item['Active'] === 1 ? 'Yes' : 'No'
    })
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
      // Prepare the data for editing
      console.log(e.data)
      const editData = {
        menu_id: e.data.menu_id,
        fixed_menu_rate: e.data['Fixed Menu Rate'],
        start_time: e.data['Start Time'],
        end_time: e.data['End Time'],
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
              label="Search by Menu Name"
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
              <Select value={filterStatus} label="Active" onChange={(e) => setFilterStatus(e.target.value)}>
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

      <AddForm
  open={formOpen}
  addData={editMenu}
  getData={updateData}
  onClose={() => {
    setFormOpen(false);
    setselectedData(null); // Reset selected data when closing
    updateData(); // Refresh data after edit
  }}
  data={selectedData}
  isEdit={Boolean(selectedData)} // Set isEdit based on whether we have selected data
/>
      <StyledTable
        data={tableData}
        header={tableHeader}
        isShowSerialNo={true}
        isShowAction={true}
        actions={['edit', 'delete']}
        onActionChange={actionHandle}
      />
    </>
  );
}
