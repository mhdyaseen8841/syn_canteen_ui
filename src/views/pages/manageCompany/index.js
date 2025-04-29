
import React, { useState,useEffect } from 'react'
import Content from './content'
import Tools from './tools'
import { Stack } from '@mui/material'
import CompanyAdForm from './CompanyAdForm'
import { toast } from 'react-toastify';
import {getAllCompany} from '../../../utils/Service'



export default function Index() {
  const [formOpen, setFormOpen] = useState(false)
  const [data, setData] = useState([])

const getAllCompanies = () =>{
  getAllCompany().then((res)=>{
    setData(res)
   }).catch((err) => {
  console.log(err)
  toast.error(err.response.data.message)
   })
}


  useEffect(() => {
    getAllCompanies()
  }, [])
  return (
    <Stack direction={'column'} gap={2}>
      <CompanyAdForm open={formOpen} getData={getAllCompanies}  onClose={() => { setFormOpen(false) }} />
      <Tools buttonClick={()=>setFormOpen(true)}/>
      <Content  data={data} updateData={getAllCompanies} />
    </Stack>
  )
}
