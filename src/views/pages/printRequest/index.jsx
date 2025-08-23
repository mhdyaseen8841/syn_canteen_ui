import React, { useState, useEffect } from "react";
import {
  Box,
  Stack,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import StyledTable from "./StyledTable";
import { toast } from "react-toastify";
import { getCompanyCoupons } from "utils/Service";

export default function PrintRequest() {
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [tableData, setTableData] = useState([]);
  const tableHeader = ["Date", "Menu", "User Name", "Count", "Company", "Status", "Action"];

  // Fetch company coupons whenever company changes
  useEffect(() => {
    if (selectedCompany) {
      fetchCompanyCoupons(selectedCompany);
    }
    // eslint-disable-next-line
  }, [selectedCompany]);

  // Load companies from localStorage
  useEffect(() => {
    const companyData = localStorage.getItem("companies");
    if (companyData) {
      const parsed = JSON.parse(companyData);
      setCompanies(parsed);
      if (parsed.length === 1) {
        setSelectedCompany(parsed[0].company_id);
      }
    }
  }, []);

  // Fetch company coupons
  const fetchCompanyCoupons = async (companyId) => {
    try {
      const res = await getCompanyCoupons(companyId);
      setTableData(res.data || []);
    } catch (error) {
      toast.error(error?.message || "Failed to fetch company coupons");
      setTableData([]);
    }
  };


  const handlePrint = async (rowData) => {
  try {
    const printData = {
      report_type: "company",
      company: rowData.company_name,
      employee_name: rowData.employee_name,
      employee_id: rowData.employee_id,
      menu: rowData.menu_name,
      rate: rowData.fixed_menu_rate,
      transaction_id: 0,
      coupon_date: rowData.date
    };

    const response = await fetch(process.env.REACT_APP_PRINTURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(printData)
    });

    const result = await response.json();
    console.log("Print result:", result);

    if (result.success) {
      toast.success("Print request sent successfully!");
    } else {
      toast.error(result.message || "Failed to send print request");
    }
  } catch (error) {
    console.error("Print error:", error);
    toast.error("Error occurred while printing");
  }
};


  const disableCompanyDropdown = companies.length === 1;

  return (
    <Box sx={{ p: 3, maxWidth: 900, mx: "auto" }}>
      {/* Header */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h3" color="secondary.main">
          Company Coupons
        </Typography>
      </Stack>

      {/* Company Filter */}
      <Box sx={{ mb: 2, maxWidth: 300 }}>
        <FormControl fullWidth>
          <InputLabel>Company</InputLabel>
          <Select
            value={selectedCompany}
            label="Company"
            onChange={(e) => setSelectedCompany(e.target.value)}
            disabled={disableCompanyDropdown}
          >
            {companies.map((company) => (
              <MenuItem key={company.company_id} value={company.company_id}>
                {company.company_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Table */}
      <StyledTable
  data={tableData}
  header={tableHeader}
  isShowSerialNo={true}
  isShowAction={true}
  actions={['Print']}   // ✅ Added print button
  onActionChange={(action, row) => {
    if (action === "Print") {
      handlePrint(row);
    }
  }}
/>

    </Box>
  );
}
