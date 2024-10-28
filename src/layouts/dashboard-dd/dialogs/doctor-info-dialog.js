import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  IconButton,
  Tab,
  Tabs,
  Box,
  Grid,
  CircularProgress,
} from "@mui/material";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CloseIcon from "@mui/icons-material/Close";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import OrganizationIcon from "@mui/icons-material/Business";
import doctorImage from "assets/images/doctor.png";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import CustomTooltip from "services/customTooltip";
import AttachedProductsTable from "../table/doctor-products-table";
import AttachedPharmaciesTable from "../table/doctor-pharmacies-table";

// Fix for marker icons not showing in Leaflet
import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

L.Marker.prototype.options.icon = DefaultIcon;

const DoctorInfoDialog = ({ open, onClose, doctorId }) => {
  const [tabValue, setTabValue] = useState(0);
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [tooltipContent, setTooltipContent] = useState(null);

  useEffect(() => {
    if (doctorId && open) {
      setLoading(true);
      axios
        .get(`http://localhost:8000/mr/get-doctor/${doctorId}`)
        .then((response) => {
          console.log(response.data);
          setDoctor(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Failed to fetch doctor details:", error);
          setLoading(false);
        });
    }
  }, [doctorId, open]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleTooltipOpen = (content) => {
    setTooltipContent(content);
    setTooltipOpen(true);
  };

  const handleTooltipClose = () => {
    setTooltipOpen(false);
  };

  const handleDialogClose = () => {
    handleTooltipClose();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleDialogClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {doctor ? "Доктор" : "Loading..."}
        <IconButton
          aria-label="close"
          onClick={handleDialogClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <CircularProgress />
          </Box>
        ) : doctor ? (
          <>
            <Grid container spacing={2}>
              <Grid item xs={3}>
                <img src={doctorImage} alt="Doctor" width="180" height="180" />
                <Typography variant="h6">{doctor.full_name}</Typography>
                <Typography variant="subtitle1">{doctor.speciality.name}</Typography>
              </Grid>
              <Grid item xs={9}>
                <Box display="flex" alignItems="center" mt={2}>
                  <PhoneIcon />
                  <Typography variant="body1" ml={1}>
                    {doctor.contact1}
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" mt={2}>
                  <LocationOnIcon />
                  <Typography
                    variant="body1"
                    ml={1}
                    onClick={() =>
                      handleTooltipOpen(
                        <>
                          <Typography variant="body1" fontWeight="bold" mb={2}>
                            Location
                          </Typography>
                          <MapContainer
                            center={[
                              doctor.medical_organization?.latitude,
                              doctor.medical_organization?.longitude,
                            ]}
                            zoom={13}
                            style={{ height: "300px", width: "100%" }}
                          >
                            <TileLayer
                              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            />
                            <Marker
                              position={[
                                doctor.medical_organization?.latitude,
                                doctor.medical_organization?.longitude,
                              ]}
                            >
                              <Popup>{doctor.full_name}</Popup>
                            </Marker>
                          </MapContainer>
                        </>
                      )
                    }
                    sx={{ textDecoration: "underline", cursor: "pointer" }}
                  >
                    Location
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" mt={2}>
                  <MedicalServicesIcon />
                  <Typography variant="body1" ml={1}>
                    {doctor.category.name}
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" mt={2}>
                  <OrganizationIcon />
                  <Typography variant="body1" ml={1}>
                    {doctor.medical_organization.name}
                  </Typography>
                </Box>
                <CustomTooltip
                  open={tooltipOpen}
                  onClose={handleTooltipClose}
                  content={tooltipContent}
                />
              </Grid>
            </Grid>
            <Tabs value={tabValue} onChange={handleTabChange} aria-label="tabs">
              <Tab label="Лист Продуктов" />
              <Tab label="Лист Аптек" />
            </Tabs>
            <TabPanel value={tabValue} index={0}>
              <AttachedProductsTable doctorId={doctorId} />
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
              <AttachedPharmaciesTable doctorId={doctorId} />
            </TabPanel>
          </>
        ) : (
          <Typography variant="body1">Failed to load doctor details.</Typography>
        )}
      </DialogContent>
    </Dialog>
  );
};

const TabPanel = ({ children, value, index, ...other }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
};

DoctorInfoDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  doctorId: PropTypes.number,
};

TabPanel.propTypes = {
  children: PropTypes.node,
  value: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired,
};

export default DoctorInfoDialog;
