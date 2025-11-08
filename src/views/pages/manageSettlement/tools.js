import { TaskAltOutlined, FileDownloadOutlined } from '@mui/icons-material'
import { Button, Stack, Typography, Box } from '@mui/material'
import React from 'react'
import MainCard from 'ui-component/cards/MainCard'
import * as XLSX from 'xlsx';

export default function Tools({ settleClick, disableSettle, selectedCalender, data, monthYear }) {
    const handleExport = () => {
        if (!data || data.length === 0) return;

        // Format data for export
        const exportData = data.map(item => ({
            'Menu': item.menu_name,
            'Menu Price': item.menu_price,
            'Count': item.tx_Count,
            'Collected Amount': item.Fixed_Amount,
            'Total Expense': item.Total_Expense
            
        }));

        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(exportData);
        XLSX.utils.book_append_sheet(wb, ws, 'Settlement');
        XLSX.writeFile(wb, `Settlement_Report_${monthYear || 'Export'}.xlsx`);
    };

    return (
        <MainCard>
            <Stack direction={'row'} sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant='h3' color={'secondary.main'}>Manage Settlement</Typography>
                <Box>
                    {selectedCalender && data?.length > 0 && (
                        <Button
                            variant='contained'
                            startIcon={<FileDownloadOutlined />}
                            sx={{ mx: 1 }}
                            onClick={handleExport}
                        >
                            Export
                        </Button>
                    )}
                    <Button
                        variant='contained'
                        startIcon={<TaskAltOutlined />}
                        sx={{ mx: 1, backgroundColor: 'success.dark' }}
                        onClick={settleClick}
                        disabled={disableSettle || selectedCalender}
                    >
                        Settle
                    </Button>
                </Box>
            </Stack>
        </MainCard>
    )
}