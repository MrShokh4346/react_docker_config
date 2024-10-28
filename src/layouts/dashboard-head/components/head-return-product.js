/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";

// @mui material components
import Card from "@mui/material/Card";
import Alert from "@mui/material/Alert";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Authentication layout components
import BasicLayout from "layouts/authentication/components/BasicLayout";

function HeadReturnProduct() {
  const location = useLocation();
  const navigate = useNavigate();
  const { accessToken } = useSelector((state) => state.auth);
  const { reservationId, reservationType } = location.state;
  const [products, setProducts] = useState([]);
  const [productNames, setProductNames] = useState({});
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState("");
  const [message, setMessage] = useState({ color: "", content: "" });
  const [price, setPrice] = useState(0); // State for product price
  const [availableQuantity, setAvailableQuantity] = useState(0); // State for available quantity
  const [totalAmount, setTotalAmount] = useState(0); // State for total amount

  useEffect(() => {
    // Fetch all products to map product_id to product name
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:8000/common/get-product", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const productsData = response.data;
        const productNamesMap = productsData.reduce((acc, product) => {
          acc[product.id] = product.name;
          return acc;
        }, {});
        setProductNames(productNamesMap);
      } catch (error) {
        console.error("Ошибка при получении продуктов:", error);
      }
    };

    fetchProducts();
  }, [accessToken]);

  useEffect(() => {
    // Fetch reservation unpaid products based on reservation type
    const fetchReservationProducts = async () => {
      try {
        const url =
          reservationType === "pharmacy"
            ? `http://localhost:8000/head/get-pharmacy-reservation-payed-remiainder/${reservationId}`
            : `http://localhost:8000/head/get-wholesale-reservation-payed-remiainder/${reservationId}`;

        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const reservationProducts = response.data.reservation_unpayed_products.map((product) => ({
          ...product,
          name: productNames[product.product_id] || "Неизвестный продукт",
        }));

        setProducts(reservationProducts);
      } catch (error) {
        console.error("Ошибка при получении продуктов по бронированию:", error);
      }
    };

    if (reservationId && reservationType) {
      fetchReservationProducts();
    }
  }, [reservationId, reservationType, productNames, accessToken]);

  const handleProductChange = (event, newValue) => {
    setSelectedProduct(newValue);
    setPrice(newValue ? newValue.price : 0); // Set price of selected product
    setAvailableQuantity(newValue ? newValue.quantity : 0); // Set available quantity
    setTotalAmount(0); // Reset total amount when changing product
    setQuantity(""); // Reset quantity when changing product
    setMessage({ color: "", content: "" }); // Clear any previous error messages
  };

  const handleQuantityChange = (event) => {
    const value = event.target.value;
    setQuantity(value);

    if (selectedProduct) {
      if (value > selectedProduct.quantity) {
        setMessage({
          color: "error",
          content: "Количество не может превышать доступное количество.",
        });
        setTotalAmount(0); // Reset total amount if error
      } else {
        setMessage({ color: "", content: "" }); // Clear error message
        const calculatedTotal = value * selectedProduct.price; // Calculate total amount
        setTotalAmount(calculatedTotal);
      }
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedProduct || !quantity) {
      setMessage({ color: "error", content: "Пожалуйста, выберите продукт и укажите количество." });
      return;
    }

    if (quantity > selectedProduct.quantity) {
      setMessage({
        color: "error",
        content: "Количество не может превышать доступное количество.",
      });
      return;
    }

    try {
      await axios.post(
        `http://localhost:8000/head/return-product/${reservationId}?product_id=${selectedProduct.product_id}&quantity=${quantity}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      setMessage({ color: "success", content: "Продукт успешно возвращен!" });

      // Optional: Redirect or other actions after a successful submission
      setTimeout(() => {
        navigate(-1);
        setMessage({ color: "", content: "" });
      }, 500);
    } catch (error) {
      console.error("Ошибка при возврате продукта:", error);
      setMessage({
        color: "error",
        content:
          "Не удалось возвратить товар. " +
          (error.response?.data?.detail ||
            "Проверьте правильность введенных данных и попробуйте снова."),
      });
    }
  };

  return (
    <BasicLayout>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="info"
          mx={2}
          mt={-3}
          p={2}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Возврат продукта
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          {message.content && <Alert severity={message.color}>{message.content}</Alert>}
          <MDBox component="form" role="form" onSubmit={handleSubmit}>
            <MDBox mb={2}>
              <Autocomplete
                options={products}
                getOptionLabel={(option) => option.name}
                onChange={handleProductChange}
                renderInput={(params) => (
                  <TextField {...params} label="Выберите продукт" variant="outlined" fullWidth />
                )}
              />
            </MDBox>

            <MDBox mb={2}>
              <MDTypography variant="h6">
                Цена: {price.toLocaleString("ru-RU") || 0} сум
              </MDTypography>
            </MDBox>

            {selectedProduct && (
              <MDBox mb={2}>
                <MDTypography variant="h6">Доступное количество: {availableQuantity}</MDTypography>
              </MDBox>
            )}

            <MDBox mb={2}>
              <TextField
                label="Количество"
                type="number"
                variant="outlined"
                value={quantity}
                onChange={handleQuantityChange}
                fullWidth
              />
            </MDBox>

            <MDBox mb={2}>
              <MDTypography variant="h6">
                Сумма: {totalAmount.toLocaleString("ru-RU") || 0} сум
              </MDTypography>
            </MDBox>

            <MDBox mt={4} mb={1} display="flex" justifyContent="space-between">
              <MDButton
                variant="contained"
                color="secondary"
                fullWidth
                onClick={() => navigate(-1)} // Navigate back to the previous page
                style={{ marginRight: "10px" }} // Add spacing between the buttons
              >
                Назад
              </MDButton>
              <MDButton
                variant="gradient"
                color="info"
                fullWidth
                type="submit"
                disabled={
                  !selectedProduct || !quantity || message.color === "error" // Disable button if there's an error message or required fields are empty
                }
              >
                Вернуть продукт
              </MDButton>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </BasicLayout>
  );
}

export default HeadReturnProduct;
