import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Snackbar,
  Alert,
} from "@mui/material";
import axiosInstance from "services/axiosInstance";
import { useSelector } from "react-redux";

function EditWholesaleCompanyDialog({ open, handleClose, companyToUpdate, onUpdate }) {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [region_id, setRegionId] = useState(companyToUpdate?.region?.id || "");
  const [regions, setRegions] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const accessToken = useSelector((state) => state.auth.accessToken);

  const fetchRegions = async () => {
    try {
      const response = await axiosInstance.get("http://localhost:8000/common/get-regions", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      setRegions(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchRegions();
  }, [open]);

  useEffect(() => {
    if (companyToUpdate) {
      setName(companyToUpdate.name);
      setContact(companyToUpdate.contact);
      setRegionId(companyToUpdate.region.id);
    }
  }, [companyToUpdate]);

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleContactChange = (event) => {
    setContact(event.target.value);
  };

  const handleRegionChange = (event) => {
    setRegionId(event.target.value);
  };

  const handleFormSubmit = async () => {
    try {
      await axiosInstance.patch(
        `http://localhost:8000/ws/update-wholesale/${companyToUpdate.id}`,
        {
          name,
          contact,
          region_id,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      onUpdate({
        id: companyToUpdate.id,
        name,
        contact,
        region: {
          id: region_id,
          name: regions.find((region) => region.id === region_id).name,
        },
      });
      setSnackbar({ open: true, message: "Company updated successfully!", severity: "success" });
      handleClose();
    } catch (error) {
      console.error("Failed to update wholesale company", error);
      setSnackbar({ open: true, message: "Failed to update company", severity: "error" });
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar({ open: false, message: "", severity: "success" });
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit Wholesale Company</DialogTitle>
        <DialogContent>
          <DialogContentText>Please update the details of the wholesale company.</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            type="text"
            fullWidth
            value={name}
            onChange={handleNameChange}
          />
          <TextField
            margin="dense"
            label="Contact"
            type="text"
            fullWidth
            value={contact}
            onChange={handleContactChange}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel id="regions-label">Регион</InputLabel>
            <Select
              value={region_id}
              onChange={handleRegionChange}
              label="Регионы"
              sx={{ height: "45px" }}
              labelId="regions-label"
            >
              {regions.map((region) => (
                <MenuItem key={region.id} value={region.id}>
                  {region.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleFormSubmit}>Update</Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}

EditWholesaleCompanyDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  companyToUpdate: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    contact: PropTypes.string,
    region: PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
    }),
  }),
  onUpdate: PropTypes.func.isRequired,
};

export default EditWholesaleCompanyDialog;
