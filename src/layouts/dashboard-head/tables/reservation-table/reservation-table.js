import React, { memo, useEffect, useState, useMemo } from "react";
import Card from "@mui/material/Card";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DataTable from "examples/Tables/DataTable";
import {
  Autocomplete,
  Button,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  setFilters,
  setMedReps,
  setPharmacies,
  setHospitals,
  setWholesales,
} from "../../../../redux/reservation/reservationSlice";
import useReservationData from "./data/reservation-data"; // Custom hook for fetching data
import axiosInstance from "services/axiosInstance";
import { useNavigate } from "react-router-dom";
import OverallReservationValues from "layouts/dashboard-dd/elements/overall-reserve-values";
import userRoles from "constants/userRoles";
import MDInput from "components/MDInput";

// Memoized DataTable component
const MemoizedDataTable = memo(DataTable);

const monthNames = [
  "Январь",
  "Февраль",
  "Март",
  "Апрель",
  "Май",
  "Июнь",
  "Июль",
  "Август",
  "Сентябрь",
  "Октябрь",
  "Ноябрь",
  "Декабрь",
];

const entityTypes = [
  { label: "Все", value: "all" },
  { label: "Аптеки", value: "pharmacy" },
  { label: "Больницы", value: "hospital" },
  { label: "Оптовики", value: "wholesale" },
];

