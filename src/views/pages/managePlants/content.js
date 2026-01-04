import React from 'react';
import StyledTable from './StyledTable';
import { tableHeaderReplace } from 'utils/tableHeaderReplace';
import { TextField, Box, Grid, MenuItem } from '@mui/material';
import { useState } from 'react';
import AddForm from './AddForm';
import { editPlant } from 'utils/Service';

const tableHeader = ['Plant Id', 'Plant Code', 'Plant Name'];

export default function Content({ data, updateData, isExist, setSelectedData, companies, selectedCompany, setSelectedCompany }) {
  const [formOpen, setFormOpen] = useState(false);
  const [selected, setSelected] = useState();
  const [searchPlant, setSearchPlant] = useState('');

  const filteredData = data.filter((item) => {
    const text = searchPlant.trim().toLowerCase();
    return (
      text === '' ||
      (item.plant_name && item.plant_name.toLowerCase().includes(text)) ||
      (item.plant_code && item.plant_code.toLowerCase().includes(text))
    );
  });

  const tableData = tableHeaderReplace(filteredData, ['plant_id', 'plant_code', 'plant_name'], tableHeader);

  const actionHandle = (e) => {
    if (e.action === 'edit') {
      const editData = {
        plant_id: e.data['Plant Id'],
        plant_code: e.data['Plant Code'],
        plant_name: e.data['Plant Name']
      };
      setSelected(editData);
      setSelectedData(editData);
      setFormOpen(true);
    }
  };

  return (
    <>
      <Box sx={{ mb: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              label="Search by Plant Name/Code"
              variant="outlined"
              size="small"
              fullWidth
              value={searchPlant}
              onChange={(e) => setSearchPlant(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField select label="Select Company" value={selectedCompany} onChange={(e) => setSelectedCompany(e.target.value)} fullWidth>
              <MenuItem value="">
                <em>Select a company</em>
              </MenuItem>
              {companies.map((c) => (
                <MenuItem key={c.company_id} value={c.company_id}>{c.company_name}</MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>
      </Box>

      <AddForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setSelected(null);
          updateData();
        }}
        data={selected}
        addData={() => {}}
        editData={editPlant}
        isEdit={Boolean(selected)}
        getData={updateData}
        selectedCompany={selectedCompany}
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