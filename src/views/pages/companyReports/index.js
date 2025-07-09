import React, { useState, useEffect } from 'react';
import { MenuItem, Box, Typography, Stack, FormControl, InputLabel, Select, Button } from '@mui/material';
import Content from './content';
import Tools from './tools';
import { getEmployee, getCompany, addEmployee, getCanteenCalender, getCanteenReport } from '../../../utils/Service';
import { toast } from 'react-toastify';
export default function Index() {
  const [formOpen, setFormOpen] = useState(false);
  const [data, setData] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState('');
  const [selectedType, setSelectedType] = useState('employee');
  const [calendars, setCalendars] = useState([]);
  const [selectedCalendar, setSelectedCalendar] = useState('');

  const employeeTypes = ['employee', 'contractor', 'guest', 'fixed'];

  // Fetch companies
  const getCompanies = async () => {
    try {
      const response = await getCompany();
      setCompanies(response);
    } catch (err) {
      console.error(err);
      toast.error('Error fetching companies');
    }
  };

  const getCalendars = async () => {
    try {
      const response = await getCanteenCalender(1);
      setCalendars(response);
    } catch (err) {
      console.error(err);
      toast.error('Error fetching calendar data');
    }
  };

  // Fetch employees
  const getData = async () => {
    try {
      if (!selectedCompany || !selectedType || !selectedCalendar) {
        setData([]);
        return;
      }
      let data = {
        canteenCalenderId: selectedCalendar,
        companyId: selectedCompany,
        employeeType: selectedType
      }
      const res = await getCanteenReport(data);

      setData(res);
    } catch (err) {
      console.error(err);
      toast.error('Error fetching employees');
    }
  };

  useEffect(() => {
    getCompanies();
    getCalendars();
  }, []);

  // useEffect(() => {
  //   getData();
  // }, [selectedCompany, selectedType]);

  return (
    <Stack direction={'column'} gap={2}>

        <Tools
        selectedCompany
        buttonClick={() => {
          if (!selectedCompany) {
            toast.error('Please select a company first');
            return;
          }
          setFormOpen(true);
        }}
        type={selectedType}
      />


      <Box sx={{ mb: 2 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          <FormControl fullWidth>
            <InputLabel>Select Calendar</InputLabel>
            <Select value={selectedCalendar} label="Select Calendar" onChange={(e) => setSelectedCalendar(e.target.value)}>
              <MenuItem value="">
                <em>Select a calendar</em>
              </MenuItem>
              {calendars.map((calendar) => (
                <MenuItem key={calendar.canteen_calendar_id} value={calendar.canteen_calendar_id}>
                  {calendar.month_year}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Select Company</InputLabel>
            <Select value={selectedCompany} label="Select Company" onChange={(e) => setSelectedCompany(e.target.value)}>
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
            <Select value={selectedType} label="Employee Type" onChange={(e) => setSelectedType(e.target.value)}>
              {employeeTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

         <Button
  variant="contained"
  onClick={getData}
  disabled={!selectedCompany || !selectedType || !selectedCalendar}
  color="primary"
>
  Apply
</Button>
        </Stack>
      </Box>

    
      <Content selectedCompany={selectedCompany} data={data} updateData={getData} type={selectedType} />
    </Stack>
  );
}
