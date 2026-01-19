import React, { useState, useEffect } from 'react';
import {
  MenuItem,
  Box,
  Stack,
  FormControl,
  InputLabel,
  Select,
  Button
} from '@mui/material';
import Content from './content';
import Tools from './tools';
import {
  getCompany,
  getCanteenCalender,
  getCanteenReport,
  getCanteenReportDate,
  getPlant
} from '../../../utils/Service';
import { toast } from 'react-toastify';

export default function Index() {
  const [data, setData] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState('');
  const [selectedType, setSelectedType] = useState(null);
  const [plants, setPlants] = useState([]);
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [calendars, setCalendars] = useState([]);
  const [selectedCalendar, setSelectedCalendar] = useState('');
  const [dateReport, setDateReport] = useState(false);

  const employeeTypes = [
    { label: 'All', value: null },
    { label: 'Employee', value: 'employee' },
    { label: 'Contractor', value: 'contractor' },
    { label: 'Guest', value: 'guest' },
    { label: 'Overtime', value: 'overtime' }
  ];

  useEffect(() => {
    getCompany().then(setCompanies);
    getCanteenCalender(1).then(setCalendars);
  }, []);

  useEffect(() => {
    if (!selectedCompany) {
      setPlants([]);
      setSelectedPlant(null);
      return;
    }
    getPlant(selectedCompany).then(setPlants);
  }, [selectedCompany]);

  const getData = async () => {
    try {
      if (!selectedCalendar) {
        setData([]);
        return;
      }

      const payload = {
        canteenCalenderId: selectedCalendar,
        companyId: selectedCompany || null,
        employeeType: selectedType,
        plant_id: selectedPlant || null
      };

      const res = dateReport
        ? await getCanteenReportDate(payload)
        : await getCanteenReport(payload);

      setData(res);
    } catch (err) {
      console.error(err);
      toast.error('Error fetching canteen report');
    }
  };

  useEffect(() => {
    if (selectedCalendar) getData();
  }, [dateReport]);

  return (
    <Stack gap={2}>
      <Tools />

      <Box>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          <FormControl fullWidth>
            <InputLabel>Select Calendar</InputLabel>
            <Select
              value={selectedCalendar}
              label="Select Calendar"
              onChange={(e) => setSelectedCalendar(e.target.value)}
            >
              <MenuItem value="">
                <em>Select Calendar</em>
              </MenuItem>
              {calendars.map((c) => (
                <MenuItem
                  key={c.canteen_calendar_id}
                  value={c.canteen_calendar_id}
                >
                  {c.month_year}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Select Company</InputLabel>
            <Select
              value={selectedCompany}
              label="Select Company"
              onChange={(e) => setSelectedCompany(e.target.value)}
            >
              <MenuItem value="">
                <em>Select Company</em>
              </MenuItem>
              {companies.map((c) => (
                <MenuItem key={c.company_id} value={c.company_id}>
                  {c.company_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Select Plant</InputLabel>
            <Select
              value={selectedPlant || ''}
              label="Select Plant"
              onChange={(e) =>
                setSelectedPlant(e.target.value || null)
              }
            >
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
              onChange={(e) =>
                setSelectedType(e.target.value || null)
              }
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
            disabled={!selectedCalendar}
          >
            Apply
          </Button>
        </Stack>
      </Box>

      <Content
        data={data}
        meta={{
          month:
            calendars.find(
              (c) => c.canteen_calendar_id === selectedCalendar
            )?.month_year || '',
          company:
            companies.find(
              (c) => c.company_id === selectedCompany
            )?.company_name || '',
          type: selectedType || 'All'
        }}
        dateReport={dateReport}
        onDateToggle={setDateReport}
      />
    </Stack>
  );
}
