import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import StyledTable from './StyledTable';
import { formatDate } from 'utils/formatDate';
import { toast } from 'react-toastify';
import { Paper } from '@mui/material';
import ExportButtons from '../shared/ExportButtons';

export default function ContractorDashboard({ data, contractorMeta }) {
  const { contractorName, contractorCode, month, companyName } = contractorMeta || {};

  // Extracting the two result sets from API data
  const summary = data?.summary || [];
  const transactionDetails = data?.transactionDetails || [];

  // Transform summary for table
  const transformedSummary = summary.map((item) => ({
    'Contractor Name': item.employee_name,
    'Company Name': item.company_name,
    'Date': formatDate(item.transaction_date),
    'Menu': item.menu_name,
    'Count': item.tx_count
  }));

  const grandTotal = summary.reduce((sum, item) => sum + parseFloat(item.tx_count || 0), 0);

  const summaryHeaders = ['Contractor Name', 'Company Name', 'Date', 'Menu', 'Count'];

  const summaryData = transformedSummary;

  const transactionHeaders = ['Date', 'Transaction ID', 'Menu'];

  const transactionData = transactionDetails.map((d) => ({
    Date: formatDate(d.transaction_date),
    'Transaction ID': d.transaction_id,
    Menu: d.menu_name
  }));

  const meta = {
    name: contractorName,
    code: contractorCode,
    month,
    company: companyName,
    total_transactions: grandTotal
  };

  return (
    <>
      {/* Export Button */}
      {transactionDetails.length > 0 && (
        <ExportButtons
          sections={[
            {
              title: 'Summary',
              headers: summaryHeaders,
              data: summaryData
            },
            {
              title: 'Transactions',
              headers: transactionHeaders,
              data: transactionData
            }
          ]}
          fileName="Contractor_Report"
          meta={meta}
        />
      )}

      {/* Summary Section */}
      <Typography variant="h2" mt={2} color="secondary.main">
        🧾 Contractor Summary
      </Typography>

      {summary.length > 0 ? (
        <StyledTable
          data={transformedSummary}
          header={summaryHeaders}
          isShowSerialNo={true}
          isShowAction={false}
          rowsPerPage={20}
        />
      ) : (
        <Box mt={2} mb={2}>
          <Typography variant="body1" color="textSecondary">
            No summary found for this contractor.
          </Typography>
        </Box>
      )}

      {/* Grand Total */}
      {summary.length > 0 && (
        <Box display="flex" justifyContent="flex-end" mt={4}>
          <Paper
            elevation={8}
            sx={{
              bgcolor: '#ffffff',
              color: '#34495e',
              p: 4,
              minWidth: 360,
              maxWidth: 500,
              borderRadius: 2,
              border: '1px solid #e0e0e0',
              boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.08)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: 8,
                bgcolor: '#28a745'
              }}
            />
            <Typography
              variant="h3"
              fontWeight={500}
              sx={{ color: '#28a745', letterSpacing: '0.5px', mt: 2 }}
            >
              Total Transactions: <span style={{ color: '#28a745' }}>{grandTotal}</span>
            </Typography>
          </Paper>
        </Box>
      )}

      {/* Transactions Section */}
      <Typography variant="h2" mt={4} color="secondary.main">
        🧾 Transactions
      </Typography>

      {transactionDetails.length > 0 ? (
        <StyledTable
          data={transactionDetails.map((d) => ({
            Date: formatDate(d.transaction_date),
            'Transaction ID': d.transaction_id,
            Menu: d.menu_name
          }))}
          header={transactionHeaders}
          isShowSerialNo={true}
          isShowAction={false}
        />
      ) : (
        <Box mt={2} mb={2}>
          <Typography variant="body1" color="textSecondary">
            No transactions found for this contractor.
          </Typography>
        </Box>
      )}
    </>
  );
}
