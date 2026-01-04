import React, { useState, useEffect } from 'react';
import { Stack } from '@mui/material';
import Content from './content';
import Tools from './tools';
import AddForm from './AddForm';
import { getCompany, getPlant, addPlant, editPlant } from '../../../utils/Service';



export default function Index() {
  const [formOpen, setFormOpen] = useState(false);
  const [data, setData] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState('');
  const [selectedData, setSelectedData] = useState(null);

  const getPlants = async (companyId) => {
    try {
      if (!companyId) {
        setData([]);
        return;
      }
      const res = await getPlant(companyId);
      setData(res || []);
    } catch (err) {
      console.log(err);
    }
  };

  const getCompanies = async () => {
    try {
      const res = await getCompany();
      setCompanies(res || []);
    } catch (err) {
      console.log(err);
    }
  };

  const isExist = (name) => {
    const nameToCheck = name.trim().toLowerCase();
    return data.some((dep) => dep.plant_name?.trim().toLowerCase() === nameToCheck);
  };

  useEffect(() => {
    getCompanies();
  }, []);

  useEffect(() => {
    if (selectedCompany) getPlants(selectedCompany);
    else setData([]);
  }, [selectedCompany]);

  return (
    <Stack direction={'column'} gap={2}>
      <AddForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setSelectedData(null);
          getPlants(selectedCompany);
        }}
        data={selectedData}
        addData={addPlant}
        editData={editPlant}
        isEdit={Boolean(selectedData)}
        getData={() => getPlants(selectedCompany)}
        selectedCompany={selectedCompany}
      />
      <Tools buttonClick={() => setFormOpen(true)}  selectedCompany={selectedCompany} />
      <Content
        data={data}
        updateData={() => getPlants(selectedCompany)}
        isExist={isExist}
        setSelectedData={setSelectedData}
        companies={companies}
        selectedCompany={selectedCompany}
        setSelectedCompany={setSelectedCompany}
      />
    </Stack>
  );
}
