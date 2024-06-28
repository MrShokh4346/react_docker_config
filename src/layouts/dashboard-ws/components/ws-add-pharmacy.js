import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import SearchControl from "../../../services/geoSearchController"; // Импорт компонента SearchControl

// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Alert from "@mui/material/Alert";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Authentication layout components
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import axiosInstance from "services/axiosInstance";

// Исправление для не отображающейся иконки маркера по умолчанию в Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

function WholesaleAddPharmacy() {
  const navigate = useNavigate();
  const location = useLocation();

  const { accessToken } = useSelector((state) => state.auth);
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [regionId, setRegionId] = useState("");
  const [regions, setRegions] = useState([]);
  const [medRepId, setMedRepId] = useState("");
  const [medReps, setMedReps] = useState([]);
  console.log(location.state);

  const [pharmacyData, setPharmacyData] = useState({
    company_name: "",
    contact1: "",
    contact2: "",
    email: "",
    address: "",
    brand_name: "",
    bank_account_number: "",
    inter_branch_turnover: "",
    classification_of_economic_activities: "",
    VAT_payer_code: "",
    pharmacy_director: "",
  });

  const [message, setMessage] = useState({ color: "", content: "" });

  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const response = await axios.get(`https://it-club.uz/common/get-regions`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const regions = response.data;
        setRegions(regions);
      } catch (error) {
        console.error("Не удалось получить регионы:", error);
      }
    };

    fetchRegions();
  }, [accessToken]);

  useEffect(() => {
    const fetchMedicalRepresentatives = async () => {
      try {
        const response = await axiosInstance.get(`common/get-medical-representatives`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const medReps = response.data;
        setMedReps(medReps);
      } catch (error) {
        console.error("Не удалось получить медицинские представители:", error);
      }
    };

    fetchMedicalRepresentatives();
  }, [accessToken]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axiosInstance.post(
        `mr/add-pharmacy?user_id=${medRepId}`,
        {
          ...pharmacyData,
          latitude: latitude.toString(),
          longitude: longitude.toString(),
          region_id: parseInt(regionId, 10),
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      setMessage({ color: "success", content: "Аптека успешно добавлена" });
      setTimeout(() => navigate(-1), 2000);
    } catch (error) {
      setMessage({
        color: "error",
        content:
          "Не удалось добавить аптеку. " +
          (error.response?.data?.detail || "Пожалуйста, проверьте свои данные и попробуйте снова."),
      });
    }
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
    setPharmacyData({
      ...pharmacyData,
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
            Добавить аптеку
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          {message.content && <Alert severity={message.color}>{message.content}</Alert>}
          <MDBox component="form" role="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel id="medreps-label">Медицинские представители</InputLabel>
                  <Select
                    labelId="medreps-label"
                    value={medRepId}
                    label="Медицинские представители"
                    onChange={(e) => setMedRepId(e.target.value)}
                    sx={{ height: "45px" }}
                  >
                    {medReps.map((medRep) => (
                      <MenuItem key={medRep.id} value={medRep.id}>
                        {medRep.full_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <MDInput
                  type="text"
                  label="Название компании"
                  fullWidth
                  name="company_name"
                  value={pharmacyData.company_name}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <MDInput
                  type="text"
                  label="Контакт 1"
                  fullWidth
                  name="contact1"
                  value={pharmacyData.contact1}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <MDInput
                  type="text"
                  label="Контакт 2"
                  fullWidth
                  name="contact2"
                  value={pharmacyData.contact2}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <MDInput
                  type="email"
                  label="Email"
                  fullWidth
                  name="email"
                  value={pharmacyData.email}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <MDInput
                  type="text"
                  label="Адрес"
                  fullWidth
                  name="address"
                  value={pharmacyData.address}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <MDInput
                  type="text"
                  label="Название бренда"
                  fullWidth
                  name="brand_name"
                  value={pharmacyData.brand_name}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <MDInput
                  type="text"
                  label="Номер банковского счета"
                  fullWidth
                  name="bank_account_number"
                  value={pharmacyData.bank_account_number}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <MDInput
                  type="text"
                  label="Оборот между филиалами"
                  fullWidth
                  name="inter_branch_turnover"
                  value={pharmacyData.inter_branch_turnover}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <MDInput
                  type="text"
                  label="Классификация экономических видов деятельности"
                  fullWidth
                  name="classification_of_economic_activities"
                  value={pharmacyData.classification_of_economic_activities}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <MDInput
                  type="text"
                  label="Код плательщика НДС"
                  fullWidth
                  name="VAT_payer_code"
                  value={pharmacyData.VAT_payer_code}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <MDInput
                  type="text"
                  label="Директор аптеки"
                  fullWidth
                  name="pharmacy_director"
                  value={pharmacyData.pharmacy_director}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel id="regions-label">Регионы</InputLabel>
                  <Select
                    labelId="regions-label"
                    value={regionId}
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
              </Grid>
              <Grid item xs={12} md={6}>
                <MDTypography variant="h6">Широта: {latitude}</MDTypography>
              </Grid>
              <Grid item xs={12} md={6}>
                <MDTypography variant="h6">Долгота: {longitude}</MDTypography>
              </Grid>
            </Grid>
            <MDBox mt={4} mb={1}>
              <MDButton variant="gradient" color="info" fullWidth type="submit">
                Добавить
              </MDButton>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </DashboardLayout>
  );
}

export default WholesaleAddPharmacy;
