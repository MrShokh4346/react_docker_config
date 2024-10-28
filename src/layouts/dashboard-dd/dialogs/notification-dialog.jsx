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
import { useSelector } from "react-redux";
import { format } from "date-fns";
import axiosInstance from "services/axiosInstance";
import CloseIcon from "@mui/icons-material/Close";

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
  // backgroundColor: "#f0f0f0",
  borderRadius: "10px",
  marginBottom: "10px",
});

const StyledTextField = styled(Box)({
  marginBottom: "10px",
});

// eslint-disable-next-line react/prop-types
const NotificationDialog = React.memo(({ open, onClose, notificationId }) => {
  const [notificationData, setNotificationData] = useState(null);
  const accessToken = useSelector((state) => state.auth.accessToken);

  useEffect(() => {
    if (open && notificationId) {
      const fetchVisitData = async () => {
        try {
          const { data } = await axiosInstance.get(
            `http://localhost:8000/common/get-notofication/${notificationId}`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
          setNotificationData(data);
        } catch (error) {
          console.error("Failed to fetch notification data:", error);
        }
      };

      fetchVisitData();
    }
  }, [open, notificationId, accessToken]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <StyledDialogContent>
        <DialogTitle align="center">
          Уведомление
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <Typography variant="subtitle1" align="right">
          дата создании:{" "}
          {notificationData?.date
            ? format(new Date(notificationData?.date), "MM-dd-yy HH:mm")
            : "N/A"}
        </Typography>

        <StyledBox>
          <Box display="flex">
            <Box>
              <Typography>Автор: {notificationData?.author}</Typography>
              <Typography variant="subtitle2">
                {notificationData?.doctor
                  ? `Доктор: ${notificationData?.doctor.full_name}`
                  : notificationData?.pharmacy
                  ? `Аптека: ${notificationData?.pharmacy?.company_name}`
                  : `Оптовая компания: ${notificationData?.wholesale?.company_name}`}
              </Typography>
            </Box>
          </Box>
        </StyledBox>

        <StyledTextField>
          <Typography variant="subtitle2">Тема:</Typography>
          <Typography variant="body1">{notificationData?.theme || "N/A"}</Typography>
        </StyledTextField>

        <StyledTextField>
          <Typography variant="subtitle2">Описание</Typography>
          <Typography sx={{ backgroundColor: "white" }} variant="body1">
            {notificationData?.description || "N/A"}
          </Typography>
        </StyledTextField>
      </StyledDialogContent>
    </Dialog>
  );
});

export default NotificationDialog;
