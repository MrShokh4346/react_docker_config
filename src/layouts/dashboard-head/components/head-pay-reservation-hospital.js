import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

// @mui material components
import Card from "@mui/material/Card";
import Alert from "@mui/material/Alert";
import TextField from "@mui/material/TextField";
import { MenuItem, FormControl, InputLabel, Select, Autocomplete } from "@mui/material";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Authentication layout components
import BasicLayout from "layouts/authentication/components/BasicLayout";
import axiosInstance from "services/axiosInstance";

function HeadPayReservationHospital() {
  const navigate = useNavigate();
  const { accessToken } = useSelector((state) => state.auth);
  const location = useLocation();
  const { reservationId } = location.state || {};

  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState(""); // Remove default 0
  const [doctorId, setDoctorId] = useState(""); // No default 0
  const [monthNumber, setMonthNumber] = useState(""); // Month state without default
  const [bonusDiscount, setBonusDiscount] = useState(""); // Remove default 0
  const [doctors, setDoctors] = useState([]); // State to store doctors list
  const [message, setMessage] = useState({ color: "", content: "" });
  const [isSubmitting, setIsSubmitting] = useState(false); // New state to track submission

  // Russian months for selection
  const monthsInRussian = [
    { value: 1, label: "Январь" },
    { value: 2, label: "Февраль" },
    { value: 3, label: "Март" },
    { value: 4, label: "Апрель" },
    { value: 5, label: "Май" },
    { value: 6, label: "Июнь" },
    { value: 7, label: "Июль" },
    { value: 8, label: "Август" },
    { value: 9, label: "Сентябрь" },
    { value: 10, label: "Октябрь" },
    { value: 11, label: "Ноябрь" },
    { value: 12, label: "Декабрь" },
  ];

  // Fetch doctors from the API
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get("http://localhost:8000/mr/get-doctors", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setDoctors(response.data); // Store the fetched doctors
      } catch (error) {
        console.error("Failed to fetch doctors:", error);
      }
    };

    fetchDoctors();
  }, [accessToken]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Ensure all fields are filled
    if (!amount || !description || !doctorId || !monthNumber || !bonusDiscount) {
      setMessage({ color: "error", content: "Пожалуйста, заполните все поля" });
      return;
    }

    const payload = {
      doctor_id: doctorId,
      month_number: parseInt(monthNumber, 10),
      bonus_discount: parseFloat(bonusDiscount),
      amount: parseFloat(amount),
      description,
    };

    try {
      await axiosInstance.post(`head/pay-hospital-reservation/${reservationId}`, payload, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

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
            <MDBox mb={2}>
              <Autocomplete
                options={doctors}
                getOptionLabel={(option) => option.full_name} // Display doctor full_name
                onChange={(event, value) => setDoctorId(value ? value.id : "")} // Set doctorId when selected
                renderInput={(params) => (
                  <TextField {...params} label="Доктор" variant="outlined" required fullWidth />
                )}
              />
            </MDBox>
            <MDBox mb={2}>
              <FormControl fullWidth required>
                <InputLabel id="month-select-label">Месяц</InputLabel>
                <Select
                  labelId="month-select-label"
                  value={monthNumber}
                  onChange={(e) => setMonthNumber(e.target.value)}
                  label="Месяц"
                  sx={{ height: 45 }}
                >
                  {monthsInRussian.map((month) => (
                    <MenuItem key={month.value} value={month.value}>
                      {month.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </MDBox>
            <MDBox mb={2}>
              <TextField
                label="Сумма"
                type="number"
                variant="outlined"
                value={amount}
                onChange={(e) => {
                  const value = parseFloat(e.target.value);
                  if (value >= 0 || e.target.value === "") {
                    setAmount(e.target.value);
                  }
                }}
                InputProps={{ inputProps: { min: 0 } }}
                required
                fullWidth
                onWheel={(e) => e.target.blur()} // This prevents scroll from changing the value
              />
            </MDBox>
            <MDBox mb={2}>
              <TextField
                label="Скидка"
                type="number"
                variant="outlined"
                value={bonusDiscount}
                onChange={(e) => {
                  const value = parseFloat(e.target.value);
                  if (value >= 0 || e.target.value === "") {
                    setBonusDiscount(e.target.value);
                  }
                }}
                InputProps={{ inputProps: { min: 0 } }}
                required
                fullWidth
                onWheel={(e) => e.target.blur()} // This prevents scroll from changing the value
              />
            </MDBox>
            <MDBox mb={2}>
              <TextField
                label="Комментарий"
                multiline
                rows={4}
                fullWidth
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
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

export default HeadPayReservationHospital;
