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
            {data.map((dt, ind) => {
            
              return (
                <TableRow onClick={()=>handleClick(dt._id)} key={ind}>
                  {isShowSerialNo && <TableCell>{ind + 1}</TableCell>}
                  {header.map((head, i) => {
                    if (head.toUpperCase() === 'IMAGE') {
                      return (
                        <TableCell key={i}>
                          <img style={{ height: '100px' }} src={`${dt[`${head}`]}`} alt="img" />
                        </TableCell>
                      );
                    } 
                    else if (dt.status != 'isHighRangeArea' && head.toUpperCase() === 'ISHIGHRANGEAREA') {
                      return (
                        <TableCell key={i}>
                    {dt[`${head}`]?'Yes':'No'}
                
                        </TableCell>
                      );
                    }
                    else if (head.toUpperCase() === 'STATUS' ) {
                     
                      return (
                        <TableCell key={i}>
                    {dt[`${head}`]?'Active':'Inactive'}
                
                        </TableCell>
                      );
                    }
                     else {
                      return <TableCell key={i}>{dt[`${head}`]}</TableCell>;
                    }
                  })}
                  {isShowAction && (
                    <TableCell>
                      <TableActionButton
                        data={dt}
                        onActionChange={(e) => {
                          onActionChange(e);
                        }}
                        actions={actions}
                      />
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
