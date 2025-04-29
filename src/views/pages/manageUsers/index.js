
import React, { useState,useEffect } from 'react'
import Content from './content'
import Tools from './tools'
import { Stack } from '@mui/material'
import UserAdForm from './UserAdForm'
import { toast } from 'react-toastify';
import {getAllCompany, getAllUsers} from '../../../utils/Service'



export default function Index() {
  const [formOpen, setFormOpen] = useState(false)
  const [data, setData] = useState([])

const getData = (query) =>{
  getAllUsers(query).then((res)=>{
    setData(res)
   }).catch((err) => {
  console.log(err)
  toast.error(err.response.data.message)
   })
}


const [company, setCompany] = useState([])

const getAllCompanies = () =>{
  getAllCompany().then((res)=>{
    setCompany(res)
   }).catch((err) => {
  console.log(err)
  toast.error(err.response.data.message)
   })
}

  useEffect(() => {
    getAllCompanies()
    getData()
  }, [])
  return (
    <Stack direction={'column'} gap={2}>
      <UserAdForm open={formOpen} getData={getData} getAllCompanies={getAllCompanies}  onClose={() => { setFormOpen(false) }} />
      <Tools buttonClick={()=>setFormOpen(true)}/>
      <Content  data={data} updateData={getData} companyData={company} />
    </Stack>
  )
}
