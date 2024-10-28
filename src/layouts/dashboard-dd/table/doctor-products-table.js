import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Box, Typography, CircularProgress } from "@mui/material";
import axios from "axios";
import DataTable from "examples/Tables/DataTable";

const AttachedProductsTable = ({ doctorId }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (doctorId) {
      setLoading(true);
      axios
        .get(`http://localhost:8000/mr/doctor-attached-products/${doctorId}`)
        .then((response) => {
          setProducts(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Failed to fetch attached products:", error);
          setLoading(false);
        });
    }
  }, [doctorId]);

  const columns = [
    { Header: "Название продукта", accessor: "product.name", align: "center" },
    { Header: "Категория", accessor: "product.category.name", align: "center" },
  ];

  const data = products.map((item) => ({
    ...item,
    "product.name": item.product.name,
    "product.category.name": item.product.category.name,
  }));

  return loading ? (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
      <CircularProgress />
    </Box>
  ) : products.length === 0 ? (
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

AttachedProductsTable.propTypes = {
  doctorId: PropTypes.number.isRequired,
};

export default AttachedProductsTable;
