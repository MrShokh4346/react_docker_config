import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import SearchControl from "../../../services/geoSearchController";

// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Authentication layout components
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";

// Fix for missing default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

function DeputyDirectorAddDoctor() {
  const location = useLocation();
  const navigate = useNavigate();

  const { accessToken } = useSelector((state) => state.auth);
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [address, setAddress] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [specialityId, setSpecialityId] = useState("");
  const [medicalOrganizationId, setMedicalOrganizationId] = useState("");
  const [categories, setCategories] = useState([]);
  const [specialities, setSpecialities] = useState([]);
  const [medicalOrganizations, setMedicalOrganizations] = useState([]);
  const { id } = location.state || {};
  const [isSubmitting, setIsSubmitting] = useState(false); // New state to track submission

  const [doctorData, setDoctorData] = useState({
    full_name: "",
    contact1: "",
    contact2: "",
    email: "",
    birth_date: "",
  });

  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/common/get-category`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setCategories(response.data);
      } catch (error) {
        console.error("Не удалось получить категории:", error);
      }
    };

    const fetchSpecialities = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/common/get-speciality`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setSpecialities(response.data);
      } catch (error) {
        console.error("Не удалось получить специальности:", error);
      }
    };

    const fetchMedicalOrganizations = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/common/get-medical-organization`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setMedicalOrganizations(response.data);
      } catch (error) {
        console.error("Не удалось получить медицинские организации:", error);
      }
    };

    fetchCategories();
    fetchSpecialities();
    fetchMedicalOrganizations();
  }, [accessToken]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate all fields are filled, including latitude and longitude
    if (
      !doctorData.full_name ||
      !doctorData.contact1 ||
      !doctorData.contact2 ||
      !doctorData.email ||
      !doctorData.birth_date ||
      !categoryId ||
      !specialityId ||
      !medicalOrganizationId ||
      latitude === 0 ||
      longitude === 0
    ) {
      setSnackbar({
        open: true,
        message:
          latitude === 0 || longitude === 0
            ? "Пожалуйста, выберите местоположение на карте."
            : "Все поля должны быть заполнены",
        severity: "error",
      });
      return;
    }

    try {
      await axios.post(
        `http://localhost:8000/mr/add-doctor?user_id=${id}`,
        {
          ...doctorData,
          latitude: latitude.toString(),
          longitude: longitude.toString(),
          category_id: parseInt(categoryId, 10),
          speciality_id: parseInt(specialityId, 10),
          medical_organization_id: parseInt(medicalOrganizationId, 10),
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      setSnackbar({
        open: true,
        message: "Доктор успешно добавлен",
        severity: "success",
      });
      setIsSubmitting(true); // Disable the button after clicking
      setTimeout(() => {
        navigate(-1);
      }, 2000);
    } catch (error) {
      setSnackbar({ open: true, message: "Не удалось добавить доктора", severity: "error" });
      console.error("Ошибка при добавлении доктора:", error);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  function LocationMarker() {
    const map = useMapEvents({
      click(e) {
        setLatitude(e.latlng.lat);
        setLongitude(e.latlng.lng);
      },
      move() {
        setLatitude(map.getCenter().lat);
        setLongitude(map.getCenter().lng);
      },
    });

    return latitude !== 0 && longitude !== 0 ? (
      <Marker
        position={[latitude, longitude]}
        draggable={true}
        eventHandlers={{
          dragend(e) {
            const marker = e.target;
            const position = marker.getLatLng();
            setLatitude(position.lat);
            setLongitude(position.lng);
          },
        }}
      ></Marker>
    ) : null;
  }

  const handleChange = (e) => {
    setDoctorData({
      ...doctorData,
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
            Добавить врача
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <MDInput
                  type="text"
                  label="Полное имя"
                  fullWidth
                  name="full_name"
                  value={doctorData.full_name}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <MDInput
                  type="text"
                  label="Контакт 1"
                  fullWidth
                  name="contact1"
                  value={doctorData.contact1}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <MDInput
                  type="text"
                  label="Контакт 2"
                  fullWidth
                  name="contact2"
                  value={doctorData.contact2}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <MDInput
                  type="email"
                  label="Email"
                  fullWidth
                  name="email"
                  value={doctorData.email}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <MDInput
                  type="date"
                  label="Дата рождения"
                  fullWidth
                  name="birth_date"
                  value={doctorData.birth_date}
                  onChange={handleChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel id="categories-label">Категория</InputLabel>
                  <Select
                    labelId="categories-label"
                    value={categoryId}
                    label="Категория"
                    onChange={(e) => setCategoryId(e.target.value)}
                    sx={{ height: "45px" }}
                  >
                    {categories.map((category) => (
                      <MenuItem key={category.id} value={category.id}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel id="specialities-label">Специальность</InputLabel>
                  <Select
                    labelId="specialities-label"
                    value={specialityId}
                    label="Специальность"
                    onChange={(e) => setSpecialityId(e.target.value)}
                    sx={{ height: "45px" }}
                  >
                    {specialities.map((speciality) => (
                      <MenuItem key={speciality.id} value={speciality.id}>
                        {speciality.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel id="medical-organizations-label">Медицинская Организация</InputLabel>
                  <Select
                    labelId="medical-organizations-label"
                    value={medicalOrganizationId}
                    label="Медицинская Организация"
                    onChange={(e) => setMedicalOrganizationId(e.target.value)}
                    sx={{ height: "45px" }}
                  >
                    {medicalOrganizations.map((organization) => (
                      <MenuItem key={organization.id} value={organization.id}>
                        {organization.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={12}>
                <MDBox mb={2} style={{ height: "200px" }}>
                  <MapContainer
                    center={[51.505, -0.09]}
                    zoom={13}
                    style={{ height: "100%", width: "100%" }}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <SearchControl
                      setLatitude={setLatitude}
                      setLongitude={setLongitude}
                      setAddress={setAddress} // Pass setAddress as a prop
                    />
                    <LocationMarker />
                  </MapContainer>
                </MDBox>
              </Grid>
              <Grid item xs={12} md={6}>
                <MDTypography variant="h6">Широта: {latitude}</MDTypography>
              </Grid>
              <Grid item xs={12} md={6}>
                <MDTypography variant="h6">Долгота: {longitude}</MDTypography>
              </Grid>
              <Grid item xs={12} md={12}>
                <MDTypography variant="h6">Адрес: {address}</MDTypography>{" "}
              </Grid>
            </Grid>
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

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000} // Snackbar will disappear after 3 seconds
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </DashboardLayout>
  );
}

export default DeputyDirectorAddDoctor;
