import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import MDTypography from "components/MDTypography";
import {
  List,
  ListItem,
  ListItemText,
  TextField,
  IconButton,
  Snackbar,
  Tooltip,
  Autocomplete,
  Grid,
  Box,
} from "@mui/material";
import axiosInstance from "services/axiosInstance";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import MuiAlert from "@mui/material/Alert";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const ViewProductListDialog = ({ open, handleClose, reservation }) => {
  const [productList, setProductList] = useState(null);
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [newQuantity, setNewQuantity] = useState("");
  const [newProduct, setNewProduct] = useState(null);
  const [newProductQuantity, setNewProductQuantity] = useState("");
  const [addingNewProduct, setAddingNewProduct] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    if (reservation && reservation.id) {
      fetchProductList(reservation.id, reservation.type);
    }
    fetchProducts();
  }, [reservation]);

  const fetchProductList = async (id, type) => {
    try {
      const response = await axiosInstance.get(
        type === "wholesale"
          ? `http://localhost:8000/ws/get-wholesale-reservation-products/${id}`
          : `http://localhost:8000/mr/get-${type === "pharmacy" ? "" : `${type}-`}reservation/${id}`
      );
      setProductList(response.data);
    } catch (error) {
      console.error("Failed to fetch product list", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axiosInstance.get("http://localhost:8000/dd/get-products");
      setProducts(response.data);
    } catch (error) {
      console.error("Failed to fetch products", error);
    }
  };

  const handleEditClick = (item) => {
    setEditingProduct(item.id);
    setNewQuantity(item.quantity);
  };

  const handleSaveClick = async (item) => {
    try {
      await axiosInstance.put(`head/update-reservation-product/${item.id}?quantity=${newQuantity}`);
      fetchProductList(reservation.id, reservation.type); // Refresh the product list after update
      setEditingProduct(null); // Exit edit mode
      setSnackbar({ open: true, message: "Количество установлено", severity: "success" });
    } catch (error) {
      console.error("Failed to update product quantity", error);
      setSnackbar({ open: true, message: "Не удалось обновить количество", severity: "error" });
    }
  };

  const handleDeleteClick = async (item) => {
    try {
      await axiosInstance.delete(`head/delete-reservation-product/${item.id}`);
      fetchProductList(reservation.id, reservation.type); // Refresh the product list after deletion
      setSnackbar({ open: true, message: "Продукт удален", severity: "success" });
    } catch (error) {
      console.error("Failed to delete product", error);
      setSnackbar({ open: true, message: "Не удалось удалить продукт", severity: "error" });
    }
  };

  const handleAddProductClick = () => {
    setAddingNewProduct(true);
  };

  const handleAddProductSave = async () => {
    if (!newProduct || !newProductQuantity) {
      setSnackbar({ open: true, message: "Заполните все поля", severity: "error" });
      return;
    }

    try {
      const payload = {
        product_id: newProduct.id,
        quantity: newProductQuantity,
        reservation_id: reservation.id,
      };
      await axiosInstance.post("http://localhost:8000/head/add-reservation-product", payload);
      fetchProductList(reservation.id, reservation.type); // Refresh the product list after adding a product
      setAddingNewProduct(false); // Exit add new product mode
      setNewProduct(null); // Clear the product selection
      setNewProductQuantity(""); // Clear the quantity
      setSnackbar({ open: true, message: "Продукт добавлен", severity: "success" });
    } catch (error) {
      console.error("Failed to add product", error);
      setSnackbar({ open: true, message: "Не удалось добавить продукт", severity: "error" });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Список продуктов</DialogTitle>
      <DialogContent>
        {productList && (
          <div>
            <List>
              {productList.products.map((item, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={`${item.product.name}`}
                    secondary={
                      editingProduct === item.id ? (
                        <TextField
                          label="Количество"
                          type="number"
                          value={newQuantity}
                          onChange={(e) => {
                            const value = parseFloat(e.target.value);
                            if (value >= 0 || e.target.value === "") {
                              setNewQuantity(e.target.value);
                            }
                          }}
                          fullWidth // Make the input larger
                          style={{ marginTop: "10px" }} // Spacing to fit well with the layout
                        />
                      ) : (
                        `Количество: ${item.quantity}`
                      )
                    }
                  />
                  {editingProduct === item.id ? (
                    <>
                      <IconButton onClick={() => handleSaveClick(item)}>
                        <SaveIcon />
                      </IconButton>
                      <IconButton onClick={() => setEditingProduct(null)}>
                        <CloseIcon />
                      </IconButton>
                    </>
                  ) : (
                    <>
                      <Tooltip
                        title={
                          reservation.checked ? "Изменение невозможно, бронь подтверждена" : ""
                        }
                        arrow
                        disableHoverListener={!reservation.checked}
                      >
                        <span>
                          <IconButton
                            onClick={() => handleEditClick(item)}
                            disabled={reservation.checked}
                          >
                            <EditIcon />
                          </IconButton>
                        </span>
                      </Tooltip>
                      <Tooltip
                        title={reservation.checked ? "Удаление невозможно, бронь подтверждена" : ""}
                        arrow
                        disableHoverListener={!reservation.checked}
                      >
                        <span>
                          <IconButton
                            onClick={() => handleDeleteClick(item)}
                            style={{ color: "red" }}
                            disabled={reservation.checked}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </>
                  )}
                </ListItem>
              ))}

              {/* Plus Button to Add New Product */}
              {addingNewProduct ? (
                <ListItem>
                  <Grid container spacing={2}>
                    <Grid item xs={8}>
                      <Autocomplete
                        options={products}
                        getOptionLabel={(option) => option.name}
                        value={newProduct}
                        onChange={(e, value) => setNewProduct(value)}
                        renderInput={(params) => (
                          <TextField {...params} label="Продукт" fullWidth />
                        )}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <TextField
                        label="Количество"
                        type="number"
                        value={newProductQuantity}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value);
                          if (value >= 0 || e.target.value === "") {
                            setNewProductQuantity(e.target.value);
                          }
                        }}
                        fullWidth
                        // style={{ marginTop: "10px" }}
                      />
                    </Grid>
                  </Grid>
                  <IconButton onClick={handleAddProductSave}>
                    <SaveIcon />
                  </IconButton>
                  <IconButton onClick={() => setAddingNewProduct(false)}>
                    <CloseIcon />
                  </IconButton>
                </ListItem>
              ) : (
                <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
                  <IconButton onClick={handleAddProductClick}>
                    <AddIcon fontSize="large" />
                  </IconButton>
                </Box>
              )}
            </List>

            <MDTypography variant="body2">Скидка: {productList.discount}%</MDTypography>
            <MDTypography variant="body2">
              Сумма: {productList.total_amount.toLocaleString("ru-RU")} сум
            </MDTypography>
            <MDTypography variant="body2">
              Сумма с НДС: {productList.total_payable_with_nds.toLocaleString("ru-RU")} сум
            </MDTypography>
          </div>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Закрыть
        </Button>
      </DialogActions>

      {/* Snackbar for success and error messages */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Dialog>
  );
};

ViewProductListDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  reservation: PropTypes.object,
};

export default ViewProductListDialog;
