
import React, { useState,useEffect } from 'react'
import Content from './content'
import Tools from './tools'
import { Stack } from '@mui/material'
import DriverAdForm from './AdForm'
import { toast } from 'react-toastify';
import {getAllDrivers} from '../../../utils/Service'



export default function Index() {
  const [formOpen, setFormOpen] = useState(false)
  const [data, setData] = useState([])

const getAlldriver = () =>{
  getAllDrivers().then((res)=>{
    setData(res)
   }).catch((err) => {
  console.log(err)
  toast.error(err.response.data.message)
   })
}


  useEffect(() => {
    getAlldriver()
  }, [])
  return (
    <Stack direction={'column'} gap={2}>
      <DriverAdForm open={formOpen} getData={getAlldriver}  onClose={() => { setFormOpen(false) }} />
      <Tools buttonClick={()=>setFormOpen(true)}/>
      <Content  data={data} updateData={getAlldriver} />
    </Stack>
  )
}
