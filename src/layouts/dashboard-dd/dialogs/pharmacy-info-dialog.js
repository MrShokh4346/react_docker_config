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
import BusinessIcon from "@mui/icons-material/Business";
import InfoIcon from "@mui/icons-material/Info";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import pharmacyImage from "assets/images/pharmacy.png";

// Fix for marker icons not showing in Leaflet
import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import CustomTooltip from "services/customTooltip";
import PharmacyBalanceInStockTable from "../table/pharmacy-balance-table";
import PharmacyDoctorsListTable from "../table/pharmacy-doctors-table";
// import AttachedProductsTable from "../table/pharmacy-attached-products";
// import AttachedDoctorsTable from "../table/pharmacy-attached-doctors";

let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

L.Marker.prototype.options.icon = DefaultIcon;

const PharmacyInfoDialog = ({ open, onClose, pharmacyId }) => {
  const [tabValue, setTabValue] = useState(0);
  const [pharmacy, setPharmacy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [tooltipContent, setTooltipContent] = useState(null);

  useEffect(() => {
    if (pharmacyId && open) {
      setLoading(true);
      axios
        .get(`http://localhost:8000/mr/get-pharmacy/${pharmacyId}`)
        .then((response) => {
          setPharmacy(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Failed to fetch pharmacy details:", error);
          setLoading(false);
        });
    }
  }, [pharmacyId, open]);

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
        {pharmacy ? "Аптека" : "Loading..."}
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
        ) : pharmacy ? (
          <>
            <Grid container spacing={2}>
              <Grid item xs={3}>
                <img src={pharmacyImage} alt="Pharmacy" width="180" height="180" />
                <Typography variant="h6">{pharmacy.company_name}</Typography>
                <Typography variant="subtitle1">{pharmacy.pharmacy_director}</Typography>
              </Grid>
              <Grid item xs={9}>
                <Box display="flex" alignItems="center" mt={2}>
                  <PhoneIcon />
                  <Typography variant="body1" ml={1}>
                    {pharmacy.contact1}
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
                            {pharmacy.address}
                          </Typography>
                          <MapContainer
                            center={[pharmacy.latitude, pharmacy.longitude]}
                            zoom={13}
                            style={{ height: "300px", width: "100%" }}
                          >
                            <TileLayer
                              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            />
                            <Marker position={[pharmacy.latitude, pharmacy.longitude]}>
                              <Popup>{pharmacy.company_name}</Popup>
                            </Marker>
                          </MapContainer>
                        </>
                      )
                    }
                    sx={{ textDecoration: "underline", cursor: "pointer" }}
                  >
                    {pharmacy.address}
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" mt={2}>
                  <BusinessIcon />
                  <Typography variant="body1" ml={1}>
                    {pharmacy.company_name}
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" mt={2} position="relative">
                  <InfoIcon />
                  <Typography
                    variant="body1"
                    ml={1}
                    onClick={() =>
                      handleTooltipOpen(
                        <Box>
                          <Typography display="inline">Компания: </Typography>
                          <Typography display="inline" fontWeight="bold">
                            {pharmacy.company_name}
                          </Typography>
                          <br />
                          <Typography display="inline">Адрес: </Typography>
                          <Typography display="inline" fontWeight="bold">
                            {pharmacy.address}
                          </Typography>
                          <br />
                          <Typography display="inline">Банковский счет: </Typography>
                          <Typography display="inline" fontWeight="bold">
                            {pharmacy.bank_account_number}
                          </Typography>
                          <br />
                          <Typography display="inline">ИНН: </Typography>
                          <Typography display="inline" fontWeight="bold">
                            {pharmacy.inter_branch_turnover}
                          </Typography>
                          <br />
                          <Typography display="inline">ОКЭД: </Typography>
                          <Typography display="inline" fontWeight="bold">
                            {pharmacy.classification_of_economic_activities}
                          </Typography>
                          <br />
                          <Typography display="inline">Код плательщика НДС: </Typography>
                          <Typography display="inline" fontWeight="bold">
                            {pharmacy.VAT_payer_code}
                          </Typography>
                          <br />
                          <Typography display="inline">Директор: </Typography>
                          <Typography display="inline" fontWeight="bold">
                            {pharmacy.pharmacy_director}
                          </Typography>
                        </Box>
                      )
                    }
                    sx={{ textDecoration: "underline", cursor: "pointer" }}
                  >
                    Реквизиты (банковские данные)
                  </Typography>
                  <CustomTooltip
                    open={tooltipOpen}
                    onClose={handleTooltipClose}
                    content={tooltipContent}
                  />
                </Box>
              </Grid>
            </Grid>
            <Tabs value={tabValue} onChange={handleTabChange} aria-label="tabs">
              <Tab label="Продукты" />
              <Tab label="Врачи" />
              <Tab label="Остаток на складе" />
            </Tabs>
            <TabPanel value={tabValue} index={0}>
              <Typography variant="body1">В разработке.</Typography>
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
              <PharmacyDoctorsListTable pharmacyId={pharmacyId} />
            </TabPanel>
            <TabPanel value={tabValue} index={2}>
              <PharmacyBalanceInStockTable pharmacyId={pharmacyId} />
            </TabPanel>
          </>
        ) : (
          <Typography variant="body1">Failed to load pharmacy details.</Typography>
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

PharmacyInfoDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  pharmacyId: PropTypes.number,
};

TabPanel.propTypes = {
  children: PropTypes.node,
  value: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired,
};

export default PharmacyInfoDialog;
