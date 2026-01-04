import React, { useState, useEffect } from 'react';
import { MenuItem, Box, Stack, FormControl, InputLabel, Select, Button } from '@mui/material';
import Content from './content';
import Tools from './tools';
import { getCompany, getCanteenCalender, getCanteenReport, getPlant } from '../../../utils/Service';
import { toast } from 'react-toastify';
export default function Index() {
  const [formOpen, setFormOpen] = useState(false);
  const [data, setData] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState('');
  const [selectedType, setSelectedType] = useState(null);
  const [plants, setPlants] = useState([]);
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [calendars, setCalendars] = useState([]);
  const [selectedCalendar, setSelectedCalendar] = useState('');

  const employeeTypes = [
    { label: 'All', value: null },
    { label: 'Employee', value: 'employee' },
    { label: 'Contractor', value: 'contractor' },
    { label: 'Guest', value: 'guest' },
    { label: 'Overtime', value: 'overtime' }
  ];

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

  const getPlants = async (companyId) => {
    try {
      if (!companyId) {
        setPlants([]);
        setSelectedPlant(null);
        return;
      }
      const res = await getPlant(companyId);
      setPlants(res || []);
    } catch (err) {
      console.error(err);
      toast.error('Error fetching plants');
    }
  };

  // Fetch employees
  const getData = async () => {
    try {
      if (!selectedCalendar) {
        setData([]);
        return;
      }
      console.log(selectedPlant)
      let data = {
        canteenCalenderId: selectedCalendar,
        companyId: selectedCompany || null,
        employeeType: selectedType, // may be null to indicate All,
        plant_id: selectedPlant || null
      };
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

  useEffect(() => {
    if (selectedCompany) getPlants(selectedCompany);
    else setPlants([]);
  }, [selectedCompany]);

  // useEffect(() => {
  //   getData();
  // }, [selectedCompany, selectedType]);

  return (
    <Stack direction={'column'} gap={2}>
      <Tools />

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
            <InputLabel>Select Plant </InputLabel>
            <Select value={selectedPlant || ''} label="Select Plant (optional)" onChange={(e) => setSelectedPlant(e.target.value || null)}>
              <MenuItem value="">
                <em>All Plants</em>
              </MenuItem>
              {plants.map((p) => (
                <MenuItem key={p.plant_id} value={p.plant_id}>
                  {p.plant_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Employee Type</InputLabel>
            <Select
              value={selectedType}
              label="Employee Type"
              onChange={(e) => setSelectedType(e.target.value === '' ? null : e.target.value)}
            >
              {employeeTypes.map((t) => (
                <MenuItem key={String(t.value)} value={t.value}>
                  {t.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            variant="contained"
            onClick={getData}
            disabled={(selectedType !== 'fixed' && !selectedCompany) || !selectedCalendar}
            color="primary"
          >
            Apply
          </Button>
        </Stack>
      </Box>

      <Content
        meta={{
          month: calendars.find((c) => c.canteen_calendar_id === selectedCalendar)?.month_year || '',
          company: companies.find((c) => c.company_id === selectedCompany)?.company_name || '',
          type: selectedType ? (selectedType.charAt(0).toUpperCase() + selectedType.slice(1)) : 'All'
        }}
        selectedCompany={selectedCompany}
        data={data}
        updateData={getData}
        type={selectedType}
      />
    </Stack>
  );
}
