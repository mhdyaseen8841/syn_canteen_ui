import React, { useState, useEffect } from 'react';
import { Stack } from '@mui/material';
import Content from './content';
import Tools from './tools';
import AddForm from './AddForm';
import { getMenu,editMenu } from '../../../utils/Service';



export default function Index() {
  const [formOpen, setFormOpen] = useState(false);
  const [data, setData] = useState([]);

  const getData = async () => {
    try {
      const res = await getMenu();
      setData(res);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    console.log("heeeeeeeeeeeeeeeey")
    getData();
  }, []);

  let addMenu = async (location) => {
    return true
  }
  return (
    <Stack direction={'column'} gap={2}>
      <AddForm open={formOpen} addData={addMenu} getData={getData} onClose={() => setFormOpen(false)} />
      <Tools buttonClick={() => setFormOpen(true)} />
      <Content editData={editMenu} data={data} updateData={getData} />
    </Stack>
  );
}
