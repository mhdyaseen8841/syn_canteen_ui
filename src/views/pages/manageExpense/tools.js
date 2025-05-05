import { Add,TaskAltOutlined } from '@mui/icons-material'
import { Button, Stack, Typography,Box } from '@mui/material'
import React from 'react'
import MainCard from 'ui-component/cards/MainCard'

export default function Tools({buttonClick,selectedCalender}) {
    return (
        <MainCard>
            
            <Stack direction={'row'} sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant='h3' color={'secondary.main'}>Manage Expense</Typography>
                <Box >

                {/* <Button  variant='contained' startIcon={<TaskAltOutlined />} sx={{ mx:1,backgroundColor: 'success.dark' }} onClick={buttonClick}>Settle All</Button> */}
                <Button disabled={!selectedCalender} variant='contained' startIcon={<Add />} sx={{ mx:1,backgroundColor: 'secondary.main' }} onClick={buttonClick}>Add Expense</Button>
                </Box>
            </Stack>
        </MainCard>
    )
}
