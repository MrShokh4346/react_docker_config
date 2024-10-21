import { Autocomplete, Grid, TextField, Typography } from "@mui/material";
import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardProfitTable from "./components/DashboardProfitComponents";
import { useEffect, useState } from "react";

const russianMonths = [
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

const DashboardProfit = () => {
  const [profitData, setProfitData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [medReps, setMedReps] = useState([]);
  const [selectedMedRep, setSelectedMedRep] = useState(null);

  console.log("====================================");
  console.log(filteredData);
  console.log("====================================");

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (profitData.length > 0) {
      const uniqueCompanies = [
        ...new Set(
          profitData.map((item) => item.reservation?.pharmacy?.company_name).filter(Boolean)
        ),
      ];
      setCompanies(uniqueCompanies.map((name) => ({ name })));

      const uniqueMedReps = [
        ...new Set(
          profitData.map((item) => item.reservation?.pharmacy?.med_rep?.full_name).filter(Boolean)
        ),
      ];
      setMedReps(uniqueMedReps.map((name) => ({ full_name: name })));
    }
  }, [profitData]);

  const fetchData = (monthNumber = "") => {
    const url = monthNumber
      ? `https://it-club.uz/head/get-postupleniya?month_number=${monthNumber}`
      : "https://it-club.uz/head/get-postupleniya";

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setProfitData(data);
        setFilteredData(data);
      })
      .catch((error) => console.error("Error fetching data:", error));
  };

  const handleMonthChange = (event, newValue) => {
    setSelectedMonth(newValue);
    if (newValue) {
      const monthNumber = russianMonths.indexOf(newValue) + 1;
      fetchData(monthNumber);
    } else {
      fetchData();
    }
    setSelectedCompany(null);
    setSelectedMedRep(null);
  };

  const handleCompanyChange = (event, newValue) => {
    setSelectedCompany(newValue);
    filterData(newValue, selectedMedRep);
  };

  const handleMedRepChange = (event, newValue) => {
    setSelectedMedRep(newValue);
    filterData(selectedCompany, newValue);
  };

  const filterData = (company, medRep) => {
    let filtered = profitData;

    if (company) {
      filtered = filtered.filter(
        (item) => item.reservation?.pharmacy?.company_name === company.name
      );
    }

    if (medRep) {
      filtered = filtered.filter(
        (item) => item.reservation?.pharmacy?.med_rep?.full_name === medRep.full_name
      );
    }

    setFilteredData(filtered);
  };

  return (
    <DashboardLayout>
      <MDBox py={3}>
        <Grid container spacing={2} mb={4} alignItems="center">
          <Grid item xs={3}>
            <Typography variant="h6" fontWeight="medium">
              Общая сумма поступлений:{" "}
              {filteredData.reduce((sum, item) => sum + item.amount, 0).toLocaleString("ru-RU")} сум
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <Autocomplete
              options={russianMonths}
              value={selectedMonth}
              onChange={handleMonthChange}
              renderInput={(params) => (
                <TextField {...params} label="Месяц" variant="outlined" size="small" />
              )}
              sx={{ minWidth: 200 }}
            />
          </Grid>
          <Grid item xs={3}>
            <Autocomplete
              options={companies}
              getOptionLabel={(option) => option.name}
              value={selectedCompany}
              onChange={handleCompanyChange}
              renderInput={(params) => (
                <TextField {...params} label="Компании" variant="outlined" size="small" />
              )}
              sx={{ minWidth: 200 }}
            />
          </Grid>
          <Grid item xs={3}>
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
          </Grid>
        </Grid>
        <DashboardProfitTable data={filteredData} />
      </MDBox>
    </DashboardLayout>
  );
};

export default DashboardProfit;
