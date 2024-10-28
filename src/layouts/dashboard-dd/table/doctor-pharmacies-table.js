import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Box, Typography, CircularProgress } from "@mui/material";
import axios from "axios";
import DataTable from "examples/Tables/DataTable";

const AttachedPharmaciesTable = ({ doctorId }) => {
  const [pharmacies, setPharmacies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (doctorId) {
      setLoading(true);
      axios
        .get(`http://localhost:8000/mr/get-doctor-pharmacies-list/${doctorId}`)
        .then((response) => {
          setPharmacies(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Failed to fetch attached pharmacies:", error);
          setLoading(false);
        });
    }
  }, [doctorId]);

  const columns = [
    { Header: "Название компании", accessor: "company_name", align: "center" },
    { Header: "Бренд", accessor: "brand_name", align: "center" },
  ];

  const data = pharmacies.map((pharmacy) => ({
    ...pharmacy,
  }));

  return loading ? (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
      <CircularProgress />
    </Box>
  ) : pharmacies.length === 0 ? (
    <Typography variant="body1">Лист пуст</Typography>
  ) : (
    <DataTable
      table={{ columns, rows: data }}
      isSorted={false}
      entriesPerPage={false}
      showTotalEntries={false}
      noEndBorder
    />
  );
};

AttachedPharmaciesTable.propTypes = {
  doctorId: PropTypes.number.isRequired,
};

export default AttachedPharmaciesTable;
