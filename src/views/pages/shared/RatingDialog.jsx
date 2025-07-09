import React, { useState } from 'react';
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
          <Rating value={stars} onChange={(e, newValue) => setStars(newValue)} />
        </Box>
        <FormControlLabel
          control={<Checkbox checked={raiseComplaint} onChange={(e) => setRaiseComplaint(e.target.checked)} />}
          label="Do you want to Raise a complaint?"
        />
        {raiseComplaint && (
          <TextField label="Remarks" value={remarks} onChange={(e) => setRemarks(e.target.value)} fullWidth multiline minRows={3} />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={stars === 0}>
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
}
