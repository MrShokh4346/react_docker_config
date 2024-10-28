import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

// @mui material components
import Card from "@mui/material/Card";
import Alert from "@mui/material/Alert";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import Switch from "@mui/material/Switch";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Authentication layout components
import axiosInstance from "services/axiosInstance";
import BasicLayout from "layouts/authentication/components/BasicLayout";

function ReservationAdd() {
  const navigate = useNavigate();
  const location = useLocation();
  const { accessToken } = useSelector((state) => state.auth);
  const [pharmacies, setPharmacies] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [wholesales, setWholesales] = useState([]);
  const [manufacturers, setManufacturers] = useState([]);
  const [medicalReps, setMedicalReps] = useState([]);
  const [availableProducts, setAvailableProducts] = useState([]);
  const [selectedPharmacy, setSelectedPharmacy] = useState(null);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [selectedWholesale, setSelectedWholesale] = useState(null);
  const [selectedManufacturer, setSelectedManufacturer] = useState(null);
  const [selectedMedRep, setSelectedMedRep] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([
    { product: null, quantity: "", price: "" },
  ]);
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [discountable, setDiscountable] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState({ color: "", content: "" });
  const [reservationType, setReservationType] = useState("pharmacy");
  const [isSubmitting, setIsSubmitting] = useState(false); // New state to track submission

  useEffect(() => {
    async function fetchPharmacies() {
      try {
        const response = await axiosInstance.get("mr/get-all-pharmacy", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setPharmacies(response.data);
      } catch (error) {
        console.error("Failed to fetch pharmacies", error);
      }
    }

    async function fetchHospitals() {
      try {
        const response = await axiosInstance.get("http://localhost:8000/mr/get-hospitals", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setHospitals(response.data);
      } catch (error) {
        console.error("Failed to fetch hospitals", error);
      }
    }

    async function fetchWholesales() {
      try {
        const response = await axiosInstance.get("http://localhost:8000/ws/get-wholesales", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setWholesales(response.data);
      } catch (error) {
        console.error("Failed to fetch wholesales", error);
      }
    }

    async function fetchManufacturers() {
      try {
        const response = await axiosInstance.get("common/get-manufactured-company");
        setManufacturers(response.data);
      } catch (error) {
        console.error("Failed to fetch manufacturers", error);
      }
    }

    async function fetchProducts() {
      try {
        const response = await axiosInstance.get("common/get-product", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setAvailableProducts(response.data);
      } catch (error) {
        console.error("Failed to fetch products", error);
      }
    }

    async function fetchMedicalReps() {
      try {
        const response = await axiosInstance.get("http://localhost:8000/common/get-med-reps", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setMedicalReps(response.data);
      } catch (error) {
        console.error("Failed to fetch medical representatives", error);
      }
    }

    fetchPharmacies();
    fetchHospitals();
    fetchWholesales();
    fetchManufacturers();
    fetchProducts();
    fetchMedicalReps();
  }, [accessToken]);

  const handleProductChange = (index, value) => {
    const newSelectedProducts = [...selectedProducts];
    newSelectedProducts[index].product = value;
    setSelectedProducts(newSelectedProducts);
  };

  const handleQuantityChange = (index, value) => {
    const newSelectedProducts = [...selectedProducts];
    newSelectedProducts[index].quantity = value;
    setSelectedProducts(newSelectedProducts);
  };

  const handlePriceChange = (index, value) => {
    const newSelectedProducts = [...selectedProducts];
    newSelectedProducts[index].price = value;
    setSelectedProducts(newSelectedProducts);
  };

  const handleAddProduct = () => {
    setSelectedProducts([...selectedProducts, { product: null, quantity: "", price: "" }]);
  };

  const handleRemoveProduct = (index) => {
    const newSelectedProducts = [...selectedProducts];
    newSelectedProducts.splice(index, 1);
    setSelectedProducts(newSelectedProducts);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      (reservationType === "pharmacy" && !selectedPharmacy) ||
      (reservationType === "hospital" && !selectedHospital) ||
      (reservationType === "wholesale" && !selectedWholesale) ||
      !selectedManufacturer ||
      !invoiceNumber ||
      (reservationType === "wholesale" && !selectedMedRep) ||
      selectedProducts.some(
        (sp) => !sp.product || !sp.quantity || (reservationType === "wholesale" && !sp.price)
      )
    ) {
      setMessage({ color: "error", content: "Пожалуйста, заполните все поля" });
      return;
    }

    const productsData = selectedProducts.map((sp) => ({
      product_id: sp.product.id,
      quantity: sp.quantity,
      ...(reservationType === "wholesale" && { price: sp.price }),
    }));

    const requestData = {
      manufactured_company_id: selectedManufacturer.id,
      invoice_number: invoiceNumber,
      ...(reservationType === "wholesale"
        ? { med_rep_id: selectedMedRep.id, discount }
        : { discountable }),
      products: productsData,
    };

    const endpoint =
      reservationType === "pharmacy"
        ? `mr/reservation/${selectedPharmacy.id}`
        : reservationType === "hospital"
        ? `mr/hospital-reservation/${selectedHospital.id}`
        : `http://localhost:8000/ws/wholesale-reservation/${selectedWholesale.id}`;

    try {
      const response = await axiosInstance.post(endpoint, requestData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      setMessage({ color: "success", content: "Бронь успешно добавлена!" });
      setIsSubmitting(true); // Disable the button after clicking

      setTimeout(() => {
        navigate(-1);
      }, 2000);
    } catch (error) {
      console.error("Failed to add reservation", error);
      setMessage({
        color: "error",
        content: error.response?.data?.detail || "Не удалось добавить бронь.",
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
            Добавить бронь
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          {message.content && <Alert severity={message.color}>{message.content}</Alert>}
          <MDBox component="form" role="form" onSubmit={handleSubmit}>
            <FormControl component="fieldset" mb={2} style={{ color: "black" }}>
              <FormLabel component="legend" style={{ color: "black" }}>
                Тип брони
              </FormLabel>
              <RadioGroup
                row
                aria-label="reservation type"
                name="reservation-type"
                value={reservationType}
                onChange={(e) => setReservationType(e.target.value)}
              >
                <FormControlLabel value="pharmacy" control={<Radio />} label="Аптека" />
                <FormControlLabel value="hospital" control={<Radio />} label="Больница" />
                <FormControlLabel value="wholesale" control={<Radio />} label="Оптовик" />
              </RadioGroup>
            </FormControl>
            {reservationType === "pharmacy" ? (
              <MDBox mb={2}>
                <Autocomplete
                  options={pharmacies}
                  getOptionLabel={(option) => option.company_name}
                  onChange={(event, newValue) => setSelectedPharmacy(newValue)}
                  renderInput={(params) => (
                    <TextField {...params} label="Аптека" variant="outlined" fullWidth />
                  )}
                />
              </MDBox>
            ) : reservationType === "hospital" ? (
              <MDBox mb={2}>
                <Autocomplete
                  options={hospitals}
                  getOptionLabel={(option) => option.company_name}
                  onChange={(event, newValue) => setSelectedHospital(newValue)}
                  renderInput={(params) => (
                    <TextField {...params} label="Больница" variant="outlined" fullWidth />
                  )}
                />
              </MDBox>
            ) : (
              <>
                <MDBox mb={2}>
                  <Autocomplete
                    options={wholesales}
                    getOptionLabel={(option) => option.name}
                    onChange={(event, newValue) => setSelectedWholesale(newValue)}
                    renderInput={(params) => (
                      <TextField {...params} label="Оптовик" variant="outlined" fullWidth />
                    )}
                  />
                </MDBox>
                <MDBox mb={2}>
                  <Autocomplete
                    options={medicalReps}
                    getOptionLabel={(option) => option.full_name}
                    onChange={(event, newValue) => setSelectedMedRep(newValue)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Медицинский представитель"
                        variant="outlined"
                        fullWidth
                      />
                    )}
                  />
                </MDBox>
              </>
            )}
            <MDBox mb={2}>
              <Autocomplete
                options={manufacturers}
                getOptionLabel={(option) => option.name}
                onChange={(event, newValue) => setSelectedManufacturer(newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Производственная компания"
                    variant="outlined"
                    fullWidth
                  />
                )}
              />
            </MDBox>
            <MDBox mb={2}>
              <TextField
                label="Номер счета"
                variant="outlined"
                fullWidth
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
              />
            </MDBox>

            <MDBox display="flex" alignItems="center" mb={2}>
              <Switch
                checked={discountable}
                onChange={(e) => setDiscountable(e.target.checked)}
                inputProps={{ "aria-label": "discountable switch" }}
              />
              <MDTypography variant="button" fontWeight="medium" ml={1}>
                Скидка доступна
              </MDTypography>
              {reservationType === "wholesale" && discountable && (
                <TextField
                  label="Скидка (%)"
                  variant="outlined"
                  type="number"
                  value={discount}
                  onChange={(e) => setDiscount(Number(e.target.value))}
                  sx={{ width: "100px", ml: 2 }}
                />
              )}
            </MDBox>

            {selectedProducts.map((selectedProduct, index) => (
              <MDBox key={index} display="flex" alignItems="center" mb={1}>
                <Autocomplete
                  options={availableProducts}
                  getOptionLabel={(option) => option.name}
                  onChange={(event, newValue) => handleProductChange(index, newValue)}
                  renderInput={(params) => (
                    <TextField {...params} label="Продукт" variant="outlined" fullWidth />
                  )}
                  value={selectedProduct.product}
                  sx={{ width: reservationType === "wholesale" ? "30%" : "40%", mr: 1 }}
                />
                <TextField
                  label="Количество"
                  variant="outlined"
                  type="number"
                  value={selectedProduct.quantity}
                  onChange={(e) => handleQuantityChange(index, e.target.value)}
                  sx={{ width: reservationType === "wholesale" ? "20%" : "30%", mr: 1 }}
                />
                {reservationType === "wholesale" && (
                  <TextField
                    label="Цена"
                    variant="outlined"
                    type="number"
                    value={selectedProduct.price}
                    onChange={(e) => handlePriceChange(index, e.target.value)}
                    sx={{ width: "20%", mr: 1 }}
                  />
                )}
                <IconButton onClick={() => handleRemoveProduct(index)}>
                  <DeleteIcon />
                </IconButton>
              </MDBox>
            ))}
            <MDBox display="flex" justifyContent="space-around" mb={2}>
              <IconButton onClick={handleAddProduct}>
                <AddIcon />
              </IconButton>
            </MDBox>
            <MDBox mt={1} mb={1} display="flex" justifyContent="space-between">
              <MDButton
                variant="gradient"
                color="info"
                type="submit"
                fullWidth
                disabled={isSubmitting}
              >
                Добавить
              </MDButton>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </BasicLayout>
  );
}

export default ReservationAdd;
