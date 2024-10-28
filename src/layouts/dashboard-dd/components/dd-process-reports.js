import React, { useState } from "react";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import { FormControl, InputLabel, MenuItem, Select, Button, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import axios from "axios";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";

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

function DeputyDirectorProcessReport() {
  const currentMonth = new Date().getMonth() + 1; // Get current month (1-12)
  const [month, setMonth] = useState(currentMonth);
  const accessToken = useSelector((state) => state.auth.accessToken);

  const handleMonthChange = (event) => {
    setMonth(event.target.value);
  };

  const downloadReport = async () => {
    const monthName = months.find((m) => m.value === month).name;
    try {
      const response = await axios.get(
        `http://localhost:8000/dd/get-proccess-report-ecxel?month=${month}`,
        {
          responseType: "blob",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const filename = `report_${monthName}.xlsx`;

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error("Download error", error);
    }
  };

  return (
    <DashboardLayout>
      <Card>
        <MDBox
          display="flex"
          flexDirection="column"
          justifyContent="flex-start"
          alignItems="flex-start"
          p={6}
          width="100%"
          gap="20px"
        >
          <Typography variant="h1" component="h1">
            Отчеты
          </Typography>
          <MDBox display="flex" gap="20px" alignItems="center">
            <FormControl variant="outlined" sx={{ minWidth: 200 }}>
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
            <Button
              variant="contained"
              color="success"
              sx={{ color: "white" }}
              onClick={downloadReport}
            >
              Получить отчет на {months.find((m) => m.value === month).name}
            </Button>
          </MDBox>
        </MDBox>
      </Card>
    </DashboardLayout>
  );
}

export default DeputyDirectorProcessReport;
