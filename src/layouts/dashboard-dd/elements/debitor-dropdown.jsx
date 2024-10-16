import React, { useState, useEffect } from "react";
import { MenuItem, Select, FormControl, Box } from "@mui/material";
import PropTypes from "prop-types";

const DebitorDropdown = ({ filteredRows }) => {
  const [selectedValues, setSelectedValues] = useState({});
  const [totalDebitor, setTotalDebitor] = useState(0);

  useEffect(() => {
    const calculateDebt = () => {
      if (!filteredRows || filteredRows.length === 0) return;

      // Calculate total debt per manufactured company based on filteredRows
      const companyDebts = filteredRows.reduce((acc, item) => {
        const company =
          item.pharmacy?.manufactured_company ||
          item.hospital?.manufactured_company ||
          item.wholesale?.manufactured_company;

        const debt = parseFloat((item.debtValue ? item.debtValue : item.debt) || 0);

        if (company && item.checked) {
          // Assuming "Проверено" means checked
          if (!acc[company]) {
            acc[company] = 0;
          }
          acc[company] += debt;
        }
        return acc;
      }, {});

      setSelectedValues(companyDebts);

      // Calculate the total debt
      const totalDebt = Object.values(companyDebts || {}).reduce((acc, value) => acc + value, 0);
      setTotalDebitor(totalDebt);
    };

    calculateDebt();
  }, [filteredRows]);

  return (
    <Box sx={{ position: "relative", display: "inline-block" }}>
      <FormControl fullWidth>
        <Select
          value={`ДЕБИТОР: ${totalDebitor.toLocaleString("ru-RU")} сум`}
          displayEmpty
          sx={{
            bgcolor: "#f77c48",
            height: "35px",
            "& .MuiSelect-select": {
              padding: "8px 16px",
              display: "flex",
              alignItems: "center",
              fontWeight: "medium",
              color: "black",
              height: "100%",
              textTransform: "uppercase",
            },
            "& .MuiOutlinedInput-notchedOutline": {
              border: "none",
            },
          }}
        >
          <MenuItem value={`ДЕБИТОР: ${totalDebitor.toLocaleString("ru-RU")} сум`} disabled>
            ДЕБИТОР: {totalDebitor.toLocaleString("ru-RU")} сум
          </MenuItem>
          {Object.entries(selectedValues).map(([company, debt]) => (
            <MenuItem key={company} value={company}>
              {company}: {debt.toLocaleString("ru-RU")} сум
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

DebitorDropdown.propTypes = {
  filteredRows: PropTypes.array.isRequired,
};

export default DebitorDropdown;
