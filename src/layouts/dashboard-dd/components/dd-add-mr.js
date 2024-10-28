/* eslint-disable prettier/prettier */
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";
import Alert from "@mui/material/Alert";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Authentication layout components
import BasicLayout from "layouts/authentication/components/BasicLayout";
import userRoles from "constants/userRoles";

function DeputyDirectorAddMedicalRepresentative() {
  const navigate = useNavigate();
  const location = useLocation();
  const { accessToken, userRole } = useSelector((state) => state.auth);
  const [full_name, setFullname] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [selectedFFM, setSelectedFFM] = useState(null); // State to track the selected Field Force Manager
  const [region_manager_id, setRegionalManagerId] = useState(""); // State to track the selected Regional Manager
  const [fieldForceManagers, setFieldForceManagers] = useState([]); // State to store the list of Field Force Managers
  const [regionalManagers, setRegionalManagers] = useState([]); // State to store the list of Regional Managers
  const [isSubmitting, setIsSubmitting] = useState(false); // New state to track submission
  const [message, setMessage] = useState({ color: "", content: "" }); // State to store the message to be displayed
  const user = location.state || {}; // Retrieve user information from the location state

  const path = userRole === userRoles.DEPUTY_DIRECTOR ? "dd" : "pm"; // different api for register

  // useEffect to fetch Field Force Managers when the component mounts or when accessToken changes
  useEffect(() => {
    const fetchFieldForceManagers = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/common/get-users-by-username?username=${user.username}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`, // Set the authorization header with the access token
            },
          }
        );
        const fieldForceManagers = response.data.filter(
          (user) => user.status === userRoles.FIELD_FORCE_MANAGER // Filter users to get only Field Force Managers
        );
        setFieldForceManagers(fieldForceManagers); // Update the state with the fetched Field Force Managers
      } catch (error) {
        console.error("Не удалось получить пользователей:", error); // Log any errors that occur during the fetch
      }
    };

    fetchFieldForceManagers(); // Call the fetch function
  }, [accessToken]);

  // useEffect to fetch Regional Managers when the selectedFFM state changes
  useEffect(() => {
    const getRegionalManagers = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/common/get-users-by-username?username=${selectedFFM.username}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`, // Set the authorization header with the access token
            },
          }
        );
        const regionalManagers = response.data.filter(
          (user) => user.status === userRoles.REGIONAL_MANAGER // Filter users to get only Regional Managers
        );
        setRegionalManagers(regionalManagers); // Update the state with the fetched Regional Managers
      } catch (error) {
        console.error("Не удалось получить пользователей:", error); // Log any errors that occur during the fetch
      }
    };

    if (selectedFFM) {
      getRegionalManagers(); // Call the fetch function if a Field Force Manager is selected
    }
  }, [selectedFFM]);

  // Function to handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission

    const region_manager_region = regionalManagers.find((rm) => rm.id == region_manager_id).region
      .id;

    // Define the request payload
    const userData = {
      full_name,
      username,
      password,
      ffm_id: selectedFFM.id,
      product_manager_id: user.id,
      region_manager_id,
      region_id: region_manager_region,
      status: userRoles.MEDICAL_REPRESENTATIVE,
    };

    try {
      // Call the API with authorization header
      const response = await axios.post(
        `http://localhost:8000/${path}/register-for-${path}`,
        userData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`, // Set the authorization header with the access token
          },
        }
      );

      // Handle a successful response
      setMessage({ color: "success", content: "Пользователь успешно зарегистрирован!" });
      setIsSubmitting(true); // Disable the button after clicking

      // Optional: Redirect after a delay
      setTimeout(() => {
        navigate(-1);
      }, 2000);
    } catch (error) {
      console.log(error);
      // Handle errors gracefully
      setMessage({
        color: "error",
        content:
          "Не удалось зарегистрировать пользователя. " +
          (error.response?.data?.detail ||
            "Проверьте правильность введенных данных и попробуйте снова."), // Display an error message
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
            Добавить медицинского представителя
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          {message.content && <Alert severity={message.color}>{message.content}</Alert>}
          <MDBox component="form" role="form" onSubmit={handleSubmit}>
            <MDBox mb={2}>
              <MDInput
                type="text"
                label="Полное имя"
                fullWidth
                value={full_name}
                onChange={(e) => setFullname(e.target.value)} // Update the fullname state
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="text"
                label="Имя пользователя"
                fullWidth
                value={username}
                onChange={(e) => setUsername(e.target.value)} // Update the username state
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="password"
                label="Пароль"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)} // Update the password state
              />
            </MDBox>
            <MDBox mb={2}>
              <FormControl fullWidth>
                <InputLabel id="field-force-manager-label">Менеджер полевых персоналов</InputLabel>
                <Select
                  labelId="field-force-manager-label"
                  value={selectedFFM || ""}
                  label="Менеджер полевых персоналов"
                  onChange={(e) => {
                    setSelectedFFM(e.target.value); // Update the selected Field Force Manager state
                  }}
                  sx={{ height: "45px" }}
                >
                  {fieldForceManagers.map((ffm) => (
                    <MenuItem key={ffm.id} value={ffm}>
                      {ffm.full_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </MDBox>
            <MDBox mb={2}>
              <FormControl fullWidth>
                <InputLabel id="regional-manager-label">Региональный менеджер</InputLabel>
                <Select
                  labelId="regional-manager-label"
                  value={region_manager_id}
                  label="Региональный менеджер"
                  onChange={(e) => setRegionalManagerId(e.target.value)} // Update the selected Regional Manager state
                  sx={{ height: "45px" }}
                >
                  {regionalManagers.map((rm) => (
                    <MenuItem key={rm.id} value={rm.id}>
                      {rm.full_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </MDBox>
            <MDBox mt={4} mb={1}>
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

export default DeputyDirectorAddMedicalRepresentative;
