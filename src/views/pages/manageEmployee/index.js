import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Stack } from '@mui/material';
import Content from './content';
import Tools from './tools';
import AddForm from './AddForm';
import { getEmployee } from '../../../utils/Service';
import { toast } from 'react-toastify';


export default function Index() {
  const { companyId } = useParams();
  const navigate = useNavigate();


  const [formOpen, setFormOpen] = useState(false);
  const [data, setData] = useState([]);

  const getData = async () => {
    try {
      const res = await getEmployee();
      setData(res);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    console.log("dfdsfdsafsadfdsf")
    if (companyId) {
    getData();
  }else {
      console.log("company id not found")
      toast.error("company id not found")
      navigate('/company')
    }
  }, []);


  let addLocation = async (location) => {
    return true
  }
  return (
    <Stack direction={'column'} gap={2}>
      <AddForm open={formOpen} addLocation={addLocation} getLocation={getData} onClose={() => setFormOpen(false)} />
      <Tools buttonClick={() => setFormOpen(true)} />
      <Content data={data} updateData={getData} />
    </Stack>
  );
}
