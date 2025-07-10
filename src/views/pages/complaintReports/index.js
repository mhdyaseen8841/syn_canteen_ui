import React, { useState, useEffect } from 'react';
import { MenuItem, Box, Stack, Button, TextField } from '@mui/material';
// import Content from './content';
import Tools from './tools';
import { getComplaint } from '../../../utils/Service';
import { toast } from 'react-toastify';
import { formatDate } from 'utils/formatDate';
import StyledTable from './StyledTable';
export default function Index() {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [complaintData, setComplaintData] = useState([]);

  const fetchComplaints = async () => {
    if (!fromDate || !toDate) {
      toast.error('Please select From and To dates');
      return;
    }
    try {
      const payload = {
        from_date: fromDate,
        to_date: toDate,
        employee_id: employeeId?.trim() || null
      };
      const res = await getComplaint(payload);
      setComplaintData(res.data || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch complaints');
    }
  };

  return (
    <Stack direction={'column'} gap={2}>
      {/* <Tools
        selectedCompany
        buttonClick={() => {
          if (!selectedCompany) {
            toast.error('Please select a company first');
            return;
          }
          setFormOpen(true);
        }}
        type={selectedType}
      /> */}

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} mt={2}>
        <TextField
          label="From Date"
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          fullWidth
        />
        <TextField
          label="To Date"
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          fullWidth
        />
        <TextField label="Search by Employee ID" value={employeeId} onChange={(e) => setEmployeeId(e.target.value)} fullWidth />
        <Button variant="contained" onClick={fetchComplaints}>
          Search
        </Button>
      </Stack>

      <StyledTable
        data={complaintData.map((item) => ({
          'Transaction Date': formatDate(item.transaction_date),
          'Employee Code': item.employee_code,
          'Employee Name': item.employee_name,
          'Employee Type': item.employee_type,
          Menu: item.menu_name,
          Complaint: item.complaint
        }))}
        header={['Transaction Date', 'Employee Code', 'Employee Name', 'Employee Type', 'Menu', 'Complaint']}
        isShowSerialNo={true}
        isShowAction={false}
      />
    </Stack>
  );
}
