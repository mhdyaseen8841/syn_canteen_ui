import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';

export default function DeleteConfirmationDialog({ open, title, content, onClose, onConfirm }) {
  return (
    <Dialog open={open} onClose={() => onClose(false)}>
      <DialogTitle>{title || "Confirm"}</DialogTitle>
      <DialogContent>
        <Typography>{content || "Are you sure you want to proceed?"}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose(false)} color="inherit">No</Button>
        <Button onClick={onConfirm} color="error" variant="contained">Yes</Button>
      </DialogActions>
    </Dialog>
  );
}