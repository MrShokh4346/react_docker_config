import React from "react";
import { useSelector } from "react-redux";
import { Grid, Box, Typography } from "@mui/material";
import DebitorDropdown from "./debitor-dropdown";
import ProfitDropdown from "./profit-dropdown";
import PromoDropdown from "./promo-dropdown";
import UncheckedDebitorDropdown from "./unchecked-debitor-dropdown";
import ExpiredDebitorDropdown from "./expired-debitor-dropdown";
import { selectFilteredReservations } from "../../../redux/reservation/reservationSlice"; // Import the selector
import PropTypes from "prop-types";

const OverallReservationValues = ({ checked }) => {
  // Get filtered rows from the Redux store
  const filteredRows = useSelector(selectFilteredReservations);

  // Calculate number of invoices and total invoice amount
  const numberOfInvoices = filteredRows.filter((row) => row.checked === checked).length;
  const invoiceAmount = filteredRows.reduce(
    (sum, row) => sum + (row?.checked === checked ? row.total_payable_with_nds || 0 : 0),
    0
  );

  return (
    <Box
      p={2}
      sx={{
        overflowX: "auto",
        bgcolor: "#dff2f2",
        "&::-webkit-scrollbar": {
          height: "5px",
        },
        "&::-webkit-scrollbar-track": {
          bgcolor: "#f1f1f1",
        },
        "&::-webkit-scrollbar-thumb": {
          bgcolor: "#888",
          borderRadius: "4px",
        },
        "&::-webkit-scrollbar-thumb:hover": {
          bgcolor: "#555",
        },
      }}
    >
      <Grid container spacing={4} wrap="nowrap" sx={{ whiteSpace: "nowrap" }}>
        <Grid item>
          <Typography variant="button" fontWeight="medium">
            Кол-во с/ф: {numberOfInvoices}
          </Typography>
        </Grid>
        <Grid item>
          <Typography variant="button" fontWeight="medium">
            Обшая сумма реализации: {invoiceAmount?.toLocaleString("ru-RU")}{" "}
            <span style={{ textTransform: "lowercase" }}>сум</span>
          </Typography>
        </Grid>
        <Grid item>
          <ProfitDropdown filteredRows={filteredRows} />
        </Grid>
        <Grid item>
          <DebitorDropdown filteredRows={filteredRows} />
        </Grid>
        <Grid item>
          <PromoDropdown filteredRows={filteredRows} />
        </Grid>
        <Grid item>
          <UncheckedDebitorDropdown filteredRows={filteredRows} />
        </Grid>
        <Grid item>
          <ExpiredDebitorDropdown filteredRows={filteredRows} />
        </Grid>
      </Grid>
    </Box>
  );
};

OverallReservationValues.propTypes = {
  checked: PropTypes.bool,
};

export default OverallReservationValues;
