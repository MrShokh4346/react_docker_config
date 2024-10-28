import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Alert from "@mui/material/Alert";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Authentication layout components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";

function DeputyDirectorAddNotification() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = location.state || {};
  const { accessToken } = useSelector((state) => state.auth);
  const [notificationType, setNotificationType] = useState("pharmacy");
  const [pharmacies, setPharmacies] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [wholesales, setWholesales] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false); // New state to track submission
  const [notificationData, setNotificationData] = useState({
    author: "",
    theme: "",
    description: "",
    pharmacy_id: "",
    doctor_id: "",
    wholesale_id: "",
  });

  const [message, setMessage] = useState({ color: "", content: "" });

  useEffect(() => {
    const fetchPharmacies = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/mr/get-pharmacy?user_id=${id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setPharmacies(response.data);
      } catch (error) {
        console.error("Не удалось получить аптеки:", error);
      }
    };

    const fetchDoctors = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/mr/get-doctors-by-med-rep/${id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setDoctors(response.data);
      } catch (error) {
        console.error("Не удалось получить докторов:", error);
      }
    };

    const fetchWsCompanies = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/ws/get-wholesales`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setWholesales(response.data);
      } catch (error) {
        console.error("Не удалось получить оптовые компании:", error);
      }
    };

    fetchPharmacies();
    fetchDoctors();
    fetchWsCompanies();
  }, [accessToken, id]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const dataToSend = {
      author: notificationData.author,
      theme: notificationData.theme,
      description: notificationData.description,
      med_rep_id: parseInt(id, 10),
    };

    if (notificationType === "pharmacy") {
      dataToSend.pharmacy_id = parseInt(notificationData.pharmacy_id, 10);
    } else if (notificationType === "doctor") {
      dataToSend.doctor_id = parseInt(notificationData.doctor_id, 10);
    } else {
      dataToSend.wholesale_id = parseInt(notificationData.wholesale_id, 10);
    }

    try {
      const response = await axios.post(`http://localhost:8000/dd/post-notification`, dataToSend, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      setMessage({ color: "success", content: "Уведомление успешно добавлено" });
      setIsSubmitting(true); // Disable the button after clicking

      setTimeout(() => navigate(-1), 2000);
    } catch (error) {
      setMessage({
        color: "error",
        content:
          "Не удалось добавить уведомление. " +
          (error.response?.data?.detail || "Пожалуйста, проверьте свои данные и попробуйте снова."),
      });
    }
  };

  const handleChange = (e) => {
    setNotificationData({
      ...notificationData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <DashboardLayout>
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
            Добавить Уведомление
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          {message.content && <Alert severity={message.color}>{message.content}</Alert>}
          <MDBox component="form" role="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <MDInput
                  type="text"
                  label="Автор"
                  fullWidth
                  name="author"
                  value={notificationData.author}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <MDInput
                  type="text"
                  label="Тема"
                  fullWidth
                  name="theme"
                  value={notificationData.theme}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <MDInput
                  type="text"
                  label="Описание"
                  fullWidth
                  multiline
                  rows={4}
                  name="description"
                  value={notificationData.description}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl component="fieldset">
                  <RadioGroup
                    row
                    value={notificationType}
                    onChange={(e) => setNotificationType(e.target.value)}
                  >
                    <FormControlLabel value="pharmacy" control={<Radio />} label="Аптека" />
                    <FormControlLabel value="doctor" control={<Radio />} label="Доктор" />
                    <FormControlLabel
                      value="wholesale"
                      control={<Radio />}
                      label="Оптовая компания"
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>
              {notificationType === "pharmacy" && (
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel id="pharmacy-label">Аптека</InputLabel>
                    <Select
                      labelId="pharmacy-label"
                      value={notificationData.pharmacy_id}
                      label="Аптека"
                      onChange={handleChange}
                      sx={{ height: "45px" }}
                      name="pharmacy_id"
                    >
                      {pharmacies.map((pharmacy) => (
                        <MenuItem key={pharmacy.id} value={pharmacy.id}>
                          {pharmacy.company_name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              )}
              {notificationType === "doctor" && (
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel id="doctor-label">Доктор</InputLabel>
                    <Select
                      labelId="doctor-label"
                      value={notificationData.doctor_id}
                      label="Доктор"
                      onChange={handleChange}
                      sx={{ height: "45px" }}
                      name="doctor_id"
                    >
                      {doctors.map((doctor) => (
                        <MenuItem key={doctor.id} value={doctor.id}>
                          {doctor.full_name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              )}
              {notificationType === "wholesale" && (
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel id="wholesale-label">Оптовая компания</InputLabel>
                    <Select
                      labelId="wholesale-label"
                      value={notificationData.wholesale_id}
                      label="Оптовая компания"
                      onChange={handleChange}
                      sx={{ height: "45px" }}
                      name="wholesale_id"
                    >
                      {wholesales.map((wholesale) => (
                        <MenuItem key={wholesale.id} value={wholesale.id}>
                          {wholesale.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              )}
            </Grid>
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
    </DashboardLayout>
  );
}

export default DeputyDirectorAddNotification;
