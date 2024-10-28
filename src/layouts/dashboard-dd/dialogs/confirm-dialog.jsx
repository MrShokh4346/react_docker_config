import * as React from "react";
import PropTypes from "prop-types";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import { useSelector } from "react-redux";
import axiosInstance from "services/axiosInstance";

const ConfirmDialog = React.memo(({ isOpen, onClose, planId, planType, onDelete }) => {
  const accessToken = useSelector((state) => state.auth.accessToken);

  const deleted = async (event) => {
    if (planId) {
      event.stopPropagation(); // Stop the row click event from being triggered
      try {
        await axiosInstance.delete(`http://localhost:8000/dd/delete-${planType}/${planId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        onDelete(planId);
        onClose();
      } catch (error) {
        console.error("Failed to delete doctor plan:", error);
      }
    } else {
      onClose();
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Вы уверены что хотите удалить?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="success" onClick={deleted}>
          Да
        </Button>
        <Button variant="contained" color="success" onClick={onClose} autoFocus>
          Нет
        </Button>
      </DialogActions>
    </Dialog>
  );
});

ConfirmDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  planId: PropTypes.number,
  planType: PropTypes.string,
  onDelete: PropTypes.func.isRequired,
};

export default ConfirmDialog;
