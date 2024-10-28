import { useEffect, useState } from "react";
import ModalOpen from "../modal";
import PropTypes from "prop-types";

import MDTypography from "components/MDTypography";
import { Button, Grid } from "@mui/material";
import MDBox from "components/MDBox";
import MDInput from "components/MDInput";
import axiosInstance from "services/axiosInstance";
import { useSelector } from "react-redux";
function PlanModal({ open, handleClose, planToUpdate }) {
  const [plan_amount, setPlan_amount] = useState(0);
  const { accessToken } = useSelector((state) => state.auth);

  useEffect(() => {
    console.log(planToUpdate);
    setPlan_amount(planToUpdate.plan_amount);
  }, [planToUpdate, open]);

  const handleSubmite = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.put(
        `http://localhost:8000/dd/update-user-product-plan/${planToUpdate.plan_id}?amount=${plan_amount}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log(response.data);
      handleClose();
      location.reload();
    } catch (error) {
      console.log(error);
      handleClose();
    }
  };

  return (
    <ModalOpen
      open={open}
      header={<MDTypography> Редактировать план</MDTypography>}
      body={
        <form onSubmit={handleSubmite}>
          <MDTypography>{planToUpdate.product}:</MDTypography>
          <Grid item xs={12}>
            <MDBox mb={2}>
              <MDInput
                fullWidth
                type="number"
                label="ПЛАН"
                value={plan_amount}
                onChange={(e) => {
                  const value = parseFloat(e.target.value);
                  if (value >= 0 || e.target.value === "") {
                    setPlan_amount(e.target.value);
                  }
                }}
              />
            </MDBox>
          </Grid>
          <MDBox
            component="div"
            style={{
              display: "flex",
              justifyContent: "end",
              gap: "15px",
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
      }
    />
  );
}
export default PlanModal;

PlanModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  planToUpdate: PropTypes.object.isRequired,
};
