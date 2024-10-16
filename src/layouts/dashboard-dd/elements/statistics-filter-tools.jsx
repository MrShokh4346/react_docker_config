import { useState } from "react";
import { TextField } from "@mui/material";
import MDBox from "components/MDBox";

const StatisticsFilterTools = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
    setEndDate(null); // Reset end date when start date changes
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
  };

  return (
    <MDBox sx={{ display: "flex", justifyContent: "end" }}>
      <TextField
        label="Начальная дата"
        type="date"
        value={startDate}
        onChange={handleStartDateChange}
        sx={{ mr: 2 }}
        InputLabelProps={{
          shrink: true,
        }}
      />
      <TextField
        label="Конечная дата"
        type="date"
        value={endDate}
        onChange={handleEndDateChange}
        sx={{ mr: 2 }}
        InputLabelProps={{
          shrink: true,
        }}
        inputProps={{
          min: startDate,
        }}
        disabled={!startDate} // Disable until start date is selected
      />
    </MDBox>
  );
};

export default StatisticsFilterTools;
