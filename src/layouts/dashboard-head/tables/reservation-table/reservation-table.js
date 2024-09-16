import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DataTable from "examples/Tables/DataTable";
import { Autocomplete, Button, TextField } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  setFilters,
  setMedReps,
  setPharmacies,
  setHospitals,
  setWholesales,
} from "../../../../redux/reservation/reservationSlice";
import useReservationData from "./data/reservation-data";
import axiosInstance from "services/axiosInstance";
import { useNavigate } from "react-router-dom";
import OverallReservationValues from "layouts/dashboard-dd/elements/overall-reserve-values";
import userRoles from "constants/userRoles";
import SearchIcon from "@mui/icons-material/Search"; // Icon for the search button

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

  const { columns, rows, expired_debt, ExpiryDateDialogComponent, SnackbarComponent } =
    useReservationData();

  const [invoiceNumberInput, setInvoiceNumberInput] = useState(""); // Local state for input value

  useEffect(() => {
    fetchMedicalReps();
    fetchPharmacies();
    fetchHospitals();
    fetchWholesales();
  }, []);

  useEffect(() => {
    combineEntities();
  }, [hospitals, pharmacies, wholesales]);

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
      console.log(response.data);
      // Use reduce to remove duplicate pharmacies by name
      const uniquePharmacies = response.data.reduce((acc, currentPharmacy) => {
        const duplicate = acc.find(
          (pharmacy) => pharmacy.company_name === currentPharmacy.company_name
        );
        if (!duplicate) {
          acc.push(currentPharmacy);
        }
        return acc;
      }, []);

      // Dispatch the unique pharmacies to Redux
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
      ...hospitals.map((hospital) => ({
        ...hospital,
        type: "Больница",
      })),
      ...pharmacies.map((pharmacy) => ({
        ...pharmacy,
        type: "Аптека",
      })),
      ...wholesales.map((wholesale) => ({
        ...wholesale,
        type: "Оптовик",
      })),
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

  // Update local state for invoice number input
  const handleInvoiceNumberChange = (event) => {
    setInvoiceNumberInput(event.target.value); // Update the local state immediately
  };

  // Trigger filter dispatch when the user clicks the search button
  const handleSearchClick = () => {
    dispatch(setFilters({ invoiceNumber: invoiceNumberInput }));
  };

  return (
    <Card>
      <MDBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
        <MDTypography variant="h6" gutterBottom>
          Брони
        </MDTypography>
        <MDBox display="flex" alignItems="center" gap={2}>
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

          {/* Invoice Number Input and Search Button
          <MDBox display="flex" alignItems="center">
            <TextField
              label="Номер счета"
              type="number"
              value={invoiceNumberInput}
              onChange={handleInvoiceNumberChange}
              size="small"
              sx={{ minWidth: 150 }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSearchClick}
              sx={{ marginLeft: 1 }}
            >
              <SearchIcon />
            </Button>
          </MDBox> */}

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

      <OverallReservationValues overall={{ expired_debt, rows }} />
      <MDBox>
        <DataTable
          table={{ columns, rows }}
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
