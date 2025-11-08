import React, { useState, useEffect } from 'react';
import { Box, FormControl, InputLabel, MenuItem, Select, Stack, Typography } from '@mui/material';
import Content from './content';
import Tools from './tools';
import AddForm from './AddForm';
import {  getCanteenCalender, getSettlementRates, doSettlement } from '../../../utils/Service';
import { toast } from 'react-toastify';
import DeleteConfirmationDialog from 'ui-component/DeleteConfirmationDialog';


export default function Index() {
  const [formOpen, setFormOpen] = useState(false);
  const [data, setData] = useState([]);
  const [canteenCalenderData, setCanteenCalenderData] = useState([]);
  const [selectedCalender, setSelectedCalender] = useState('');
   const [isSelectedCalendarSettled, setIsSelectedCalendarSettled] = useState(false); // Add this state
 const [confirmOpen, setConfirmOpen] = useState(false);

  const getData = async (calender = selectedCalender) => {
    try {
      const res = await getSettlementRates(calender);
      setData(res);
    } catch (err) {
      console.error(err);
      toast.error("Error fetching expenses");
    }
  };

  const getCanteenCalenderData = async () => {
    try {
      const res = await getCanteenCalender(3);
      setCanteenCalenderData(res);
    } catch (err) {
      console.error(err);
      toast.error("Error fetching calendar data");
    }
  };

  const handleCalenderDate = (data) => {
    setSelectedCalender(data);

    const selectedCal = canteenCalenderData.find(cal => cal.canteen_calendar_id === data);
   
    setIsSelectedCalendarSettled(selectedCal?.is_settled || false);
    getData(data);
  };

  useEffect(() => {
    getCanteenCalenderData();
  }, []);


    const handleSettle = () => {
    setConfirmOpen(true);
  };

  const handleConfirm = async () => {
    try {
      // Prepare array of { menu_id, amount }
      const menuData = data.map(item => ({
        menu_id: item.menu_id,
        amount: Number(item.menu_price || 0)
      }));

      await doSettlement({
        canteen_calendar_id: selectedCalender,
        menus: menuData
      });

      toast.success('Settlement successful');
    setSelectedCalender('');
    getData('')
    getCanteenCalenderData();
    } catch (err) {
      toast.error('Settlement failed');
      console.error(err);
    } finally {
      setConfirmOpen(false);
    }
  };
   const selectedCalendarData = canteenCalenderData.find(
        cal => cal.canteen_calendar_id === selectedCalender
    );
  return (
    <Stack direction="column" gap={2}>
       <Tools
                buttonClick={() => setFormOpen(true)}
                selectedCalender={isSelectedCalendarSettled}
                settleClick={handleSettle}
                disableSettle={!data.length}
                data={data}
                monthYear={selectedCalendarData?.month_year}
            />

      <Typography variant="h3" color="secondary.main">
        Select Calendar
      </Typography>
      <Box sx={{ mb: 2 }}>
        <FormControl fullWidth>
          <InputLabel>Select Date</InputLabel>
          <Select
            value={selectedCalender}
            label="Select Date"
            onChange={(e) => handleCalenderDate(e.target.value)}
          >
            <MenuItem value="">
              <em>Select a Date</em>
            </MenuItem>
            {canteenCalenderData.map((calender) => (
              <MenuItem key={calender.canteen_calendar_id} value={calender.canteen_calendar_id}>
                {calender.month_year}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Content
        data={data}
        updateData={getData}
        canteenCalenderId={selectedCalender}
      />

      <DeleteConfirmationDialog
        open={confirmOpen}
        title="Settle Confirmation"
        content="Are you sure you want to settle all menus?"
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirm}
      />
    </Stack>
  );
}
