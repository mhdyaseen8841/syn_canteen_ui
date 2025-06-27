import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stack, FormControl, InputLabel, Select, MenuItem, Box, Typography } from '@mui/material';
import Content from './content';
import Tools from './tools';
import AddForm from './AddForm';
import { getEmployee, getCompany, addEmployee } from '../../../utils/Service';
import { toast } from 'react-toastify';
export default function Index() {
  const [formOpen, setFormOpen] = useState(false);
  const [data, setData] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState('');
  const [selectedType, setSelectedType] = useState('employee'); 


  const employeeTypes = ['employee', 'contractor', 'guest'];

  // Fetch companies
  const getCompanies = async () => {
    try {
      const response = await getCompany();
      setCompanies(response);
    } catch (err) {
      console.error(err);
      toast.error("Error fetching companies");
    }
  };

  // Fetch employees
  const getData = async () => {
    try {
      if (!selectedCompany) {
        setData([]);
        return;
      }
      const res = await getEmployee(selectedCompany,selectedType);
    
      setData(res);
    } catch (err) {
      console.error(err);
      toast.error("Error fetching employees");
    }
  };

  useEffect(() => {
    getCompanies();
  }, []);

  useEffect(() => {
    getData();
  }, [selectedCompany, selectedType]);

  return (
    <Stack direction={'column'} gap={2}>
        <Typography variant="h3" color={'secondary.main'}>
                Select Company 
              </Typography>
      <Box sx={{ mb: 2 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          <FormControl fullWidth>
            <InputLabel>Select Company</InputLabel>
            <Select
              value={selectedCompany}
              label="Select Company"
              onChange={(e) => setSelectedCompany(e.target.value)}
            >
              <MenuItem value="">
                <em>Select a company</em>
              </MenuItem>
              {companies.map((company) => (
                <MenuItem key={company.company_id} value={company.company_id}>
                  {company.company_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Employee Type</InputLabel>
            <Select
              value={selectedType}
              label="Employee Type"
              onChange={(e) => setSelectedType(e.target.value)}
            >
              {employeeTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </Box>

      <AddForm 
        open={formOpen}
        onClose={() => setFormOpen(false)}
        getData={getData}
        addData={addEmployee}
        selectedCompany={selectedCompany}
        type={selectedType}
      />
      <Tools selectedCompany buttonClick={() => {
        if (!selectedCompany) {
          toast.error("Please select a company first");
          return;
        }
        setFormOpen(true);
      }} type={selectedType} />
      <Content 
        selectedCompany={selectedCompany}
        data={data}
        updateData={getData}
        type={selectedType}
      />
    </Stack>
  );
}
