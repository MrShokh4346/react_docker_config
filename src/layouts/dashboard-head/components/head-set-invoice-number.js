/* eslint-disable prettier/prettier */
import { useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";
import Alert from "@mui/material/Alert";
import TextField from "@mui/material/TextField";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Authentication layout components
import BasicLayout from "layouts/authentication/components/BasicLayout";
import axiosInstance from "services/axiosInstance";
import { useDispatch } from "react-redux";
import { updateReservationInvoiceNumber } from "../../../redux/reservation/reservationSlice"; // Update with the actual path

function HeadSetInvoiceNumber() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { accessToken } = useSelector((state) => state.auth);
  const location = useLocation();
  const { reservationId, type } = location.state;

  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [message, setMessage] = useState({ color: "", content: "" });
  const [isSubmitting, setIsSubmitting] = useState(false); // New state to track submission

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!reservationId) {
      setMessage({
        color: "error",
        content: "Reservation ID не найден.",
      });
      return;
    }

    try {
      const response = await axiosInstance.put(
        `http://localhost:8000/head/edit-${type}-reservation-invoice-number/${reservationId}?invoice_number=${invoiceNumber}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.status === 200) {
        // Dispatch the action to update the invoice number in Redux
        dispatch(updateReservationInvoiceNumber({ id: reservationId, invoiceNumber }));
        setMessage({ color: "success", content: "С/Ф установлен" });
        setIsSubmitting(true); // Disable the button after clicking

        setTimeout(() => {
          navigate(-1);
        }, 2000);
      }
    } catch (error) {
      console.log(error);
      setMessage({
        color: "error",
        content:
          "Не удалось установить С/Ф. " +
          (error.response?.data?.detail ||
            "Проверьте правильность введенных данных и попробуйте снова."),
      });
    }
  };

  return (
    <BasicLayout>
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
            Изменить номер С/Ф
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          {message.content && <Alert severity={message.color}>{message.content}</Alert>}
          <MDBox component="form" role="form" onSubmit={handleSubmit}>
            <MDBox mb={2}>
              <TextField
                fullWidth
                label="Номер С/Ф"
                variant="outlined"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
              />
            </MDBox>
            <MDBox mt={4} mb={1} display="flex" justifyContent="space-between">
              <MDButton
                variant="contained"
                color="secondary"
                fullWidth
                onClick={() => navigate(-1)} // Navigate back to the previous page
                style={{ marginRight: "10px" }} // Add spacing between the buttons
              >
                Назад
              </MDButton>
              <MDButton
                variant="gradient"
                color="info"
                fullWidth
                type="submit"
                disabled={isSubmitting}
              >
                Отправить
              </MDButton>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </BasicLayout>
  );
}

export default HeadSetInvoiceNumber;
