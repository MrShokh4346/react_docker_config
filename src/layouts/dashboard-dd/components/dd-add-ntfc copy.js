/* eslint-disable prettier/prettier */
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";
import Alert from "@mui/material/Alert";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Authentication layout components
import BasicLayout from "layouts/authentication/components/BasicLayout";

function DeputyDirectorAddNotification() {
  const navigate = useNavigate();
  const location = useLocation();
  const { accessToken } = useSelector((state) => state.auth);
  const [theme, setThema] = useState("");
  const [description, setDescription] = useState("");
  const [doctor_id, setDoctorId] = useState("");
  const [pharmacy_id, setPharmacyId] = useState("");
  const [pharmacies, setPharmacies] = useState([]);
  const [doctors, setDoctors] = useState([]);

  const [message, setMessage] = useState({ color: "", content: "" });
  const { id, full_name } = location.state || {};

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/mr/get-doctors`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const doctors = response.data;
        setDoctors(doctors);
      } catch (error) {
        console.error("Не удалось получить список врачей:", error);
      }
    };

    fetchDoctors();
  }, [accessToken]);

  useEffect(() => {
    const fetchPharmacies = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/mr/get-pharmacy?user_id=${id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const pharmacies = response.data;
        setPharmacies(pharmacies);
      } catch (error) {
        console.error("Не удалось получить список аптек:", error);
      }
    };

    fetchPharmacies();
  }, [accessToken]);

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission
    // Define the request payload
    const notificationData = {
      author: full_name,
      theme,
      description,
      med_rep_id: id,
      doctor_id,
      pharmacy_id,
    };

    try {
      // Call the API with authorization header
      const response = await axios.post(
        "http://localhost:8000/dd/post-notification",
        notificationData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      // Handle a successful response
      setMessage({ color: "success", content: "Уведомление отправлено" });
      console.log(response.data);
      // Optional: Redirect after a delay
      setTimeout(() => {
        // navigate(-1);
      }, 2000);
    } catch (error) {
      console.log(error);
      setMessage({
        color: "error",
        content:
          "Не удалось отправить уведомление. " +
          (error.response?.data?.detail || "Пожалуйста, проверьте ввод и попробуйте снова."),
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
            Добавить уведомление
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          {message.content && <Alert severity={message.color}>{message.content}</Alert>}
          <MDBox component="form" role="form" onSubmit={handleSubmit}>
            <MDBox mb={2}>
              <MDInput
                type="text"
                label="Тема"
                fullWidth
                value={theme}
                onChange={(e) => setThema(e.target.value)}
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="text"
                label="Описание"
                fullWidth
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </MDBox>
            <MDBox mb={2}>
              <FormControl fullWidth>
                <InputLabel id="doctor-label">Врачи</InputLabel>
                <Select
                  labelId="doctor-label"
                  value={doctor_id}
                  label="Врачи"
                  onChange={(e) => setDoctorId(e.target.value)}
                  sx={{ height: "45px" }}
                >
                  {doctors.map((doctor) => (
                    <MenuItem key={doctor.id} value={doctor.id}>
                      {`${doctor.full_name}`}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </MDBox>
            <MDBox mb={2}>
              <FormControl fullWidth>
                <InputLabel id="pharmacy-label">Аптеки</InputLabel>
                <Select
                  labelId="pharmacy-label"
                  value={pharmacy_id}
                  label="Аптеки"
                  onChange={(e) => setPharmacyId(e.target.value)}
                  sx={{ height: "45px" }}
                >
                  {pharmacies.map((pharmacy) => (
                    <MenuItem key={pharmacy.id} value={pharmacy.id}>
                      {`${pharmacy.company_name}`}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </MDBox>

            <MDBox mt={4} mb={1}>
              <MDButton variant="gradient" color="info" fullWidth type="submit">
                Добавить
              </MDButton>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </BasicLayout>
  );
}

export default DeputyDirectorAddNotification;
