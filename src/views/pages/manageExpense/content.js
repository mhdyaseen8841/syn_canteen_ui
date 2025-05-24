import React from 'react';
import StyledTable from './StyledTable';
import { tableHeaderReplace } from 'utils/tableHeaderReplace';
import { TextField, Box, Grid, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { useState } from 'react';
import { toast } from 'react-toastify';
import AddForm from './AddForm';
import { formatDate } from 'utils/formatDate';

const tableHeader = ['Menu Id', 'Menu Name', 'Expense Date', 'Amount',  'Settled', 'Active', 'Remarks'];

export default function Content({ data, deleteAd, updateData,selectedCalender,editExpense,menus }) {
  const [formOpen, setFormOpen] = useState(false);
  const [selectedData, setselectedData] = useState();
  const [searchName, setSearchName] = useState('');
 


  const filteredData = data.filter((item) => {
    // const nameMatch = item.name.toLowerCase().includes(searchName.toLowerCase());
    // return nameMatch;
    return item;
  });



  
  const tableData = tableHeaderReplace(
    filteredData,
    ['menu_id', 'menu_name', 'expense_date', 'expense_amount', 'is_settled', 'active', 'remarks'],
    tableHeader
  ).map((item) => {
    // Find the corresponding menu name using the menu_id from the menus prop
    const menu = menus.find((menu) => menu.menu_id === item['Menu Id']);
    return {
      ...item,
       'Menu Name': menu ? menu.menu_name : item['Menu Id'], // Use menu_name if found
      'Settled': item['Settled'] === 1 ? 'Yes' : 'No',
      'Active': item['Active'] === 1 ? 'Yes' : 'No',
      'Expense Date': formatDate(item['Expense Date']),
    };
  });
  const actionHandle = (e) => {
    if (e.action == 'delete') {
      const deleteData = {
      menu_id: e.data['Menu Id'],
        expense_date: e.data['Expense Date'],
        expense_amount: e.data['Amount'],
        is_settled: e.data['Settled'] === 'Yes' ? 1 : 0,
        active: 0,
        remarks: e.data['Remarks'],
        expense_id: e.data.expense_id,
        canteen_calendar_id: selectedCalender,
      };

      editExpense(deleteData)
        .then(() => {
          toast.success('Expense deleted successfully');
          updateData()
        })
        .catch((err) => {
          console.error(err);
          toast.error('Error deleting expense');
        });


    } else if (e.action == 'edit') {
      const editData = {
        menu_id: e.data['Menu Id'],
        expense_date: e.data['Expense Date'],
        expense_amount: e.data['Amount'],
        is_settled: e.data['Settled'] === 'Yes' ? 1 : 0,
        active: e.data['Active'] === 'Yes' ? 1 : 0,
        remarks: e.data['Remarks'],
        expense_id: e.data.expense_id,
      };
      setselectedData(editData);
      setFormOpen(true);
    }
   
  };

  return (
    <>
     {/* <Box sx={{ mb: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Search by Name"
              variant="outlined"
              size="small"
              fullWidth
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
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
        selectedCalender={selectedCalender}
        getData={updateData}
        addData={editExpense}
      />
      <StyledTable
        data={tableData}
        header={tableHeader}
        isShowSerialNo={true}
        isShowAction={true}
        actions={['edit','delete']}
        onActionChange={actionHandle}
      />
    </>
  );
}