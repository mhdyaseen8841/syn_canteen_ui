import { TaskAltOutlined } from '@mui/icons-material'
import { Button, Stack, Typography, Box } from '@mui/material'
import React from 'react'
import MainCard from 'ui-component/cards/MainCard'

export default function Tools({ settleClick, disableSettle }) {
    return (
        <MainCard>
            <Stack direction={'row'} sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant='h3' color={'secondary.main'}>Manage Settlement</Typography>
                <Box>
                    <Button
                        variant='contained'
                        startIcon={<TaskAltOutlined />}
                        sx={{ mx: 1, backgroundColor: 'success.dark' }}
                        onClick={settleClick}
                        disabled={disableSettle}
                    >
                        Settle
                    </Button>
                </Box>
            </Stack>
        </MainCard>
    )
}