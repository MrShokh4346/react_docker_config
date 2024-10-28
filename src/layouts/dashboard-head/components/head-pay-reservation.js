/* eslint-disable prettier/prettier */
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";
import Alert from "@mui/material/Alert";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import Tooltip from "@mui/material/Tooltip";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Authentication layout components
import BasicLayout from "layouts/authentication/components/BasicLayout";
import axiosInstance from "services/axiosInstance";

function HeadPayReservation() {
  const navigate = useNavigate();
  const { accessToken } = useSelector((state) => state.auth);
  const location = useLocation();
  const { reservationId, type } = location.state || {}; // Add a default value

  const [description, setDescription] = useState("");
  const [message, setMessage] = useState({ color: "", content: "" });
  const [doctors, setDoctors] = useState([]);
  const [pharmacies, setPharmacies] = useState([]);
  const [medReps, setMedReps] = useState([]);
  const [doctorProducts, setDoctorProducts] = useState([
    { doctor: null, products: [], product: null, quantity: 1, amount: 1 },
  ]);
  const [selectedPharmacy, setSelectedPharmacy] = useState(null);
  const [selectedMedRep, setSelectedMedRep] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // New state to track submission
  const [forceRender, setForceRender] = useState(false); // State variable to force re-render

  useEffect(() => {
    const fetchMedReps = async () => {
      try {
        const response = await axiosInstance.get("/common/get-med-reps");
        setMedReps(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchDoctors = async () => {
      try {
        const response = await axiosInstance.get("/mr/get-doctors");
        setDoctors(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchMedReps();
    if (type !== "wholesale") {
      fetchDoctors();
    }
  }, [type]);

  const fetchPharmacies = async (medRepId) => {
    try {
      const response = await axiosInstance.get(
        `http://localhost:8000/mr/get-pharmacy?user_id=${medRepId}`
      );
      setPharmacies(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchDoctorsByMedRep = async (medRepId) => {
    try {
      const response = await axiosInstance.get(
        `http://localhost:8000/mr/get-doctors-by-med-rep/${medRepId}`
      );
      setDoctors(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleMedRepChange = (newValue) => {
    setSelectedMedRep(newValue);
    if (newValue) {
      fetchPharmacies(newValue.id);
      fetchDoctorsByMedRep(newValue.id);
    } else {
      setPharmacies([]);
      setSelectedPharmacy(null);
      setDoctors([]);
    }
  };

  const handleDoctorChange = async (index, value) => {
    const updatedDoctorProducts = [...doctorProducts];
    updatedDoctorProducts[index].doctor = value;

    if (value) {
      try {
        const response = await axiosInstance.get(`/mr/doctor-attached-products/${value.id}`);
        updatedDoctorProducts[index].products = response.data.map((item) => item.product);
        setDoctorProducts(updatedDoctorProducts);
        setForceRender((prev) => !prev); // Toggle forceRender to trigger re-render
      } catch (error) {
        console.log(error);
      }
    } else {
      updatedDoctorProducts[index].products = [];
      setDoctorProducts(updatedDoctorProducts);
      setForceRender((prev) => !prev); // Toggle forceRender to trigger re-render
    }
  };

  const handleDoctorProductChange = (index, field, value) => {
    const updatedDoctorProducts = [...doctorProducts];
    updatedDoctorProducts[index][field] = value;
    setDoctorProducts(updatedDoctorProducts);
  };

  const handleAddDoctorProduct = () => {
    setDoctorProducts([
      ...doctorProducts,
      { doctor: null, products: [], product: null, quantity: 1, amount: 1 },
    ]);
  };

  const handleRemoveDoctorProduct = (index) => {
    const updatedDoctorProducts = doctorProducts.filter((_, i) => i !== index);
    setDoctorProducts(updatedDoctorProducts);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      doctorProducts.some(
        ({ doctor, product, quantity, amount }) => !doctor || !product || !quantity || !amount
      )
    ) {
      setMessage({ color: "error", content: "Пожалуйста, заполните все поля" });
      return;
    }

    const objects = doctorProducts.map(({ doctor, product, quantity, amount }) => ({
      doctor_id: doctor?.id,
      product_id: product?.id,
      quantity,
      amount,
    }));

    const payload =
      type === "wholesale"
        ? {
            med_rep_id: selectedMedRep?.id,
            pharmacy_id: selectedPharmacy?.id,
            objects,
            description,
          }
        : {
            objects,
            description,
          };

    try {
      await axiosInstance.post(
        `head/pay-${type === "pharmacy" ? "" : `${type}-`}reservation/${reservationId}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      setMessage({ color: "success", content: "Поступление добавлено" });
      setIsSubmitting(true); // Disable the button after clicking

      setTimeout(() => {
        navigate(-1);
      }, 2000);
    } catch (error) {
      console.log(error);
      setMessage({
        color: "error",
        content:
          "Не удалось добавить поступление. " +
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
            Поступление
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          {message.content && <Alert severity={message.color}>{message.content}</Alert>}
          <MDBox component="form" role="form" onSubmit={handleSubmit}>
            {type === "wholesale" && (
              <>
                <MDBox mb={2}>
                  <Autocomplete
                    options={medReps}
                    getOptionLabel={(option) => option.full_name}
                    value={selectedMedRep}
                    onChange={(event, newValue) => handleMedRepChange(newValue)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Выберите медицинского представителя"
                        variant="outlined"
                      />
                    )}
                    fullWidth
                  />
                </MDBox>
                <MDBox mb={2}>
                  <Tooltip
                    title={selectedMedRep ? "" : "Сначала выберите медицинского представителя"}
                    arrow
                    disableHoverListener={!!selectedMedRep}
                  >
                    <span style={{ width: "100%" }}>
                      <Autocomplete
                        options={pharmacies}
                        getOptionLabel={(option) => option.company_name}
                        value={selectedPharmacy}
                        onChange={(event, newValue) => setSelectedPharmacy(newValue)}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Выберите аптеку"
                            variant="outlined"
                            disabled={!selectedMedRep}
                          />
                        )}
                        fullWidth
                      />
                    </span>
                  </Tooltip>
                </MDBox>
              </>
            )}
            {doctorProducts.map((doctorProduct, index) => (
              <div key={index}>
                <MDBox mb={2}>
                  <Tooltip
                    title={
                      type === "wholesale" && !selectedMedRep
                        ? "Сначала выберите медицинского представителя"
                        : ""
                    }
                    arrow
                    disableHoverListener={type !== "wholesale" || !!selectedMedRep}
                  >
                    <span style={{ width: "100%" }}>
                      <Autocomplete
                        options={doctors}
                        getOptionLabel={(option) => option.full_name}
                        value={doctorProduct.doctor}
                        onChange={(event, newValue) => handleDoctorChange(index, newValue)}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Выберите доктора"
                            variant="outlined"
                            disabled={type === "wholesale" && !selectedMedRep}
                          />
                        )}
                        fullWidth
                      />
                    </span>
                  </Tooltip>
                </MDBox>
                <MDBox mb={2} display="flex" alignItems="center">
                  <Tooltip
                    title={doctorProduct.doctor ? "" : "Сначала выберите доктора"}
                    arrow
                    disableHoverListener={!!doctorProduct.doctor}
                  >
                    <span style={{ width: "100%" }}>
                      <Autocomplete
                        options={doctorProduct.products || []}
                        getOptionLabel={(option) => option.name}
                        value={doctorProduct.product}
                        onChange={(event, newValue) =>
                          handleDoctorProductChange(index, "product", newValue)
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Выберите продукт"
                            variant="outlined"
                            disabled={!doctorProduct.doctor}
                          />
                        )}
                        fullWidth
                        key={`${index}-${forceRender}`} // Use forceRender state to trigger re-render
                      />
                    </span>
                  </Tooltip>
                  <TextField
                    type="number"
                    label="Количество"
                    variant="outlined"
                    value={doctorProduct.quantity}
                    onChange={(e) => handleDoctorProductChange(index, "quantity", e.target.value)}
                    InputProps={{ inputProps: { min: 1 } }}
                    style={{ marginLeft: 8, width: 100 }}
                  />
                  <TextField
                    type="number"
                    label="Сумма"
                    variant="outlined"
                    value={doctorProduct.amount}
                    onChange={(e) => handleDoctorProductChange(index, "amount", e.target.value)}
                    InputProps={{ inputProps: { min: 1 } }}
                    style={{ marginLeft: 8, width: 100 }}
                  />
                  {index > 0 && (
                    <IconButton onClick={() => handleRemoveDoctorProduct(index)}>
                      <DeleteIcon />
                    </IconButton>
                  )}
                </MDBox>
              </div>
            ))}
            <MDBox display="flex" justifyContent="center" mb={2}>
              <IconButton onClick={handleAddDoctorProduct} color="default">
                <AddIcon />
              </IconButton>
            </MDBox>
            <MDBox mb={2}>
              <TextField
                label="Комментарий"
                multiline
                rows={4}
                fullWidth
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </MDBox>
            <MDBox mt={4} mb={1}>
              <MDButton
                variant="gradient"
                color="info"
                fullWidth
                type="submit"
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

export default HeadPayReservation;
