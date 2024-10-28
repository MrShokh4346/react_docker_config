import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import ModalOpen from "../modal";
import Button from "@mui/material/Button";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import SearchControl from "../../../../../services/geoSearchController";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";

// Authentication layout components
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import axiosInstance from "services/axiosInstance";
import { useSelector } from "react-redux";
import userRoles from "constants/userRoles";

function MedorgModal({ open, handleClose, handleSubmit, medorgToUpdate }) {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [region_id, setRegionId] = useState(medorgToUpdate?.region_id || "");
  const [regions, setRegions] = useState([]);
  const accessToken = useSelector((state) => state.auth.accessToken);

  useEffect(() => {
    if (open) {
      if (medorgToUpdate) {
        setName(medorgToUpdate.name);
        setAddress(medorgToUpdate.address);
        setLatitude(medorgToUpdate.latitude);
        setLongitude(medorgToUpdate.longitude);
        setRegionId(medorgToUpdate.region_id);
      }
      fetchRegionsAndReps();
    }
  }, [medorgToUpdate, open]);

  const fetchRegionsAndReps = async () => {
    try {
      const [regionsResponse] = await Promise.all([
        axiosInstance.get("http://localhost:8000/common/get-regions", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }),
      ]);
      setRegions(regionsResponse.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    const updatedMedorg = {
      id: medorgToUpdate.id,
      name,
      address,
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      region_id,
    };
    handleSubmit(updatedMedorg);
    handleClose();
    // Trigger a refresh of data
    // location.reload();
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
      header={<MDTypography>Обновить производственные компании</MDTypography>}
      body={
        <MDBox>
          <form onSubmit={handleFormSubmit}>
            <MDBox mb={2}>
              <MDInput
                type="text"
                label="Название"
                fullWidth
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </MDBox>
            <MDBox mb={2}>
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
            </MDBox>
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
                  setAddress={setAddress}
                />
                <LocationMarker />
              </MapContainer>
            </MDBox>
            <MDBox mb={2}>
              <MDTypography variant="h6">Широта: {latitude}</MDTypography>
              <MDTypography variant="h6">Долгота: {longitude}</MDTypography>
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="text"
                label="Адрес"
                fullWidth
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </MDBox>
            <MDBox
              component="div"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Button onClick={handleClose} size="small" variant="outlined">
                <MDTypography variant="button">Отмена</MDTypography>
              </Button>
              <Button size="small" variant="contained" type="submit">
                <MDTypography style={{ color: "white" }} variant="button">
                  Сохранить
                </MDTypography>
              </Button>
            </MDBox>
          </form>
        </MDBox>
      }
    />
  );
}

MedorgModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  medorgToUpdate: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    address: PropTypes.string,
    latitude: PropTypes.string,
    longitude: PropTypes.string,
    region_id: PropTypes.number,
    med_rep_id: PropTypes.number,
    med_rep_name: PropTypes.string,
  }),
};

export default MedorgModal;
