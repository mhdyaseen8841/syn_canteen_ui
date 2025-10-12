import React, { useState } from 'react';
import { Box, Button, Stack, TextField, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Paper } from '@mui/material';
import { toast } from 'react-toastify';
import { cancelCoupon } from '../../../utils/Service';

export default function CancelCanteenCoupons() {
  const [couponNumber, setCouponNumber] = useState('');
  const [reason, setReason] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await cancelCoupon({ transactionId: Number(couponNumber), Reason: reason });
      console.log(res)
      if (res && res.success) {
        toast.success('Coupon cancelled successfully');
        setCouponNumber('');
        setReason('');
      } else {
        console.log(res)
        toast.error(res?.message || 'Failed to cancel coupon');
      }
    } catch (err) {
        console.log(res)
      toast.error('Failed to cancel coupon');
    } finally {
      setLoading(false);
      setConfirmOpen(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'transparent'
      }}
    >
      <Paper elevation={4} sx={{ p: { xs: 3, md: 6 }, minWidth: { xs: 320, md: 500 }, maxWidth: 600 }}>
        <Typography variant="h2" color="secondary.main" sx={{ mb: 4, textAlign: 'center', fontWeight: 700 }}>
          Cancel Canteen Coupon
        </Typography>
        <Stack spacing={3}>
          <TextField
            label="Coupon Number"
            type="number"
            value={couponNumber}
            onChange={e => setCouponNumber(e.target.value.replace(/\D/, ''))}
            required
            fullWidth
            inputProps={{ style: { fontSize: 22, padding: 16 }, inputMode: 'numeric', pattern: '[0-9]*' }}
          />
          <TextField
            label="Reason"
            value={reason}
            onChange={e => setReason(e.target.value)}
            required
            fullWidth
            multiline
            minRows={3}
            inputProps={{ style: { fontSize: 20, padding: 16 } }}
          />
          <Button
            variant="contained"
            color="primary"
            size="large"
            sx={{ fontSize: 20, py: 2 }}
            disabled={!couponNumber || !reason || loading}
            onClick={() => setConfirmOpen(true)}
          >
            Cancel Coupon
          </Button>
        </Stack>
      </Paper>

      {/* Confirmation Dialog */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle sx={{ fontSize: 22 }}>Confirm Cancellation</DialogTitle>
        <DialogContent sx={{ fontSize: 18 }}>
          Are you sure you want to cancel coupon <b>{couponNumber}</b>?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)} disabled={loading} sx={{ fontSize: 18 }}>No</Button>
          <Button onClick={handleSubmit} color="error" disabled={loading} sx={{ fontSize: 18 }}>
            Yes, Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}