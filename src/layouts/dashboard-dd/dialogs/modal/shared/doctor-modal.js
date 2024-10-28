import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import ModalOpen from "../modal";
import Button from "@mui/material/Button";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import axios from "axios";
import SearchControl from "../../../../../services/geoSearchController";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";

// @mui material components
import Grid from "@mui/material/Grid";

// Authentication layout components
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useSelector } from "react-redux";

function DoctorModal({ open, handleClose, handleSubmit, doctorToUpdate }) {
  const [fullName, setFullName] = useState("");
  const [contact1, setContact1] = useState("");
  const [contact2, setContact2] = useState("");
  const [email, setEmail] = useState("");
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [address, setAddress] = useState(""); // New state for address
  const [categoryId, setCategoryId] = useState("");
  const [specialityId, setSpecialityId] = useState("");
  const [medicalOrganizationId, setMedicalOrganizationId] = useState("");
  const [categories, setCategories] = useState([]);
  const [specialities, setSpecialities] = useState([]);
  const [medicalOrganizations, setMedicalOrganizations] = useState([]);

  const accessToken = useSelector((state) => state.auth.accessToken);

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

  useEffect(() => {
    if (open && doctorToUpdate) {
      setFullName(doctorToUpdate.full_name);
      setContact1(doctorToUpdate.contact1);
      setContact2(doctorToUpdate.contact2);
      setEmail(doctorToUpdate.email);
      setCategoryId(doctorToUpdate.category_id);
      setSpecialityId(doctorToUpdate.speciality_id);
      setMedicalOrganizationId(doctorToUpdate.medical_organization_id);
    }
  }, [doctorToUpdate, open]);

  const handleFormSubmit = (event) => {
    event.preventDefault();
    const updatedDoctor = {
      id: doctorToUpdate.id,
      full_name: fullName,
      contact1: contact1,
      contact2: contact2,
      email: email,
      category_id: categoryId,
      speciality_id: specialityId,
      medical_organization_id: medicalOrganizationId,
    };
    handleSubmit(updatedDoctor);
    handleClose();
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

  return (
    <ModalOpen
      open={open}
      header={<MDTypography>Редактировать Доктора</MDTypography>}
      body={
        <form onSubmit={handleFormSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <MDBox mb={2}>
                <MDInput
                  fullWidth
                  type="text"
                  label="Полное имя"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6}>
              <MDBox mb={2}>
                <MDInput
                  fullWidth
                  type="text"
                  label="Контакт 1"
                  value={contact1}
                  onChange={(e) => setContact1(e.target.value)}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6}>
              <MDBox mb={2}>
                <MDInput
                  fullWidth
                  type="text"
                  label="Контакт 2"
                  value={contact2}
                  onChange={(e) => setContact2(e.target.value)}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12}>
              <MDBox mb={2}>
                <MDInput
                  fullWidth
                  type="email"
                  label="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Категория</InputLabel>
                <Select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  style={{ height: "45px" }}
                >
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Специальность</InputLabel>
                <Select
                  value={specialityId}
                  onChange={(e) => setSpecialityId(e.target.value)}
                  style={{ height: "45px" }}
                >
                  {specialities.map((speciality) => (
                    <MenuItem key={speciality.id} value={speciality.id}>
                      {speciality.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={12}>
              <FormControl fullWidth>
                <InputLabel>Медицинская организация</InputLabel>
                <Select
                  value={medicalOrganizationId}
                  onChange={(e) => setMedicalOrganizationId(e.target.value)}
                  style={{ height: "45px" }}
                >
                  {medicalOrganizations.map((medicalOrganization) => (
                    <MenuItem key={medicalOrganization.id} value={medicalOrganization.id}>
                      {medicalOrganization.name}
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
              <MDTypography variant="h6">Адрес: {address}</MDTypography> {/* Display the address */}
            </Grid>
          </Grid>

          <MDBox display="flex" justifyContent="flex-end" mt={3}>
            <Button onClick={handleClose} variant="outlined" style={{ color: "black" }}>
              Закрыть
            </Button>
            <Button
              onClick={handleFormSubmit}
              variant="contained"
              style={{ marginLeft: "20px", color: "black" }}
            >
              Сохранить
            </Button>
          </MDBox>
        </form>
      }
    />
  );
}

DoctorModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  doctorToUpdate: PropTypes.object.isRequired,
};

export default DoctorModal;
