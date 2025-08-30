import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Typography,
  TextField
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import Content from "./content";
import Tools from "./tools";
import {
  searchEmployee as searchContractor,
  getContractorDashboard
} from "../../../utils/Service";
import { toast } from "react-toastify";
import dayjs from "dayjs";

export default function ContractorReport() {
  const [formOpen, setFormOpen] = useState(false);
  const [data, setData] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [contractorOptions, setContractorOptions] = useState([]);
  const [selectedContractor, setSelectedContractor] = useState("");
  const [loadingContractors, setLoadingContractors] = useState(false);
  const [role, setRole] = useState(localStorage.getItem("role") || "");
  const [currentContractor, setCurrentContractor] = useState(null);
  const debounceRef = useRef();
  const [selectedContractorDetails, setSelectedContractorDetails] = useState(null);

  // 🔹 Default dates → Current month start & end
  const [fromDate, setFromDate] = useState(dayjs().startOf("month").format("YYYY-MM-DD"));
  const [toDate, setToDate] = useState(dayjs().endOf("month").format("YYYY-MM-DD"));

  useEffect(() => {
    const contractorObj = contractorOptions.find(
      (con) => con.employee_id === Number(selectedContractor)
    );
    setSelectedContractorDetails(contractorObj || currentContractor);
  }, [contractorOptions, selectedContractor, currentContractor]);

  const getCompanies = async () => {
    try {
      const companyData = localStorage.getItem("companies");
      if (companyData) {
        const parsed = JSON.parse(companyData);
        setCompanies(parsed);

        if (parsed.length >= 1) {
          setSelectedCompany(parsed[0].company_id);
        }

        if (role === "contractor") {
          const contractorData = JSON.parse(localStorage.getItem("user"));
          setSelectedContractor(contractorData.employee_id);
          setCurrentContractor(contractorData);
        }
      }
    } catch (err) {
      toast.error("Error fetching companies");
    }
  };

  const getData = async () => {
    try {
      const start = dayjs(fromDate);
      const end = dayjs(toDate);

      // ✅ Validate date range → Max 5 months
      if (end.diff(start, "month", true) > 5) {
        toast.error("You cannot select more than 5 months");
        return;
      }

      const res = await getContractorDashboard({
        fromDate,
        toDate,
        contractorId: selectedContractor // ✅ Changed key name
      });

      setData(res);
    } catch (err) {
      console.log(err);
      toast.error("Error fetching report");
    }
  };

  const handleContractorSearch = async (searchTerm = "") => {
    if (!selectedCompany) return;
    setLoadingContractors(true);
    try {
      const response = await searchContractor({
        company_id: selectedCompany,
        search_text: searchTerm
      });
      setContractorOptions(response || []);
    } catch (error) {
      toast.error("Error loading contractors");
      setContractorOptions([]);
    } finally {
      setLoadingContractors(false);
    }
  };

  useEffect(() => {
    getCompanies();
  }, []);

  const disableCompanyDropdown = companies.length === 1;
  const disableContractorDropdown = role === "contractor";

  const shouldEnableFetch =
    fromDate &&
    toDate &&
    ((role === "contractor" && selectedContractor) ||
      ((role === "admin" || role === "manager") &&
        selectedContractor &&
        selectedCompany));

  return (
    <Stack direction="column" gap={2}>
      <Typography variant="h3" color="secondary.main">
        Contractor Report
      </Typography>

      <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
        {/* 🔹 From Date */}
        <TextField
          label="From Date"
          type="date"
          value={fromDate}
          onChange={(e) => {
            const value = e.target.value;
            setFromDate(value);

            // Auto-correct if exceeds 5 months
            const start = dayjs(value);
            const end = dayjs(toDate);
            if (end.diff(start, "month", true) > 5) {
              const newToDate = start.add(5, "month").endOf("month").format("YYYY-MM-DD");
              setToDate(newToDate);
              toast.info("To Date adjusted to max 5 months limit");
            }
          }}
          InputLabelProps={{ shrink: true }}
          fullWidth
        />

        {/* 🔹 To Date */}
        <TextField
          label="To Date"
          type="date"
          value={toDate}
          onChange={(e) => {
            const value = e.target.value;
            setToDate(value);

            // Auto-correct if exceeds 5 months
            const start = dayjs(fromDate);
            const end = dayjs(value);
            if (end.diff(start, "month", true) > 5) {
              const newFromDate = end.subtract(5, "month").startOf("month").format("YYYY-MM-DD");
              setFromDate(newFromDate);
              toast.info("From Date adjusted to max 5 months limit");
            }
          }}
          InputLabelProps={{ shrink: true }}
          fullWidth
        />

        {/* Company Dropdown */}
        {(role === "admin" || role === "manager") && (
          <FormControl fullWidth disabled={disableCompanyDropdown}>
            <InputLabel>Select Company</InputLabel>
            <Select
              value={selectedCompany}
              onChange={(e) => {
                setSelectedCompany(e.target.value);
                setSelectedContractor("");
                setContractorOptions([]);
              }}
            >
              <MenuItem value="">
                <em>Select a Company</em>
              </MenuItem>
              {companies.map((company) => (
                <MenuItem key={company.company_id} value={company.company_id}>
                  {company.company_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {/* Contractor Dropdown */}
        {(role === "admin" || role === "manager") && selectedCompany && (
          <FormControl fullWidth>
            <Autocomplete
              options={contractorOptions}
              loading={loadingContractors}
              getOptionLabel={(option) =>
                option?.employee_code && option?.employee_name
                  ? `${option.employee_code} - ${option.employee_name}`
                  : ""
              }
              value={
                contractorOptions.find(
                  (con) => con.employee_id === Number(selectedContractor)
                ) || null
              }
              onChange={(_, newValue) => {
                setSelectedContractor(newValue ? newValue.employee_id : "");
              }}
              onInputChange={(_, newInputValue, reason) => {
                if (debounceRef.current) clearTimeout(debounceRef.current);
                if (newInputValue.length > 0 && reason === "input") {
                  debounceRef.current = setTimeout(() => {
                    handleContractorSearch(newInputValue);
                  }, 400);
                }
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Contractor (ID or Name)"
                  placeholder="Search by ID or Name..."
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {loadingContractors ? (
                          <Box sx={{ pr: 2 }}>
                            <span>Loading...</span>
                          </Box>
                        ) : null}
                        {params.InputProps.endAdornment}
                      </>
                    )
                  }}
                />
              )}
              isOptionEqualToValue={(option, value) =>
                option?.employee_id === value?.employee_id
              }
              noOptionsText={
                !selectedCompany
                  ? "Please select a company first"
                  : loadingContractors
                  ? "Searching contractors..."
                  : "No contractors found"
              }
            />
          </FormControl>
        )}
      </Stack>

      <Box mt={2} display="flex" justifyContent="space-between" alignItems="center">
        {role === "contractor" && currentContractor ? (
          <Typography variant="body2" color="textSecondary">
            Viewing report for: {currentContractor?.employee_id} -{" "}
            {currentContractor?.display_name}
          </Typography>
        ) : (
          <Box />
        )}
        <button
          disabled={!shouldEnableFetch}
          onClick={getData}
          style={{
            padding: "8px 16px",
            backgroundColor: shouldEnableFetch ? "#1976d2" : "#ccc",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: shouldEnableFetch ? "pointer" : "not-allowed"
          }}
        >
          Fetch Report
        </button>
      </Box>

      {/* Content */}
      <Content
        data={data}
        updateData={getData}
        selectedCalender={`${fromDate} to ${toDate}`}
        role={role}
        contractorMeta={{
          month: `${dayjs(fromDate).format("MMM YYYY")} - ${dayjs(toDate).format("MMM YYYY")}`,
          companyName:
            companies.find((c) => c.company_id === selectedCompany)?.company_name || "",
          contractorName: selectedContractorDetails?.employee_name || "",
          contractorCode: selectedContractorDetails?.employee_code || ""
        }}
      />
    </Stack>
  );
}
