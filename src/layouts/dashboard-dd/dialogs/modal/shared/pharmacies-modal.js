import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import ModalOpen from "../modal";
import Button from "@mui/material/Button";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import axiosInstance from "services/axiosInstance";
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
import MapComponent from "layouts/dashboard-dd/elements/map-component";

const PharmaciesModal = ({ open, handleClose, handleSubmit, pharmaciesToUpdate }) => {
  const accessToken = useSelector((state) => state.auth.accessToken);
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [med_rep_id, setMedRepId] = useState(pharmaciesToUpdate?.med_rep_id || "");
  const [region_id, setRegionId] = useState(pharmaciesToUpdate?.region_id || "");
  const [medReps, setMedReps] = useState([]);
  const [regions, setRegions] = useState([]);

  const [companyName, setCompanyName] = useState("");
  const [contact1, setContact1] = useState("");
  const [email, setEmail] = useState("");
  const [brandName, setBrandName] = useState("");
  const [interBranchTurnover, setInterBranchTurnover] = useState("");
  const [pharmacyDirector, setPharmacyDirector] = useState("");

  useEffect(() => {
    if (open) {
      if (pharmaciesToUpdate) {
        setAddress(pharmaciesToUpdate.address);
        setLatitude(pharmaciesToUpdate.latitude);
        setLongitude(pharmaciesToUpdate.longitude);
        setMedRepId(pharmaciesToUpdate.med_rep_id);
        setRegionId(pharmaciesToUpdate.region_id);
        setCompanyName(pharmaciesToUpdate.company_name);
        setContact1(pharmaciesToUpdate.contact1);
        setEmail(pharmaciesToUpdate.email);
        setAddress(pharmaciesToUpdate.address);
        setBrandName(pharmaciesToUpdate.brand_name);
        setInterBranchTurnover(pharmaciesToUpdate.inter_branch_turnover);
        setPharmacyDirector(pharmaciesToUpdate.pharmacy_director);
      }
      fetchRegionsAndReps();
    }
  }, [pharmaciesToUpdate, open]);

  const fetchRegionsAndReps = async () => {
    try {
      const [repsResponse, regionsResponse] = await Promise.all([
        axiosInstance.get("http://localhost:8000/common/get-users", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }),
        axiosInstance.get("http://localhost:8000/common/get-regions", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }),
      ]);
      setMedReps(repsResponse.data.filter((user) => user.status === "MEDICAL_REPRESENTATIVE"));
      setRegions(regionsResponse.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    // Start with an empty object
    const updatedPharmacy = {};

    // Add only non-empty properties to the updatedPharmacy object
    if (companyName) updatedPharmacy.company_name = companyName;
    if (contact1) updatedPharmacy.contact1 = contact1;
    if (email) updatedPharmacy.email = email;
    if (address) updatedPharmacy.address = address;
    if (brandName) updatedPharmacy.brand_name = brandName;
    if (interBranchTurnover) updatedPharmacy.inter_branch_turnover = interBranchTurnover;
    if (pharmacyDirector) updatedPharmacy.pharmacy_director = pharmacyDirector;
    if (latitude) updatedPharmacy.latitude = latitude.toString();
    if (longitude) updatedPharmacy.longitude = longitude.toString();
    if (region_id) updatedPharmacy.region_id = region_id;
    if (med_rep_id) updatedPharmacy.med_rep_id = med_rep_id;

    // Spread pharmaciesToUpdate to include any other properties that should be updated
    const finalPharmacyUpdate = {
      ...pharmaciesToUpdate,
      ...updatedPharmacy,
    };

    handleSubmit(finalPharmacyUpdate);
    handleClose();
  };

  function LocationMarker() {
    const map = useMapEvents({
      click(e) {
        setLatitude(e.latlng.lat);
        setLongitude(e.latlng.lng);
      },
      // move() {
      //   setLatitude(map.getCenter().lat);
      //   setLongitude(map.getCenter().lng);
      // },
    });

    const handleDragEnd = (e) => {
      const marker = e.target;
      const position = marker.getLatLng();
      setLatitude(position.lat);
      setLongitude(position.lng);
    };

    return latitude !== 0 && longitude !== 0 ? (
      <Marker
        position={[latitude, longitude]}
        draggable={true}
        eventHandlers={{
          dragend: handleDragEnd,
        }}
      ></Marker>
    ) : null;
  }

  return (
    <ModalOpen
      open={open}
      header={<MDTypography>Редактировать Аптеку</MDTypography>}
      body={
        <form onSubmit={handleFormSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <MDInput
                type="text"
                label="Название компании"
                fullWidth
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <MDInput
                type="text"
                label="Контакт 1"
                fullWidth
                value={contact1}
                onChange={(e) => setContact1(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <MDInput
                type="email"
                label="Email"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <MDInput
                type="text"
                label="Адрес"
                fullWidth
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <MDInput
                type="text"
                label="Название бренда"
                fullWidth
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <MDInput
                type="text"
                label="ИНН"
                fullWidth
                value={interBranchTurnover}
                onChange={(e) => setInterBranchTurnover(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <MDInput
                type="text"
                label="Директор аптеки"
                fullWidth
                value={pharmacyDirector}
                onChange={(e) => setPharmacyDirector(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel id="regions-label">Регионы</InputLabel>
                <Select
                  labelId="regions-label"
                  value={region_id}
                  label="Регионы"
                  onChange={(e) => setRegionId(e.target.value)}
                  sx={{ height: "45px" }}
                >
                  {regions.map((region) => (
                    <MenuItem key={region.id} value={region.id}>
                      {region.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={12}>
              <MDBox mb={2} style={{ height: "200px" }}>
                {/* <MapContainer
                  center={[51.505, -0.09]}
                  zoom={13}
                  style={{ height: "100%", width: "100%" }}
                > */}
                <MapContainer
                  center={[latitude || 51.505, longitude || -0.09]} // Default to London coordinates if not set
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
                    setAddress={setAddress}
                  />
                  <LocationMarker />
                  <MapComponent latitude={latitude} longitude={longitude} />
                </MapContainer>
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6}>
              <MDTypography variant="h6">Широта: {latitude}</MDTypography>
            </Grid>
            <Grid item xs={12} md={6}>
              <MDTypography variant="h6">Долгота: {longitude}</MDTypography>
            </Grid>
            <MDBox display="flex" justifyContent="flex-end" mt={3}>
              <Button onClick={handleClose} variant="outlined" style={{ color: "black" }}>
                Закрыть
              </Button>
              <Button
                variant="contained"
                type="submit"
                style={{ marginLeft: "20px", color: "black" }}
              >
                Сохранить
              </Button>
            </MDBox>
          </Grid>
        </form>
      }
    />
  );
};

PharmaciesModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  pharmaciesToUpdate: PropTypes.object.isRequired,
};

export default PharmaciesModal;
