import React from 'react';
import { useState } from 'react';
import { Box, Button, Stack, Typography } from '@mui/material';
import StyledTable from './StyledTable';
import { formatDate } from 'utils/formatDate';
import DeleteConfirmationDialog from 'ui-component/DeleteConfirmationDialog';
import AddForm from './AddForm';
import { toast } from 'react-toastify';
import { Paper } from '@mui/material';
import RatingDialog from '../shared/RatingDialog';
import { addRating } from 'utils/Service';
import StarRateIcon from '@mui/icons-material/StarRate';
export default function Content({ data, role }) {
  const [ratingOpen, setRatingOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const handleRatingSubmit = (ratingData) => {
    const { stars, raiseComplaint, remarks, transaction } = ratingData;

    const payload = {
      transactionId: transaction.Transaction_No,
      rating: stars,
      isComplaint: raiseComplaint ? 1 : 0,
      remarks: raiseComplaint ? remarks : ''
    };

    addRating(payload)
      .then(() => {
        toast.success('Rating submitted successfully');
      })
      .catch((err) => {
        console.error(err);
        toast.error('Failed to submit rating');
      });
  };

  const summary = data?.summary || [];
  const transactionDetails = data?.transactionDetails || [];
  const isSettled = data?.is_Settled === 1;
  const acDineCharge = parseFloat(data?.AC_Dine_Charge || 0);

  const transformedSummary = summary.map((item) => ({
    'Menu Name': item.menu_name,
    Count: item.Count,
    Rate: item.Rate,
    Total: item.Total
  }));

  const grandTotal = summary.reduce((sum, item) => sum + parseFloat(item.Total), 0);
  const totalWithPremium = grandTotal + acDineCharge;

  return (
    <>
      {isSettled && (
        <>
          <Typography variant="h2" mt={2} color="secondary.main">
            🧾 Summary
          </Typography>

          <StyledTable
            data={transformedSummary}
            header={['Menu Name', 'Count', 'Rate', 'Total']}
            isShowSerialNo={true}
            isShowAction={false}
            rowsPerPage={20}
          />

          <Box display="flex" justifyContent="flex-end" mt={4}>
            <Paper
              elevation={8}
              sx={{
                bgcolor: '#ffffff',
                color: '#34495e',
                p: 4,
                minWidth: 360, // Slightly wider to accommodate larger text
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
                  height: 8, // Slightly thicker accent bar for more presence
                  bgcolor: '#28a745' // Primary accent color
                }}
              />

              <Stack spacing={2.5} alignItems="flex-end" sx={{ mt: 1.5 }}>
                {' '}
                {/* Increased spacing and margin-top */}
                <Typography
                  variant="h3" // Significantly larger for Grand Total
                  fontWeight={500}
                  sx={{ color: '#28a745', letterSpacing: '0.5px' }}
                >
                  Grand Total : <span style={{ color: '#28a745' }}>₹{grandTotal.toFixed(2)}</span>
                </Typography>
                <>
                  <Typography
                    variant="h4" // Larger for Premium charge, clearly visible
                    fontWeight={500}
                    sx={{ color: '#546e7a' }}
                  >
                    Premium (AC Dine) : <span style={{ color: '#546e7a' }}>₹{acDineCharge ? acDineCharge.toFixed(2) : 0}</span>
                  </Typography>

                  <Typography
                    variant="h3" // Prominent for Total with Premium, just below Grand Total
                    fontWeight={600}
                    sx={{ color: '#c0392b' }}
                  >
                    Total with Premium : <span style={{ color: '#c0392b' }}>₹{totalWithPremium.toFixed(2)}</span>
                  </Typography>
                </>
              </Stack>
            </Paper>
          </Box>
        </>
      )}
      <Typography variant="h2" mt={4} color="secondary.main">
        🧾 Transactions
      </Typography>

      {transactionDetails.length > 0 ? (
        <StyledTable
          data={transactionDetails.map((d) => ({
            Date: formatDate(d.transaction_date),
            Receipt: d.Transaction_No,
            Menu: d.menu_name,
            Action:
              role === 'employee' ? (
                <Button
                  size="small"
                  variant="contained"
                  startIcon={<StarRateIcon />}
                  sx={{
                    backgroundColor: '#f57c00', // deep orange
                    color: '#fff',
                    '&:hover': {
                      backgroundColor: '#ef6c00'
                    }
                  }}
                  onClick={() => {
                    setSelectedTransaction(d);
                    setRatingOpen(true);
                  }}
                >
                  Rate
                </Button>
              ) : null
          }))}
          header={role === 'employee' ? ['Date', 'Receipt', 'Menu', 'Action'] : ['Date', 'Receipt', 'Menu']}
          isShowSerialNo={true}
          isShowAction={false}
        />
      ) : (
        <Box mt={2} mb={2}>
          <Typography variant="body1" color="textSecondary">
            No transactions found for this employee.
          </Typography>
        </Box>
      )}

      <RatingDialog
        open={ratingOpen}
        onClose={() => setRatingOpen(false)}
        onSubmit={handleRatingSubmit}
        transaction={selectedTransaction}
      />
    </>
  );
}
