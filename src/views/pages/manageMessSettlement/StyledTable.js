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
  onClickAction,
  renderAction
}) {
  const handleClick = (data)=>{
if(onClickAction){
    onClickAction(data);
}
  }


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
              <TableRow key={ind}>
                {isShowSerialNo && <TableCell>{ind + 1}</TableCell>}
                {header.map((head, i) => (
                  <TableCell key={i}>
                    {head === 'Action' && renderAction
                      ? renderAction(dt)
                      : dt[head]}
                  </TableCell>
                ))}
                {isShowAction && (
                  <TableCell>
                    <TableActionButton
                      data={dt}
                      onActionChange={onActionChange}
                      actions={actions}
                    />
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </MainCard>
  );
}
