/* eslint-disable prettier/prettier */
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";
import Alert from "@mui/material/Alert";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Authentication layout components
import BasicLayout from "layouts/authentication/components/BasicLayout";

function DeputyDirectorAddBonus() {
  const navigate = useNavigate();
  const { accessToken } = useSelector((state) => state.auth);
  const location = useLocation();
  const { bonusId, totalBonus, remainingBonus } = location.state || {}; // Add a default value

  const [amount, setAmount] = useState("");
  const [comment, setComment] = useState("");
  const [message, setMessage] = useState({ color: "", content: "" });
  const [isSubmitting, setIsSubmitting] = useState(false); // New state to track submission

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!bonusId) {
      setMessage({
        color: "error",
        content: "Бонус ID не найден.",
      });
      return;
    }
    try {
      const response = await axios.post(
        `http://localhost:8000/mr/paying-bonus/${bonusId}?amount=${amount}&description=${comment}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setMessage({ color: "success", content: "Бонус добавлен" });
      setIsSubmitting(true); // Disable the button after clicking

      setTimeout(() => {
        navigate(-1);
      }, 2000);
    } catch (error) {
      console.log(error);
      setMessage({
        color: "error",
        content:
          "Не удалось добавить бонус. " +
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
            Добавить бонус врачу
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          {message.content && <Alert severity={message.color}>{message.content}</Alert>}
          <MDBox component="form" role="form" onSubmit={handleSubmit}>
            <MDBox mb={2}>
              <MDTypography variant="body1" color="textPrimary">
                Общий бонус: {totalBonus}
              </MDTypography>
              <MDTypography variant="body1" color="textPrimary" mb={2}>
                Остаток: {remainingBonus}
              </MDTypography>
              <MDInput
                type="number"
                label="Сумма бонуса"
                fullWidth
                value={amount}
                onChange={(e) => {
                  const value = parseFloat(e.target.value);
                  if (value >= 0 || e.target.value === "") {
                    setAmount(e.target.value);
                  }
                }}
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="text"
                label="Оставить комментарий"
                fullWidth
                value={comment}
                onChange={(e) => setComment(e.target.value)}
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
                Добавить
              </MDButton>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </BasicLayout>
  );
}

export default DeputyDirectorAddBonus;
