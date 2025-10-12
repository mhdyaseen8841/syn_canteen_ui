import React from 'react';
import StyledTable from './StyledTable';
import { tableHeaderReplace } from 'utils/tableHeaderReplace';
import { useState } from 'react';
import { toast } from 'react-toastify';
import AddForm from './AddForm';
import { deformatDate, formatDate } from 'utils/formatDate';
import DeleteConfirmationDialog from 'ui-component/DeleteConfirmationDialog';
import { Button, Stack } from '@mui/material';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
const tableHeader = ['Menu Id', 'Menu name', 'Expense Date', 'Amount', 'Remarks'];
const exportHeader = tableHeader.filter(h => h !== 'Menu Id');

export default function Content({ data, updateData,selectedCalender,editExpense,menus }) {
  const [formOpen, setFormOpen] = useState(false);
  const [selectedData, setselectedData] = useState();
  // const [searchName, setSearchName] = useState('');
   const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);



  const filteredData = data.filter((item) => {
    // const nameMatch = item.name.toLowerCase().includes(searchName.toLowerCase());
    // return nameMatch;
    return item;
  });



  
  const tableData = tableHeaderReplace(
    filteredData,
    [ 'menu_id','Menu Name', 'expense_date', 'expense_amount', 'remarks'],
    tableHeader
  ).map((item) => {
    // Find the corresponding menu name using the menu_id from the menus prop
    const menu = menus.find((menu) => menu.menu_id === item['Menu Id']);
    return {
      ...item,
       'Menu Name': item['menu_name'], // Use menu_name if found
      'Active': item['Active'] === 1 ? 'Yes' : 'No',
      'Expense Date': formatDate(item['Expense Date']),
    };
  });

  // Excel Export
const handleExportExcel = () => {
  if (!tableData.length) return;
  // Only include exportHeader columns, in order
  const exportData = tableData.map(row =>
    exportHeader.reduce((acc, key) => {
      acc[key] = row[key] ?? '';
      return acc;
    }, {})
  );
  const ws = XLSX.utils.json_to_sheet(exportData, { header: exportHeader });
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Expenses');
  XLSX.writeFile(wb, 'Expenses.xlsx');
};

  // PDF Export
  const handleExportPDF = () => {
    if (!tableData.length) return;
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text('Expenses', 10, 10);
    autoTable(doc, {
      head: [exportHeader],
      body: tableData.map(row => exportHeader.map(h => row[h] ?? '')),
      startY: 20
    });
    doc.save('Expenses.pdf');
  };

  const actionHandle = (e) => {
    if (e.action == 'delete') {
      setPendingDelete(e);
      setConfirmOpen(true);
      // const deleteData = {
      // menu_id: e.data['Menu Id'],
      //   expense_date: e.data['Expense Date'],
      //   expense_amount: e.data['Amount'],
      //   is_settled: e.data['Settled'] === 'Yes' ? 1 : 0,
      //   active: 0,
      //   remarks: e.data['Remarks'],
      //   expense_id: e.data.expense_id,
      //   canteen_calendar_id: selectedCalender,
      // };

      // editExpense(deleteData)
      //   .then(() => {
      //     toast.success('Expense deleted successfully');
      //     updateData()
      //   })
      //   .catch((err) => {
      //     console.error(err);
      //     toast.error('Error deleting expense');
      //   });


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


   const handleDeleteConfirm = () => {
    if (!pendingDelete) return;
    const e = pendingDelete;
    const deleteData = {
      menu_id: e.data['Menu Id'],
      expense_date: deformatDate(e.data['Expense Date']),
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
        updateData();
      })
      .catch((err) => {
        console.error(err);
        toast.error('Error deleting expense');
      })
      .finally(() => {
        setConfirmOpen(false);
        setPendingDelete(null);
      });
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
       <DeleteConfirmationDialog
        open={confirmOpen}
        title="Delete Expense"
        content="Are you sure you want to delete this expense?"
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDeleteConfirm}
      />
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

      {tableData.length > 0 && (
        <Stack direction="row" spacing={2} sx={{ mb: 2, justifyContent: 'flex-end' }}>
          <Button variant="outlined" onClick={handleExportExcel}>
            Export Excel
          </Button>
          <Button variant="outlined" onClick={handleExportPDF}>
            Export PDF
          </Button>
        </Stack>
      )}
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