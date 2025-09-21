import React from 'react';
import MainCard from 'ui-component/cards/MainCard';
import { Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import TableActionButton from 'ui-component/TableActionButton';

export default function StyledTable({
  data,
  header,
  isShowSerialNo = false,
  isShowAction = false,
  actions = ['Edit', 'Delete'],
  onActionChange,
  onClickAction
}) {
  const handleClick = (data) => {
    if (onClickAction) {
      onClickAction(data);
    }
  };

  return (
    <MainCard>
      <TableContainer sx={{ overflowX: 'auto' }}>
        <Table>
          <TableHead  sx={{ minWidth: header.length * 150 }} >
            <TableRow>
              {isShowSerialNo && <TableCell sx={{ color: 'primary.main' }}>SLNO</TableCell>}
              {header.map((head, i) => (
                <TableCell  key={i} sx={{ color: 'primary.main', minWidth: 120 }}>
                  {head}
                </TableCell>
              ))}
              {isShowAction && <TableCell sx={{ color: 'primary.main' }}>Action</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((dt, ind) => {
              return (
                <TableRow onClick={() => handleClick(dt._id)} key={ind}>
                  {isShowSerialNo && <TableCell>{ind + 1}</TableCell>}
                  {header.map((head, i) => {
                    if (head.toUpperCase() === 'IMAGE') {
                      return (
                        <TableCell key={i}>
                          <img style={{ height: '100px' }} src={`${dt[`${head}`]}`} alt="img" />
                        </TableCell>
                      );
                    } else if (dt.status != 'is_settled' && head.toUpperCase() === 'IS_SETTLED') {
                      return <TableCell key={i}>{dt[`${head}`] ? 'Yes' : 'No'}</TableCell>;
                    } else if (head.toUpperCase() === 'STATUS') {
                      const isActive = dt[`${head}`] !== 0;
                      return (
                        <TableCell key={i}>
                          <Chip
                            label={isActive ? 'Active' : 'Cancelled'}
                            color={isActive ? 'success' : 'error'}
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>
                      );
                    } else {
                      return <TableCell key={i}>{dt[`${head}`]}</TableCell>;
                    }
                  })}
                  {isShowAction && (
                    <TableCell>
                      {(() => {
                        const status = dt.STATUS ?? dt.Status ?? dt.status;
                        return status !== 0 ? <TableActionButton data={dt} onActionChange={onActionChange} actions={actions} /> : null;
                      })()}
                    </TableCell>
                  )}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </MainCard>
  );
}
