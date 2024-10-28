/* eslint-disable prettier/prettier */
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import "dayjs/locale/ru"; // Import Russian locale for dayjs

// @mui material components
import Card from "@mui/material/Card";
import Alert from "@mui/material/Alert";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { renderTimeViewClock } from "@mui/x-date-pickers/timeViewRenderers";
import TextField from "@mui/material/TextField";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Authentication layout components
import BasicLayout from "layouts/authentication/components/BasicLayout";

function DeputyDirectorAddPharmacyPlan() {
  const navigate = useNavigate();
  const location = useLocation();
  const { accessToken } = useSelector((state) => state.auth);
  const [theme, setTheme] = useState("");
  const [description, setDescription] = useState("");
  const [pharmacy_id, setPharmacyId] = useState("");
  const [date, setDate] = useState(null);
  const [pharmacies, setPharmacies] = useState([]);
  const [message, setMessage] = useState({ color: "", content: "" });
  const [isSubmitting, setIsSubmitting] = useState(false); // New state to track submission

  const { id } = location.state || {};

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
        console.error("Failed to fetch pharmacies:", error);
      }
    };

    fetchPharmacies();
  }, [accessToken]);

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission
    // Define the request payload
    const pharmacyPlanData = {
      theme,
      description,
      pharmacy_id,
      date: date ? date.format("YYYY-MM-DD HH:mm") : null, // Convert date to YYYY-MM-DD format
    };

    try {
      // Call the API with authorization header
      const response = await axios.post(
        `http://localhost:8000/dd/add-pharmacy-plan/${id}`,
        pharmacyPlanData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      // Handle a successful response
      setMessage({ color: "success", content: "План аптеки добавлен" });
      setIsSubmitting(true); // Disable the button after clicking

      // Optional: Redirect after a delay
      setTimeout(() => {
        navigate(-1);
      }, 2000);
    } catch (error) {
      console.log(error);
      setMessage({
        color: "error",
        content:
          "Не удалось добавить план аптеки. " +
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
            Добавить план аптеки
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
                onChange={(e) => setTheme(e.target.value)}
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
            <MDBox mb={4}>
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
            <MDBox mb={2}>
              <LocalizationProvider dateAdapter={AdapterDayjs} locale="ru">
                <DateTimePicker
                  label="Выберите дату"
                  value={date}
                  viewRenderers={{
                    hours: renderTimeViewClock,
                    minutes: renderTimeViewClock,
                    seconds: renderTimeViewClock,
                  }}
                  ampm={false} // Use 24-hour format
                  onChange={(newValue) => setDate(newValue)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                  disablePast // Disable past dates
                />
              </LocalizationProvider>
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

export default DeputyDirectorAddPharmacyPlan;
