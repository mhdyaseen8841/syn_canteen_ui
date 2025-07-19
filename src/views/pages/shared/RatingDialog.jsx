import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Checkbox,
  FormControlLabel,
  TextField,
  Box,
  Rating
} from '@mui/material';
import { toast } from 'react-toastify';
export default function RatingDialog({ open, onClose, onSubmit, transaction }) {
  const [stars, setStars] = useState(0);
  const [raiseComplaint, setRaiseComplaint] = useState(false);
  const [remarks, setRemarks] = useState('');
  const [isReadOnly, setIsReadOnly] = useState(false);


useEffect(() => {
  if (transaction) {
    setStars(transaction.rating || 0);
    setRaiseComplaint(!!(transaction.Is_Complaint)); // Use correct key, convert 1 to true
    setRemarks(transaction.Remarks || '');
    setIsReadOnly(!!transaction.rating);
  }
}, [transaction, open]);

  const handleSubmit = () => {
    if (raiseComplaint && !remarks.trim()) {
      toast.error('Please provide remarks for the complaint.');
      return;
    }

    onSubmit({
      stars,
      raiseComplaint,
      remarks,
      transaction
    });

    onClose();
    setStars(0);
    setRaiseComplaint(false);
    setRemarks('');
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Rate Transaction</DialogTitle>
      <DialogContent>
        <Box mb={2}>
          <Typography gutterBottom>How was your meal?</Typography>
           <Rating
            value={stars}
            onChange={(e, newValue) => !isReadOnly && setStars(newValue)}
            readOnly={isReadOnly}
          />
        </Box>
       <FormControlLabel
          control={
            <Checkbox
              checked={raiseComplaint}
              onChange={(e) => !isReadOnly && setRaiseComplaint(e.target.checked)}
              disabled={isReadOnly}
            />
          }
          label="Do you want to raise a complaint?"
        />
       {(raiseComplaint || remarks) && (
          <TextField
            label="Remarks"
            value={remarks}
            onChange={(e) => !isReadOnly && setRemarks(e.target.value)}
            fullWidth
            multiline
            minRows={3}
            disabled={isReadOnly}
          />
        )}

{transaction?.Action_Taken && (
  <Box mt={2}>
    <Typography variant="subtitle2" color="primary">Action Taken:</Typography>
    <Typography variant="body2">{transaction.Action_Taken}</Typography>
  </Box>
)}


      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        {!isReadOnly && (
          <Button variant="contained" onClick={handleSubmit} disabled={stars === 0}>
            Submit
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
