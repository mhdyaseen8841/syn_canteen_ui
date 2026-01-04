import React from 'react';
import { Card, CardContent, Typography, Divider, Box, Chip } from '@mui/material';
import { styled } from '@mui/system'; // Import styled from @mui/system

// Styled components for better UI
const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: '12px',
  boxShadow: '0 6px 15px rgba(0,0,0,0.08)',
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 10px 20px rgba(0,0,0,0.12)',
  },
  display: 'flex',
  flexDirection: 'column',
  height: '100%', // Ensure cards in a grid have consistent height
}));

const CardHeader = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.primary.light,
  color: theme.palette.primary.contrastText,
  padding: theme.spacing(1.5, 2),
  borderTopLeftRadius: '12px',
  borderTopRightRadius: '12px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
}));

const InfoRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(1),
  '&:last-child': {
    marginBottom: 0,
  },
}));

const HighlightedInfoRow = styled(InfoRow)(({ theme }) => ({
  backgroundColor: '#E8F5E9', // A light green background (similar to success.light, but explicit hex for clarity)
  padding: theme.spacing(1),
  borderRadius: '8px',
  border: `1px solid ${theme.palette.success.light}`,
  marginTop: theme.spacing(1), // Add some space above it
  marginBottom: theme.spacing(1), // Add some space below it
}));

const Label = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  color: theme.palette.text.secondary,
  flexBasis: '60%', // Adjust width for labels
}));

const Value = styled(Typography)(({ theme }) => ({
  fontWeight: '600',
  color: theme.palette.text.primary,
  textAlign: 'right',
  flexBasis: '40%', // Adjust width for values
}));



export default function MenuCard({ data }) {
  const isFixed = data.Fixed_Count > 0 || data.Fixed_Amount !== null || data.Fixed_Total_Amount !== null;
  const isRegular = data.Regular_Count > 0 || data.menu_price !== null;

  return (
    <StyledCard >
      <CardHeader sx={{backgroundColor:'secondary.main'}}>
        <Typography  variant="h6" sx={{color: 'white' }}>
          {data.menu_name}
        </Typography>
        <Chip
          label={`ID: ${data.menu_id}`}
          size="small"
          sx={{ backgroundColor: 'rgba(255,255,255,0.3)', color: 'white', fontWeight: 'bold' }}
        />
      </CardHeader>

      <CardContent sx={{ flexGrow: 1 }}> {/* flexGrow to make content fill available space */}
  
          <Box sx={{ mb: 2 }}>
            {/* <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'primary.dark', mb: 1 }}>
              Fixed Menu Details
            </Typography> */}
            <InfoRow>
              <Label variant="body2">Count:</Label>
              <Value variant="body2">{data.tx_Count ?? '0'}</Value>
            </InfoRow>
            {/* <InfoRow>
              <Label variant="body2">Fixed Amount (Per Person):</Label>
              <Value variant="body2">{data.Fixed_Amount ? `₹${data.Fixed_Amount}` : 'N/A'}</Value>
            </InfoRow> */}
            <InfoRow>
              <Label variant="body2">Collected From Fixed :</Label>
              <Value variant="body2">{data.Fixed_Amount ? `₹${data.Fixed_Amount}` : '₹0'}</Value>
            </InfoRow>
            <Divider sx={{ my: 1.5 }} />
          </Box>
    

 
        <InfoRow>
          <Label variant="body2">AC Dine Share:</Label>
          <Value variant="body2">{data.Ac_Dine_Share !== null ? `${data.Ac_Dine_Share}` : 'N/A'}</Value>
        </InfoRow>
        <InfoRow>
          <Label variant="body1" sx={{ color: 'error.dark' }}>Total Expense:</Label>
          <Value variant="h6" sx={{ color: 'error.main', fontWeight: 'bold' }}>
            {data.Total_Expense ? `₹${data.Total_Expense}` : '₹0'}
          </Value>
        </InfoRow>
         <Divider sx={{ my: 1.5 }} />
     
     
          <Box sx={{ mb: 2 }}>
            {/* <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'primary.dark', mb: 1 }}>
              Regular Menu Details
            </Typography>
            <InfoRow>
              <Label variant="body2">Regular Count:</Label>
              <Value variant="body2">{data.Regular_Count ?? '0'}</Value>
            </InfoRow> */}
         
            {/* <Divider sx={{ my: 1.5 }} /> */}

         
{data.menu_price > 0 ? ( // Only show if Regular_Amount is greater than 0}
             <HighlightedInfoRow> {/* Using the new styled component */}
              <Label variant="body1" sx={{ color: 'success.dark' }}>Menu Price (Calculated):</Label>
              <Value variant="h2" sx={{ color: 'success.dark', fontWeight: 'bold' }}>
                {data.menu_price ? `₹${data.menu_price}` : '₹0'}
              </Value>
            </HighlightedInfoRow>
) : (
     <HighlightedInfoRow> {/* Using the new styled component */}
              <Label variant="body1" sx={{ color: 'error.dark' }}>Menu Price (Calculated):</Label>
              <Value variant="h2" sx={{ color: 'error.dark', fontWeight: 'bold' }}>
                {data.menu_price ? `₹${data.menu_price}` : '₹0'}
              </Value>
            </HighlightedInfoRow>
)}
          </Box>
   

       
      </CardContent>
    </StyledCard>
  );
}