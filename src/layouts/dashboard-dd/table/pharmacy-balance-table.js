import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Box, Typography, CircularProgress } from "@mui/material";
import axios from "axios";
import DataTable from "examples/Tables/DataTable";

const PharmacyBalanceInStockTable = ({ pharmacyId }) => {
  const [balanceInStock, setBalanceInStock] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log(pharmacyId);
    if (pharmacyId) {
      setLoading(true);
      axios
        .get(`http://localhost:8000/mr/get-balnce-in-stock/${pharmacyId}`)
        .then((response) => {
          setBalanceInStock(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Failed to fetch balance in stock:", error);
          setLoading(false);
        });
    }
  }, [pharmacyId]);

  const columns = [
    { Header: "Название продукта", accessor: "product.name", align: "center" },
    { Header: "Сумма", accessor: "amount", align: "center" },
  ];

  const data = balanceInStock.map((item) => ({
    ...item,
    "product.name": item.product.name,
    amount: item.amount,
  }));

  return loading ? (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
      <CircularProgress />
    </Box>
  ) : balanceInStock.length === 0 ? (
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

PharmacyBalanceInStockTable.propTypes = {
  pharmacyId: PropTypes.number.isRequired,
};

export default PharmacyBalanceInStockTable;
