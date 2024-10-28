import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import ModalOpen from "../modal";
import Button from "@mui/material/Button";
import MDTypography from "components/MDTypography";
import MDBox from "components/MDBox";
import { useSelector } from "react-redux";
import axiosInstance from "services/axiosInstance";

function BonusModal({ open, handleClose, id }) {
  const [bonusHistory, setBonusHistory] = useState([]);
  const accessToken = useSelector((state) => state.auth.accessToken);

  const fetchRegionsAndReps = async () => {
    try {
      const response = await axiosInstance.get(`http://localhost:8000/mr/get-bonus-history/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setBonusHistory(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (open) {
      fetchRegionsAndReps();
    }
  }, [open, id, accessToken]);
  return (
    <ModalOpen
      open={open}
      header={<MDTypography>История бонусов</MDTypography>}
      body={
        <MDBox>
          {bonusHistory.map((history, index) => (
            <MDBox key={index} component="div" style={{ marginBottom: "10px" }}>
              <MDTypography variant="body2">{history.detail}</MDTypography>
            </MDBox>
          ))}
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
          </MDBox>
        </MDBox>
      }
    />
  );
}

BonusModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func,
  id: PropTypes.number.isRequired,
};

export default BonusModal;
