import React from 'react';
import StyledTable from './StyledTable';
import { tableHeaderReplace } from 'utils/tableHeaderReplace';
import { TextField, Box, Grid, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { useState } from 'react';
import { toast } from 'react-toastify';
import AddForm from './AddForm';
import { deleteEmployeeTransaction } from 'utils/Service';
import DeleteConfirmationDialog from 'ui-component/DeleteConfirmationDialog';
import {  formatDateTime } from 'utils/formatDateTime';
const tableHeader = [
  'Transaction ID',
  'Company Name',
  'Emp Code',
  'Emp Name',
  'Emp Type',
  'Menu',
  'Date',
  'status',
  'Remarks',
  'Cancelled By',
  'Reason'
];

export default function Content({ data, deleteAd, updateData }) {
  const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
  const [formOpen, setFormOpen] = useState(false);
  const [selectedData, setselectedData] = useState();
  const [searchEmpId, setSearchEmpId] = useState('');
  const [searchDate, setSearchDate] = useState(today); // Set default to today
  const [confirmOpen, setConfirmOpen] = useState(false); // ✅ confirmation state
  const [pendingDelete, setPendingDelete] = useState(null); // ✅ temp delete item
const [deleteReason, setDeleteReason] = useState('');
const [reasonError, setReasonError] = useState('');

  const status = ['true', 'false'];

  const filteredData = data.filter((item) => {
    // const empIdMatch = item.empId.toLowerCase().includes(searchEmpId.toLowerCase());
    // const dateMatch = !searchDate || item.date.includes(searchDate);
    // return empIdMatch && dateMatch;
    return item;
  });

  const preFormattedData = data.map((item) => ({
  ...item,
  transaction_date: formatDateTime(item.transaction_date),
}));

  

  const tableData = tableHeaderReplace(
    preFormattedData,
    [
      'transaction_id',
      'company_name',
      'employee_code',
      'employee_name',
      'employee_type',
      'menu_name',
      'transaction_date',
      'status',
      'remarks',
      'cancelled_by',
      'cancelled_reason'
    ],
    tableHeader
  );



//   const tableData = tableHeaderReplace(
//   data,
//   [
//     'transaction_id',
//     'company_name',
//     'employee_code',
//     'employee_name',
//     'employee_type',
//     'menu_name',
//     'transaction_date',
//     'status',
//     'remarks',
//     'cancelled_by',
//     'cancelled_reason'
//   ],
//   tableHeader
// ).map((item) => ({
//   ...item,
//   'Transaction Date': formatDate(item.transaction_date), // format the date
//   'Cancelled By': item['Cancelled By'] || '-',               // handle empty values
//   'Cancelled Reason': item['Cancelled Reason'] || '-',
// }));

  const actionHandle = (e) => {
    if (e.action === 'delete') {
      console.log(e.data);
      setPendingDelete(e.data);
      setConfirmOpen(true);
    } else {
      setPendingDelete(null);
    }
  };

const handleDeleteConfirm = () => {
  if (!pendingDelete) return;
  if (!deleteReason.trim()) {
    setReasonError('Reason is required');
    return;
  }
  deleteEmployeeTransaction({
    transaction_id: pendingDelete['Transaction ID'],
    reason: deleteReason
  })
    .then(() => {
      toast.success('Transaction deleted successfully');
      updateData();
    })
    .catch((error) => {
      console.error(error);
      toast.error(error.response?.data?.message || 'Error deleting transaction');
    })
    .finally(() => {
      setConfirmOpen(false);
      setPendingDelete(null);
      setDeleteReason('');
      setReasonError('');
    });
};

  return (
    <>
      <DeleteConfirmationDialog
  open={confirmOpen}
  title="Delete Transaction"
  content={
    <>
      <div>Are you sure you want to delete this transaction?</div>
      <TextField
        label="Reason"
        value={deleteReason}
        onChange={e => {
          setDeleteReason(e.target.value);
          setReasonError('');
        }}
        error={!!reasonError}
        helperText={reasonError}
        fullWidth
        margin="normal"
      />
    </>
  }
  onClose={() => {
    setConfirmOpen(false);
    setDeleteReason('');
    setReasonError('');
  }}
  onConfirm={handleDeleteConfirm}
/>

      {/* <Box sx={{ mb: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              label="Search by Employee ID"
              variant="outlined"
              size="small"
              fullWidth
              value={searchEmpId}
              onChange={(e) => setSearchEmpId(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Search by Date"
              type="date"
              variant="outlined"
              size="small"
              fullWidth
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
              InputLabelProps={{
                shrink: true
              }}
            />
          </Grid>
          
        </Grid>
      </Box> */}

      <AddForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
        }}
        data={selectedData}
        isEdit={true}
      />
      <StyledTable
        data={tableData}
        header={tableHeader}
        isShowSerialNo={true}
        isShowAction={true}
        actions={['delete']}
        onActionChange={actionHandle}
      />
    </>
  );
}

