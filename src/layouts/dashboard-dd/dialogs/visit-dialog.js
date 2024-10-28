import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Box,
  Typography,
  IconButton,
} from "@mui/material";
import { styled } from "@mui/system";
import axios from "axios";
import { useSelector } from "react-redux";
import { format } from "date-fns";
import doctorImage from "assets/images/doctor.png";
import pharmacyImage from "assets/images/pharmacy.png";

const StyledDialogContent = styled(DialogContent)({
  borderRadius: "15px",
});

const StyledButton = styled(Button)({
  width: "45%",
  margin: "0 2.5%",
  color: "#000",
});

const StyledBox = styled(Box)({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "10px",
  backgroundColor: "#f0f0f0",
  borderRadius: "10px",
  marginBottom: "10px",
});

const StyledTextField = styled(Box)({
  marginBottom: "10px",
});

// eslint-disable-next-line react/prop-types
const VisitDialog = React.memo(({ open, onClose, visitId, visitType }) => {
  const [visitData, setVisitData] = useState(null);
  const accessToken = useSelector((state) => state.auth.accessToken);

  useEffect(() => {
    if (open && visitId !== -1 && visitType) {
      const fetchVisitData = async () => {
        try {
          const response = await axios.get(
            `http://localhost:8000/mr/get-${visitType}-visit-plan/${visitId}`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
          console.log(response.data);
          setVisitData(response.data);
        } catch (error) {
          console.error("Failed to fetch visit data:", error);
        }
      };

      fetchVisitData();
    }
  }, [open, visitId, visitType, accessToken]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <StyledDialogContent>
        <DialogTitle align="center">
          Посещение {visitType === "doctor" ? "доктора" : "аптеки"}
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            X
          </IconButton>
        </DialogTitle>
        <Typography variant="subtitle1" align="center">
          Запланированная дата:{" "}
          {visitData?.date ? format(new Date(visitData.date), "MM-dd-yy HH:mm") : "N/A"}
        </Typography>

        <StyledBox>
          <Box display="flex" alignItems="center">
            <Box mr={2}>
              <img
                src={visitType === "doctor" ? doctorImage : pharmacyImage}
                alt="Doctor"
                width="80"
                height="80"
              />
            </Box>
            <Box>
              <Typography>
                {visitType === "doctor"
                  ? visitData?.doctor?.full_name
                  : visitData?.pharmacy?.company_name || "N/A"}
              </Typography>
              <Typography variant="caption">
                {visitType === "doctor"
                  ? visitData?.doctor?.medical_organization?.name
                  : visitData?.pharmacy?.contact1 || "N/A"}
              </Typography>
            </Box>
          </Box>
        </StyledBox>

        <StyledTextField>
          <Typography variant="subtitle2">Тема посещения</Typography>
          <Typography variant="body1">{visitData?.theme || "N/A"}</Typography>
        </StyledTextField>

        <StyledTextField>
          <Typography variant="subtitle2">Описание</Typography>
          <Typography variant="body1">{visitData?.description || "N/A"}</Typography>
        </StyledTextField>

        <StyledTextField>
          <Typography variant="subtitle2">Статус:</Typography>
          <Typography variant="body1">
            {visitData?.status ? "Сделано" : visitData?.postpone ? "Отложено" : "В очереди"}
          </Typography>
        </StyledTextField>
      </StyledDialogContent>
    </Dialog>
  );
});

export default VisitDialog;
