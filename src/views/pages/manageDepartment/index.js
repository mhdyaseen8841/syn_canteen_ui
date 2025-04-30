import React, { useState, useEffect } from 'react';
import { Stack } from '@mui/material';
import Content from './content';
import Tools from './tools';
import AddForm from './AddForm';
import { getDepartment } from '../../../utils/Service';



export default function Index() {
  const [formOpen, setFormOpen] = useState(false);
  const [data, setData] = useState([]);

  const getData = async () => {
    try {
      const res = await getDepartment();
      setData(res);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  let addData = async (location) => {
    return true
  }
  return (
    <Stack direction={'column'} gap={2}>
      <AddForm open={formOpen} addData={addData} getData={getData} onClose={() => setFormOpen(false)} />
      <Tools buttonClick={() => setFormOpen(true)} />
      <Content data={data} updateData={getData} />
    </Stack>
  );
}
