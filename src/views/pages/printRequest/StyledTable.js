import { Button } from "@mui/material";
import React from 'react';
import MainCard from 'ui-component/cards/MainCard';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import TableActionButton from 'ui-component/TableActionButton';

export default function StyledTable({
  data,
  header,
  isShowSerialNo = false,
  isShowAction = false,
  actions = [],
  onActionChange
}) {
  return (
    <MainCard>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {isShowSerialNo && <TableCell sx={{ color: "primary.main" }}>SLNO</TableCell>}
              {header.map((head, i) => (
                <TableCell key={i} sx={{ color: "primary.main" }}>
                  {head}
                </TableCell>
              ))}
              {isShowAction && <TableCell sx={{ color: "primary.main" }}>Action</TableCell>}
            </TableRow>
          </TableHead>

          <TableBody>
            {data.map((dt, ind) => (
              <TableRow key={ind}>
                {isShowSerialNo && <TableCell>{ind + 1}</TableCell>}

                {header.map((head, i) => (
                  <TableCell key={i}>
                    {dt[head]}
                  </TableCell>
                ))}

                {isShowAction && (
                  <TableCell>
                    {actions.includes("Print") && (
                      <Button
                        variant="contained"
                        color="secondary"
                        size="small"
                        onClick={() => onActionChange("Print", dt)}
                      >
                        Print
                      </Button>
                    )}
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
