import { Add } from '@mui/icons-material';
import { Button, Stack, Typography } from '@mui/material';
import React from 'react';
import MainCard from 'ui-component/cards/MainCard';

export default function Tools({ buttonClick, type, selectedCompany }) {
  const hasDisabled = () => {
    console.log("heey")
    if (selectedCompany == '' || selectedCompany == undefined || selectedCompany == null) {
      return true;
    } else 
    return false;
  };
  return (
    <MainCard>
      <Stack direction={'row'} sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h3" color={'secondary.main'}>
          Manage {type ? type : 'Employees / Contractor / Guest'}
        </Typography>
        <Button
          disabled={hasDisabled()}
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
