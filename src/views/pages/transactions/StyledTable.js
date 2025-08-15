import React from 'react';
import MainCard from 'ui-component/cards/MainCard';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import TableActionButton from 'ui-component/TableActionButton';

export default function StyledTable({
  data,
  header,
  isShowSerialNo = false,
  isShowAction = false,
  actions = ['Edit', 'Delete'],
  onActionChange,
  onClickAction,
  totalColumnKey = 'Total', // the key to sum
  dashboardData
}) {
  const handleClick = (data) => {
    if (onClickAction) {
      onClickAction(data);
    }
  };

  // Calculate total if totalColumnKey is provided
  const grandTotal =
    totalColumnKey && data.length
      ? data.reduce((sum, item) => sum + (Number(item[totalColumnKey]) || 0), 0)
      : 0;

      console.log( totalColumnKey && data.length
      ? data.reduce((sum, item) => sum + (Number(item[totalColumnKey]) || 0), 0)
      : 0);

      console.log(grandTotal)
  return (
    <MainCard>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {isShowSerialNo && <TableCell sx={{ color: 'primary.main' }}>SLNO</TableCell>}
              {header.map((head, i) => (
                <TableCell key={i} sx={{ color: 'primary.main' }}>
                  {head}
                </TableCell>
              ))}
              {isShowAction && <TableCell sx={{ color: 'primary.main' }}>Action</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((dt, ind) => (
              <TableRow onClick={() => handleClick(dt._id)} key={ind}>
                {isShowSerialNo && <TableCell>{ind + 1}</TableCell>}
                {header.map((head, i) => {
                  if (head.toUpperCase() === 'IMAGE') {
                    return (
                      <TableCell key={i}>
                        <img style={{ height: '100px' }} src={`${dt[head]}`} alt="img" />
                      </TableCell>
                    );
                  } else if (dt.status !== 'isHighRangeArea' && head.toUpperCase() === 'ISHIGHRANGEAREA') {
                    return <TableCell key={i}>{dt[head] ? 'Yes' : 'No'}</TableCell>;
                  } else if (head.toUpperCase() === 'STATUS') {
                    return <TableCell key={i}>{dt[head] ? 'Active' : 'Inactive'}</TableCell>;
                  } else {
                    return <TableCell key={i}>{dt[head]}</TableCell>;
                  }
                })}
                {isShowAction && (
                  <TableCell>
                    <TableActionButton
                      data={dt}
                      onActionChange={(e) => onActionChange(e)}
                      actions={actions}
                    />
                  </TableCell>
                )}
              </TableRow>
            ))}

            {/* Grand Total Row */}
           <TableRow>
  {isShowSerialNo && <TableCell />}
  <TableCell />
  <TableCell /> 
  <TableCell />
   <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f0f0f0' }}>
      {`₹${dashboardData
                    .reduce((sum, item) => sum + (Number(item.Total) || 0), 0)
                    .toLocaleString('en-IN', { minimumFractionDigits: 2 })}`}
    </TableCell>
 
  {isShowAction && <TableCell />}
</TableRow>

          </TableBody>
        </Table>
      </TableContainer>
    </MainCard>
  );
}
