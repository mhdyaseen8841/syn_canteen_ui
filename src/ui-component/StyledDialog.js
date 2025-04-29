import { Dialog, DialogTitle, Grow, Stack, Typography } from '@mui/material'
import React from 'react'
import { CloseRounded } from '@mui/icons-material';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Grow ref={ref} {...props}/>
});

export default function StyledDialog({ title,children,open,onClose, ...props }) {
    return (
        <Dialog {...props} open={open} TransitionComponent={Transition}>
            <DialogTitle>
                <Stack direction={'row'} sx={{justifyContent:'space-between',alignItems:'center'}}>
                    <Typography variant='h2' color={'primary.main'}>{title}</Typography>
                    <CloseRounded sx={{cursor:'pointer'}} onClick={onClose}/>
                </Stack>
            </DialogTitle>
            {children}
        </Dialog>
    )
}