function ReservationTable() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { filters, medReps, pharmacies, hospitals, wholesales } = useSelector(
    (state) => state.reservation
  );
  const [combinedEntities, setCombinedEntities] = useState([]);
  const { selectedMonth, selectedMedRep, selectedEntity, selectedType } = filters;
  const { accessToken, userRole } = useSelector((state) => state.auth);
  const [selectedDocumentType, setSelectedDocumentType] = useState("bron");

  // Call useReservationData at the top level of the component
  const { columns, rows, expired_debt, ExpiryDateDialogComponent, SnackbarComponent } =
    useReservationData();

  const [invoiceNumberInput, setInvoiceNumberInput] = useState(""); // Local state for input value

  // Memoize the columns and rows (or any other data) to avoid unnecessary re-renders
  const memoizedColumns = useMemo(() => columns, [columns]);
  const memoizedRows = useMemo(() => rows, [rows]);

  useEffect(() => {
    fetchMedicalReps();
    fetchPharmacies();
    fetchHospitals();
    fetchWholesales();
  }, []);

  useEffect(() => {
    combineEntities();
  }, [hospitals, pharmacies, wholesales]);

  const handleDocumentTypeChange = (event) => {
    setSelectedDocumentType(event.target.value);
    dispatch(setFilters({ selectedDocumentType: event.target.value }));
  };

  const fetchMedicalReps = async () => {
    try {
      const response = await axiosInstance.get("common/get-med-reps", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      dispatch(setMedReps(response.data));
    } catch (error) {
      console.error("Failed to fetch medical representatives", error);
    }
  };

  const fetchPharmacies = async () => {
    try {
      const response = await axiosInstance.get("mr/get-all-pharmacy", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const uniquePharmacies = response.data.reduce((acc, currentPharmacy) => {
        const duplicate = acc.find(
          (pharmacy) => pharmacy.company_name === currentPharmacy.company_name
        );
        if (!duplicate) acc.push(currentPharmacy);
        return acc;
      }, []);
      dispatch(setPharmacies(uniquePharmacies));
    } catch (error) {
      console.error("Failed to fetch pharmacies", error);
    }
  };

  const fetchHospitals = async () => {
    try {
      const response = await axiosInstance.get(`mr/get-hospitals`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      dispatch(setHospitals(response.data));
    } catch (error) {
      console.error("Failed to fetch hospitals", error);
    }
  };

  const fetchWholesales = async () => {
    try {
      const response = await axiosInstance.get(`ws/get-wholesales`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      dispatch(setWholesales(response.data));
    } catch (error) {
      console.error("Failed to fetch wholesales", error);
    }
  };

  const combineEntities = () => {
    const combined = [
      ...hospitals.map((hospital) => ({ ...hospital, type: "Больница" })),
      ...pharmacies.map((pharmacy) => ({ ...pharmacy, type: "Аптека" })),
      ...wholesales.map((wholesale) => ({ ...wholesale, type: "Оптовик" })),
    ];
    setCombinedEntities(combined);
  };

  const handleMonthChange = (event) => {
    dispatch(setFilters({ selectedMonth: event.target.value }));
  };

  const handleMedRepChange = (event, newValue) => {
    dispatch(setFilters({ selectedMedRep: newValue }));
  };

  const handleEntityChange = (event, newValue) => {
    dispatch(setFilters({ selectedEntity: newValue }));
  };

  const handleTypeChange = (event) => {
    dispatch(setFilters({ selectedType: event.target.value }));
  };

  // Immediate state update on input change without affecting the table
  const handleInvoiceInputChange = (event) => {
    setInvoiceNumberInput(event.target.value);
  };

  // Manual search dispatch (does not affect the table until search is clicked)
  const handleSearchClick = () => {
    dispatch(setFilters({ invoiceNumber: invoiceNumberInput }));
  };

  return (
    <Card>
      <MDBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
        {/* Custom Dropdown without a label */}
        <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
          <Select
            value={selectedDocumentType}
            onChange={handleDocumentTypeChange}
            displayEmpty
            sx={{
              height: "40px", // Adjust the height for a sleek look
              backgroundColor: "#f0f0f0", // Custom background color to stand out
              borderRadius: "8px", // Rounded corners
              "& .MuiSelect-select": {
                padding: "8px 12px", // Custom padding for better appearance
                fontSize: "16px", // Slightly larger font for better readability
              },
            }}
          >
            <MenuItem value="bron">Брони</MenuItem>
            <MenuItem value="faktura">Фактура</MenuItem>
          </Select>
        </FormControl>

        {/* Wrapper for horizontal scrolling with custom scrollbar */}
        <MDBox
          display="flex"
          alignItems="center"
          gap={2}
          p={2}
          sx={{
            overflowX: "auto", // Enables horizontal scrolling
            whiteSpace: "nowrap", // Prevents wrapping of items
            "&::-webkit-scrollbar": {
              height: "5px", // Small height for horizontal scrollbar
            },
            "&::-webkit-scrollbar-track": {
              bgcolor: "#f1f1f1", // Track color
            },
            "&::-webkit-scrollbar-thumb": {
              bgcolor: "#888", // Thumb color
              borderRadius: "4px", // Rounded edges for thumb
            },
            "&::-webkit-scrollbar-thumb:hover": {
              bgcolor: "#555", // Darker color on hover
            },
          }}
        >
          {/* Month Selector */}
          <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Месяц</InputLabel>
            <Select
              value={selectedMonth}
              onChange={handleMonthChange}
              sx={{ height: "35px" }}
              label="Месяц"
            >
              {monthNames.map((month, index) => (
                <MenuItem key={index} value={index + 1}>
                  {month}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* MedRep Selector */}
          <Autocomplete
            options={medReps}
            getOptionLabel={(option) => option.full_name}
            value={selectedMedRep}
            onChange={handleMedRepChange}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Медицинские представители"
                variant="outlined"
                size="small"
              />
            )}
            sx={{ minWidth: 200 }}
          />

          {/* Entity Selector */}
          <Autocomplete
            options={combinedEntities}
            getOptionLabel={(option) =>
              `${option.type === "Оптовик" ? option.name : option.company_name} (${option.type})`
            }
            value={selectedEntity}
            onChange={handleEntityChange}
            renderInput={(params) => (
              <TextField {...params} label="Выберите компанию" variant="outlined" size="small" />
            )}
            sx={{ minWidth: 200 }}
          />

          {/* Entity Type Selector */}
          <FormControl variant="outlined" size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Тип</InputLabel>
            <Select
              value={selectedType}
              onChange={handleTypeChange}
              sx={{ height: "35px" }}
              label="Тип"
            >
              {entityTypes.map((type) => (
                <MenuItem key={type.value} value={type.value}>
                  {type.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Input field */}
          <MDInput
            type="text"
            label="Номер счета"
            fullWidth
            size="small"
            sx={{ minWidth: 100 }}
            value={invoiceNumberInput}
            onChange={handleInvoiceInputChange}
          />

          {/* Small button for manual dispatch */}
          <Button
            variant="contained"
            color="success"
            sx={{ color: "white" }}
            onClick={handleSearchClick}
            disabled={invoiceNumberInput === ""}
          >
            Поиск
          </Button>

          {/* Create Reservation Button */}
          {userRole === userRoles.HEAD_OF_ORDERS && (
            <Button
              variant="contained"
              color="success"
              sx={{ color: "white", minWidth: 100 }}
              onClick={() => {
                navigate("/head/add-reservation");
              }}
            >
              Создать бронь
            </Button>
          )}
        </MDBox>
      </MDBox>

      <OverallReservationValues overall={{ expired_debt, rows: memoizedRows }} />
      <MDBox>
        <MemoizedDataTable
          table={{ columns: memoizedColumns, rows: memoizedRows }}
          showTotalEntries={false}
          isSorted={false}
          noEndBorder
          entriesPerPage={{ defaultValue: 100 }}
        />
      </MDBox>

      {ExpiryDateDialogComponent}
      {SnackbarComponent}
    </Card>
  );
}

export default ReservationTable;
