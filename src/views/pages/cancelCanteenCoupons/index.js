import React, { useState } from 'react';
import {
  Box, Button, Stack, TextField, Typography,
  Dialog, DialogTitle, DialogContent, DialogActions,
  Paper, Divider, Chip, ToggleButton, ToggleButtonGroup
} from '@mui/material';
import { toast } from 'react-toastify';
import { cancelCoupon } from '../../../utils/Service';

export default function CancelCanteenCoupons() {
  const [mode, setMode]               = useState('single'); // 'single' | 'range'
  const [couponNumber, setCouponNumber] = useState('');
  const [fromCoupon, setFromCoupon]   = useState('');
  const [toCoupon, setToCoupon]       = useState('');
  const [reason, setReason]           = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [loading, setLoading]         = useState(false);

  const fromNum    = parseInt(fromCoupon, 10);
  const toNum      = parseInt(toCoupon, 10);
  const totalCount = fromCoupon && toCoupon && toNum >= fromNum ? toNum - fromNum + 1 : 0;

  const isValid = mode === 'single'
    ? !!couponNumber && !!reason
    : !!fromCoupon && !!toCoupon && !!reason && fromNum > 0 && toNum >= fromNum;

  const handleModeChange = (_, newMode) => {
    if (!newMode) return; // prevent deselect
    setMode(newMode);
    setCouponNumber('');
    setFromCoupon('');
    setToCoupon('');
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      let payload;
      if (mode === 'single') {
        payload = { transactionId: Number(couponNumber), Reason: reason };
      } else {
        payload = { transactionIdFrom: fromNum, transactionIdTo: toNum, Reason: reason };
      }

      const res = await cancelCoupon(payload);

      if (res && res.success) {
        toast.success(
          mode === 'single'
            ? 'Coupon cancelled successfully'
            : `Coupon(s) ${fromCoupon} – ${toCoupon} cancelled successfully`
        );
        setCouponNumber('');
        setFromCoupon('');
        setToCoupon('');
        setReason('');
      } else {
        toast.error(res?.message || 'Failed to cancel coupon');
      }
    } catch (err) {
      console.error(err);
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
        <Typography variant="h2" color="secondary.main" sx={{ mb: 3, textAlign: 'center', fontWeight: 700 }}>
          Cancel Canteen Coupon
        </Typography>

        {/* Mode toggle */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <ToggleButtonGroup
            value={mode}
            exclusive
            onChange={handleModeChange}
            size="medium"
          >
            <ToggleButton value="single" sx={{ px: 3, fontSize: 15, fontWeight: 600 }}>
              Single Coupon
            </ToggleButton>
            <ToggleButton value="range" sx={{ px: 3, fontSize: 15, fontWeight: 600 }}>
              Coupon Range
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <Stack spacing={3}>
          {/* Single mode */}
          {mode === 'single' && (
            <TextField
              label="Coupon Number"
              type="number"
              value={couponNumber}
              onChange={e => setCouponNumber(e.target.value.replace(/\D/g, ''))}
              required
              fullWidth
              inputProps={{ style: { fontSize: 22, padding: 16 }, inputMode: 'numeric', pattern: '[0-9]*' }}
              sx={{ '& input[type=number]::-webkit-inner-spin-button, & input[type=number]::-webkit-outer-spin-button': { display: 'none' }, '& input[type=number]': { MozAppearance: 'textfield' } }}
            />
          )}

          {/* Range mode */}
          {mode === 'range' && (
            <>
              <Stack direction="row" spacing={2} alignItems="center">
                <TextField
                  label="From"
                  type="number"
                  value={fromCoupon}
                  onChange={e => setFromCoupon(e.target.value.replace(/\D/g, ''))}
                  required
                  fullWidth
                  inputProps={{ style: { fontSize: 20, padding: 14 }, inputMode: 'numeric', min: 1 }}
                  sx={{ '& input[type=number]::-webkit-inner-spin-button, & input[type=number]::-webkit-outer-spin-button': { display: 'none' }, '& input[type=number]': { MozAppearance: 'textfield' } }}
                />
                <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.secondary', whiteSpace: 'nowrap' }}>
                  —
                </Typography>
                <TextField
                  label="To"
                  type="number"
                  value={toCoupon}
                  onChange={e => setToCoupon(e.target.value.replace(/\D/g, ''))}
                  required
                  fullWidth
                  error={!!toCoupon && !!fromCoupon && toNum < fromNum}
                  helperText={!!toCoupon && !!fromCoupon && toNum < fromNum ? '"To" must be ≥ "From"' : ''}
                  inputProps={{ style: { fontSize: 20, padding: 14 }, inputMode: 'numeric', min: 1 }}
                  sx={{ '& input[type=number]::-webkit-inner-spin-button, & input[type=number]::-webkit-outer-spin-button': { display: 'none' }, '& input[type=number]': { MozAppearance: 'textfield' } }}
                />
              </Stack>

              {totalCount > 0 && (
                <Box sx={{ textAlign: 'center' }}>
                  <Chip
                    label={`${totalCount} coupon${totalCount > 1 ? 's' : ''} will be cancelled`}
                    color="warning"
                    sx={{ fontSize: 15, fontWeight: 600, px: 1 }}
                  />
                </Box>
              )}
            </>
          )}

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
            color="error"
            size="large"
            sx={{ fontSize: 20, py: 2 }}
            disabled={!isValid || loading}
            onClick={() => setConfirmOpen(true)}
          >
            Cancel Coupon{mode === 'range' ? 's' : ''}
          </Button>
        </Stack>
      </Paper>

      {/* Confirmation Dialog */}
      <Dialog open={confirmOpen} onClose={() => !loading && setConfirmOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontSize: 22, fontWeight: 700 }}>Confirm Cancellation</DialogTitle>
        <Divider />
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            {mode === 'single' ? (
              <Typography sx={{ fontSize: 17 }}>
                Are you sure you want to cancel coupon <b>{couponNumber}</b>?
              </Typography>
            ) : (
              <>
                <Typography sx={{ fontSize: 17 }}>
                  You are about to cancel <b>{totalCount} coupon{totalCount > 1 ? 's' : ''}</b>:
                </Typography>
                <Box sx={{ bgcolor: 'action.hover', borderRadius: 2, px: 3, py: 1.5, textAlign: 'center' }}>
                  <Typography sx={{ fontSize: 20, fontWeight: 700 }}>
                    {fromCoupon} &nbsp;→&nbsp; {toCoupon}
                  </Typography>
                </Box>
              </>
            )}
            <Typography sx={{ fontSize: 15, color: 'text.secondary' }}>
              <b>Reason:</b> {reason}
            </Typography>
            <Typography sx={{ fontSize: 15, color: 'error.main', fontWeight: 600 }}>
              ⚠️ This action cannot be undone.
            </Typography>
          </Stack>
        </DialogContent>
        <Divider />
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setConfirmOpen(false)} disabled={loading} sx={{ fontSize: 17 }}>
            No, Go Back
          </Button>
          <Button onClick={handleSubmit} color="error" variant="contained" disabled={loading} sx={{ fontSize: 17 }}>
            {loading ? 'Cancelling…' : `Yes, Cancel${mode === 'range' ? ' All' : ''}`}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
