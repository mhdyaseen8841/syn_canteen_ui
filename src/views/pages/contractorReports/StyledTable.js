import React, { useState } from 'react';
import {
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Pagination,
  Stack
} from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import TableActionButton from 'ui-component/TableActionButton';

export default function StyledTable({
  data,
  header,
  isShowSerialNo = false,
  isShowAction = false,
  actions = ['Edit', 'Delete'],
  onActionChange,
  onClickAction,
  rowsPerPage = 10, // Default rows per page
}) {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(data.length / rowsPerPage);

  const handleClick = (data) => {
    if (onClickAction) {
      onClickAction(data);
    }
  };

  const handlePageChange = (_, newPage) => {
    setPage(newPage);
  };

  const paginatedData = data.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  return (
    <MainCard>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {isShowSerialNo && <TableCell sx={{ color: 'primary.main' }}>SLNO</TableCell>}
              {header.map((head, i) => (
                <TableCell key={i} sx={{ color: 'primary.main' }}>{head}</TableCell>
              ))}
              {isShowAction && <TableCell sx={{ color: 'primary.main' }}>Action</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((dt, ind) => (
              <TableRow onClick={() => handleClick(dt._id)} key={ind}>
                {isShowSerialNo && <TableCell>{(page - 1) * rowsPerPage + ind + 1}</TableCell>}
                {header.map((head, i) => {
                  const fieldKey = head.replace(/\s+/g, '_');
                  const value = dt[head];

                  if (head.toUpperCase() === 'IMAGE') {
                    return (
                      <TableCell key={i}>
                        <img style={{ height: '100px' }} src={value} alt="img" />
                      </TableCell>
                    );
                  } else if (dt.status !== 'isHighRangeArea' && head.toUpperCase() === 'ISHIGHRANGEAREA') {
                    return (
                      <TableCell key={i}>{value ? 'Yes' : 'No'}</TableCell>
                    );
                  }
                  else if (head.toUpperCase().replace(/\s+/g, '_') === 'PREMIUM_ENABLED') {
                    const isPremium = dt[`${head}`] == 'Yes';
                  
                    return (
                      <TableCell key={i}>
                        <Chip 
                          label={isPremium ? 'Yes' : 'No'}
                          size="small"
                          variant="outlined"
                         color={isPremium ? 'success' : 'error'}
                        />
                      </TableCell>
                    );

                  
                  } else if (fieldKey === 'PREMIUM_ENABLED') {
                    const isPremium = value === 'Yes' || value === 1 || value === true;
                    return (
                      <TableCell key={i}>
                        <Chip
                          label={isPremium ? 'Yes' : 'No'}
                          size="small"
                          variant="filled"
                          sx={{
                            color: '#fff',
                            backgroundColor: isPremium ? 'success.main' : '#424242',
                          }}
                        />
                      </TableCell>
                    );
                  } else if (head.toUpperCase() === 'STATUS') {
                    return (
                      <TableCell key={i}>{value ? 'Active' : 'Inactive'}</TableCell>
                    );
                  } else {
                    return <TableCell key={i}>{value}</TableCell>;
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
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <Stack direction="row" justifyContent="flex-end" sx={{ p: 2 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            shape="rounded"
          />
        </Stack>
      )}
    </MainCard>
  );
}
