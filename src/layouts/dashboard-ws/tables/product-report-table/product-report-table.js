import React, { useState } from "react";
import PropTypes from "prop-types";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DataTable from "examples/Tables/DataTable";
import useProductReportData from "./product-report-data";
import { Button, Snackbar, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axiosInstance from "services/axiosInstance";
import EditProductQuantityDialog from "layouts/dashboard-ws/dialogs/edit-product-quantity-dialog";

function WholesaleProductReportTable({ pharmacyName, products, pharmacy_id, wholesale_id }) {
  const navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const { columns, rows } = useProductReportData(products, setSelectedProduct, setDialogOpen);

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleQuantityUpdate = async (newQuantity) => {
    try {
      await axiosInstance.post(`http://localhost:8000/ws/return-product/${wholesale_id}`, {
        pharmacy_id,
        product_id: selectedProduct.product.id,
        amount: newQuantity,
      });
      setSnackbar({ open: true, message: "Количество обновлено успешно!", severity: "success" });
      // Optionally refresh data or update UI to reflect the changes
      handleDialogClose();
    } catch (error) {
      console.error("Failed to update product quantity", error);
      setSnackbar({
        open: true,
        message: error.response?.data?.detail || "Не удалось обновить количество.",
        severity: "error",
      });
    }
  };

  return (
    <Card>
      <MDBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
        <MDBox>
          <MDTypography variant="h6" gutterBottom>
            Аптека: &quot;{pharmacyName}&quot;
          </MDTypography>
        </MDBox>
        <MDBox>
          <Button
            variant="contained"
            color="success"
            sx={{ color: "white" }}
            onClick={() => {
              navigate("/ws/add-balance-in-stock", { state: { wholesale_id, pharmacy_id } });
            }}
          >
            Добавить баланс
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
      <EditProductQuantityDialog
        open={dialogOpen}
        handleClose={handleDialogClose}
        handleSubmit={handleQuantityUpdate}
        initialQuantity={selectedProduct?.quantity}
      />
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Card>
  );
}

WholesaleProductReportTable.propTypes = {
  pharmacyName: PropTypes.string.isRequired,
  products: PropTypes.array.isRequired,
  pharmacy_id: PropTypes.number,
  product_id: PropTypes.number.isRequired,
  wholesale_id: PropTypes.number.isRequired,
};

export default WholesaleProductReportTable;
