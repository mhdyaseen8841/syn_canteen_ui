import React, { useState, useEffect } from 'react';
import { Stack } from '@mui/material';
import Content from './content';
import Tools from './tools';
import AddForm from './AddForm';
import { getDepartment,addDepartment } from '../../../utils/Service';



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

  const isExist = (name) => {
    const nameToCheck = name.trim().toLowerCase();
    return data.some(dep => dep.department_name?.trim().toLowerCase() === nameToCheck);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <Stack direction={'column'} gap={2}>
      <AddForm open={formOpen} addData={addDepartment} getData={getData} onClose={() => setFormOpen(false)} isExist={isExist}/>
      <Tools  buttonClick={() => setFormOpen(true)} />
      <Content data={data} updateData={getData} isExist={isExist}/>
    </Stack>
  );
}
