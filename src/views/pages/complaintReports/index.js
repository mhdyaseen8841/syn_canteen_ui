import React, { useState } from 'react';
import { Stack, Button, TextField } from '@mui/material';
import { getComplaint } from '../../../utils/Service';
import { toast } from 'react-toastify';
import { formatDate } from 'utils/formatDate';
import StyledTable from './StyledTable';
import Tools from './tools';
import ExportButtons from '../shared/ExportButtons';

export default function Index() {
  const today = new Date().toISOString().split('T')[0];
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState(today);
  const [employeeId, setEmployeeId] = useState('');
  const [complaintData, setComplaintData] = useState([]);

  const fetchComplaints = async () => {
    if (!fromDate || !toDate) {
      toast.error('Please select From and To dates');
      return;
    }

    const from = new Date(fromDate);
    const to = new Date(toDate);

    // Max range check: 3 months
    const maxRangeDate = new Date(from);
    maxRangeDate.setMonth(maxRangeDate.getMonth() + 3);

    if (to > maxRangeDate) {
      toast.error('Date range cannot exceed 3 months');
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

  const tableHeader = ['Transaction Date', 'Employee Code', 'Employee Name', 'Employee Type', 'Menu', 'Complaint'];

  const tableData = complaintData.map((item) => ({
    'Transaction Date': formatDate(item.transaction_date),
    'Employee Code': item.employee_code,
    'Employee Name': item.employee_name,
    'Employee Type': item.employee_type,
    Menu: item.menu_name,
    Complaint: item.complaint
  }));

  const meta = {
    from: fromDate,
    to: toDate,
    emp_id: employeeId
  };

  return (
    <Stack direction={'column'} gap={2}>
      <Tools />

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
          inputProps={{ max: today }}
          fullWidth
        />

        <TextField label="Search by Employee Cod" value={employeeId} onChange={(e) => setEmployeeId(e.target.value)} fullWidth />
        <Button variant="contained" onClick={fetchComplaints}>
          Search
        </Button>
      </Stack>

      {tableData.length > 0 && <ExportButtons data={tableData} headers={tableHeader} fileName="Canteen_Complaint_Report" meta={meta} />}

      <StyledTable data={tableData} header={tableHeader} isShowSerialNo={true} isShowAction={false} />
    </Stack>
  );
}
