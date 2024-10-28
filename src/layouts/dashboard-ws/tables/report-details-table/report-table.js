import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DataTable from "examples/Tables/DataTable";
import useWholesalePharmacyData from "./report-data";
import {
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Autocomplete,
  TextField,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axiosInstance from "services/axiosInstance";

const months = [
  { name: "Январь", value: 1 },
  { name: "Февраль", value: 2 },
  { name: "Март", value: 3 },
  { name: "Апрель", value: 4 },
  { name: "Май", value: 5 },
  { name: "Июнь", value: 6 },
  { name: "Июль", value: 7 },
  { name: "Август", value: 8 },
  { name: "Сентябрь", value: 9 },
  { name: "Октябрь", value: 10 },
  { name: "Ноябрь", value: 11 },
  { name: "Декабрь", value: 12 },
];

function WholesaleReportTable({ wsCompanyName, wsCompanyId }) {
  const navigate = useNavigate();
  const currentMonth = new Date().getMonth() + 1; // Get current month (1-12)
  const [month, setMonth] = useState(currentMonth);
  const [pharmacies, setPharmacies] = useState([]);
  const [regions, setRegions] = useState([]);
  const [medReps, setMedReps] = useState([]);
  const [selectedPharmacy, setSelectedPharmacy] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [selectedMedRep, setSelectedMedRep] = useState(null);
  const { columns, rows } = useWholesalePharmacyData(
    wsCompanyId,
    month,
    selectedPharmacy,
    selectedRegion,
    selectedMedRep
  );

  useEffect(() => {
    async function fetchData() {
      try {
        const pharmaciesResponse = await axiosInstance.get(
          "http://localhost:8000/mr/get-all-pharmacy"
        );
        setPharmacies(pharmaciesResponse.data);

        const regionsResponse = await axiosInstance.get("http://localhost:8000/common/get-regions");
        setRegions(regionsResponse.data);

        const medRepsResponse = await axiosInstance.get(
          "http://localhost:8000/common/get-medical-representatives"
        );
        setMedReps(medRepsResponse.data);
      } catch (error) {
        console.error("Failed to fetch data", error);
      }
    }

    fetchData();
  }, []);

  const handleMonthChange = (event) => {
    setMonth(event.target.value);
  };

  return (
    <Card>
      <MDBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
        <MDBox>
          <MDTypography variant="h6" gutterBottom>
            Оптовая компания: &quot;{wsCompanyName}&quot;
          </MDTypography>
        </MDBox>
        <MDBox display="flex" alignItems="center">
          <FormControl variant="outlined" sx={{ minWidth: 120, mr: 2 }}>
            <InputLabel id="month-select-label">Месяц</InputLabel>
            <Select
              labelId="month-select-label"
              value={month}
              onChange={handleMonthChange}
              label="Месяц"
              sx={{ height: 45 }}
            >
              {months.map((month) => (
                <MenuItem key={month.value} value={month.value}>
                  {month.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Autocomplete
            options={pharmacies}
            getOptionLabel={(option) => option.company_name}
            onChange={(event, newValue) => setSelectedPharmacy(newValue)}
            renderInput={(params) => (
              <TextField {...params} label="Аптека" variant="outlined" sx={{ mr: 2 }} />
            )}
            sx={{ minWidth: 150, mr: 2 }}
          />
          <Autocomplete
            options={regions}
            getOptionLabel={(option) => option.name}
            onChange={(event, newValue) => setSelectedRegion(newValue)}
            renderInput={(params) => (
              <TextField {...params} label="Регион" variant="outlined" sx={{ mr: 2 }} />
            )}
            sx={{ minWidth: 150, mr: 2 }}
          />
          <Autocomplete
            options={medReps}
            getOptionLabel={(option) => option.full_name}
            onChange={(event, newValue) => setSelectedMedRep(newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Медицинский представитель"
                variant="outlined"
                sx={{ mr: 2 }}
              />
            )}
            sx={{ minWidth: 200, mr: 2 }}
          />
          <Button
            variant="contained"
            color="success"
            sx={{ color: "white" }}
            onClick={() => {
              navigate("/ws/add-sale", { state: wsCompanyId });
            }}
          >
            Добавить продажу
          </Button>
        </MDBox>
      </MDBox>
      <MDBox>
        <DataTable
          table={{
            columns,
            rows,
          }}
          showTotalEntries={false}
          isSorted={false}
          noEndBorder
          entriesPerPage={false}
        />
      </MDBox>
    </Card>
  );
}

WholesaleReportTable.propTypes = {
  wsCompanyName: PropTypes.string.isRequired,
  wsCompanyId: PropTypes.number.isRequired,
};

export default WholesaleReportTable;
