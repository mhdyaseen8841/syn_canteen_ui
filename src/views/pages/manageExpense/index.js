import React, { useState, useEffect } from 'react';
import { Box, FormControl, InputLabel, MenuItem, Select, Stack, Typography } from '@mui/material';
import Content from './content';
import Tools from './tools';
import AddForm from './AddForm';
import { getExpense,getCanteenCalender, getMenu,addExpense,editExpense  } from '../../../utils/Service';
import { toast } from 'react-toastify';


export default function Index() {
  const [formOpen, setFormOpen] = useState(false);
  const [data, setData] = useState([]);
  const [canteenCalenderData, setCanteenCalenderData] = useState([]);
  const [selectedCalender, setSelectedCalender] = useState('');
  const [menu, setMenu] = useState([]);
  const [selectedMenu, setSelectedMenu] = useState('');
  const getData = async (calender = selectedCalender,menu = selectedMenu) => {
    console.log(selectedCalender)
    console.log(selectedMenu)
    try {
      const res = await getExpense(calender,menu);
      setData(res);
    } catch (err) {
      console.log(err);
      toast.error("Error fetching expenses");
    }
  };

  const getCanteenCalenderData = async () => {
    try {
      const res = await getCanteenCalender(0);
      setCanteenCalenderData(res);
    } catch (err) {
      console.log(err);
      toast.error("Error fetching calender data");

    }
  };

  const getMenuData = async (data) => {
    try {
      const res = await getMenu(data);
      setMenu(res);
    } catch (err) {
      console.log(err);
      toast.error("Error fetching menu data");
    }
  }

  const handleCalenderDate = (data) =>{
    setSelectedCalender(data)
    getData(data,selectedMenu);
  }

  const handleMenuChange = (data) => {
    setSelectedMenu(data)
    if(selectedCalender){
      getData(selectedCalender,data);
    }
  }

  useEffect(() => {
    getCanteenCalenderData();
    getMenuData()
  }, []);



  return (
    <Stack direction={'column'} gap={2}>
   <Tools buttonClick={() => setFormOpen(true)} selectedCalender={selectedCalender} />

       <Typography variant="h3" color={'secondary.main'}>
                      Select Filters
                    </Typography>
            <Box sx={{ mb: 2 }}>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
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
{/* 
                 <FormControl fullWidth>
                            <InputLabel>Menu</InputLabel>
                            <Select
                              value={selectedMenu}
                              label="Menu"
                              onChange={(e) => handleMenuChange(e.target.value)}
                            >
                              {menu.map((type) => (
                                <MenuItem key={type.menu_id} value={type.menu_id}>
                                 {type.menu_name}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl> */}
      
              </Stack>
            </Box>

      <AddForm open={formOpen} addData={addExpense} getData={getData} onClose={() => setFormOpen(false)} selectedCalender={selectedCalender} />
   
      <Content data={data} updateData={getData} selectedCalender={selectedCalender} editExpense={editExpense} menus={menu}/>
    </Stack>
  );
}
