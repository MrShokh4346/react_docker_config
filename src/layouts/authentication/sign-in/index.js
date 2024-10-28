import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

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

// Images
import bgImage from "assets/images/sign-in-cover.jpg";
import { setCredentials } from "../../../redux/auth/authSlice";
import roleBasedRedirect from "constants/roleBasedDashboards";

function Basic() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, userRole } = useSelector((state) => state.auth);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState({ color: "", content: "" });

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated && userRole) {
      // Look up the appropriate redirect path based on the user's role
      const redirectPath = roleBasedRedirect[userRole];
      navigate(redirectPath);
    }
  }, [isAuthenticated, userRole, navigate]);

  const handleLogin = async (event) => {
    event.preventDefault(); // Prevent default form submission behavior
    try {
      const response = await axios.post("http://localhost:8000/login", {
        username: username,
        password: password,
      });
      // On successful login
      dispatch(
        setCredentials({
          accessToken: response.data.access_token,
          userRole: response.data.status,
          username,
          userId: response.data.id,
          regionId: response.data.region_id,
        })
      );

      setMessage({ color: "success", content: "Вход выполнен успешно! Перенаправление..." });
    } catch (error) {
      // Handle errors here
      setMessage({
        color: "error",
        content:
          "Не удалось войти в систему. " +
          (error.response?.data?.detail ||
            "Проверьте свое имя пользователя и пароль и попробуйте снова."),
      });
    }
  };

  return (
    <BasicLayout image={bgImage}>
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
            Вход
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          {message.content && <Alert severity={message.color}>{message.content}</Alert>}
          <MDBox component="form" role="form" onSubmit={handleLogin}>
            <MDBox mb={2}>
              <MDInput
                type="text"
                label="Имя пользователя"
                fullWidth
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="password"
                label="Пароль"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </MDBox>
            <MDBox mt={4} mb={1}>
              <MDButton variant="gradient" color="info" fullWidth type="submit">
                Войти
              </MDButton>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </BasicLayout>
  );
}

export default Basic;
