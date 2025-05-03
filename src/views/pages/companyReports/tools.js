import { Add } from '@mui/icons-material';
import { Button, Stack, Typography } from '@mui/material';
import React from 'react';
import MainCard from 'ui-component/cards/MainCard';

export default function Tools({ buttonClick, type, selectedCompany }) {
  const hasDisabled = () => {
    if (selectedCompany == '' || selectedCompany == undefined || selectedCompany == null) {
      return true;
    } else false;
  };
  return (
    <MainCard>
      <Stack direction={'row'} sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h3" color={'secondary.main'}>
          Company Wise Reports
        </Typography>
        <Button
          disabled={hasDisabled}
          variant="contained"
          startIcon={<Add />}
          sx={{ backgroundColor: 'secondary.main' }}
          onClick={buttonClick}
        >
          Add Employees
        </Button>
      </Stack>
    </MainCard>
  );
}
