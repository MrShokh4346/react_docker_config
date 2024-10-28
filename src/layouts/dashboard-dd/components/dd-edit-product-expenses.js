/* eslint-disable prettier/prettier */
import { useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

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

function DeputyDirectorEditProductExpenses() {
  const navigate = useNavigate();
  const location = useLocation();
  const { accessToken } = useSelector((state) => state.auth);
  const [marketingExpenses, setMarketingExpenses] = useState("");
  const [salaryExpenses, setSalaryExpenses] = useState("");
  const [message, setMessage] = useState({ color: "", content: "" });
  const [isSubmitting, setIsSubmitting] = useState(false); // New state to track submission

  const productId = location.state;

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission

    try {
      // Call the API with authorization header
      const response = await axios.get(
        `http://localhost:8000/dd/set-product-expenses/${productId}?marketing_expenses=${marketingExpenses}&salary_expenses=${salaryExpenses}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      // Handle a successful response
      setMessage({ color: "success", content: "Расходы на продукт обновлены" });
      setIsSubmitting(true); // Disable the button after clicking
      // Optional: Redirect after a delay
      setTimeout(() => {
        navigate(-1);
      }, 2000);
    } catch (error) {
      console.log(error);
      setMessage({
        color: "error",
        content:
          "Не удалось обновить расходы на продукт. " +
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
            Обновить расходы на продукт
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          {message.content && <Alert severity={message.color}>{message.content}</Alert>}
          <MDBox component="form" role="form" onSubmit={handleSubmit}>
            <MDBox mb={2}>
              <MDInput
                type="number"
                label="Расходы на маркетинг"
                fullWidth
                value={marketingExpenses}
                onChange={(e) => {
                  const value = parseFloat(e.target.value);
                  if (value >= 0 || e.target.value === "") {
                    setMarketingExpenses(e.target.value);
                  }
                }}
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="number"
                label="Расходы на зарплату"
                fullWidth
                value={salaryExpenses}
                onChange={(e) => {
                  const value = parseFloat(e.target.value);
                  if (value >= 0 || e.target.value === "") {
                    setSalaryExpenses(e.target.value);
                  }
                }}
              />
            </MDBox>
            <MDBox mt={4} mb={1}>
              <MDButton
                variant="gradient"
                color="info"
                fullWidth
                type="submit"
                disabled={isSubmitting}
              >
                Обновить
              </MDButton>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </BasicLayout>
  );
}

export default DeputyDirectorEditProductExpenses;
