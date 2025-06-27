import React from 'react';
import StyledTable from './StyledTable';


export default function Content({ data }) {
  const tableHeader = [
    'Menu Id',
    'Menu Name',
    'Fixed Count',
    'Regular Count',
    'Fixed Amount',
    'Fixed Total Amount',
    'Total Expense',
    'AC Dine Share',
    'Regular Amount'
  ];

  const tableData = data.map((item) => ({
    'Menu Id': item.menu_id,
    'Menu Name': item.menu_name,
    'Fixed Count': item.Fixed_Count,
    'Regular Count': item.Regular_Count,
    'Fixed Amount': item.Fixed_Amount,
    'Fixed Total Amount': item.Fixed_Total_Amount,
    'Total Expense': item.Total_Expense,
    'AC Dine Share': item.AC_Dine_Share,
    'Regular Amount': item.Regular_Amount
  }));

  return (
    <StyledTable
      data={tableData}
      header={tableHeader}
      isShowSerialNo={true}
      isShowAction={false}
    />
  );
}