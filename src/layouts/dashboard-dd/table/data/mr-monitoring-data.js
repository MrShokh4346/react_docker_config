import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axiosInstance from "services/axiosInstance";
import MDTypography from "components/MDTypography";
import { setMedRepsData } from "../../../../redux/mrs/mrsSlice";
import { useNavigate } from "react-router-dom";
import userRoles from "constants/userRoles";

export default function useMrsMonitoringData(onRowClick) {
  const [data, setData] = useState({ columns: [], rows: [] });
  const accessToken = useSelector((state) => state.auth.accessToken);
  const medRepsFromRedux = useSelector((state) => state.mrs.medReps);
  const userRole = useSelector((state) => state.auth.userRole);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    // If medReps data exists in Redux, use it and skip API call
    if (medRepsFromRedux && medRepsFromRedux.length > 0) {
      const columns = [
        { Header: "Полное имя", accessor: "full_name", align: "left" },
        { Header: "Имя пользователя", accessor: "username", align: "left" },
      ];

      const rows = medRepsFromRedux.map((rep) => ({
        full_name: (
          <MDTypography variant="caption" fontWeight="medium">
            {rep.full_name}
          </MDTypography>
        ),
        username: (
          <MDTypography variant="caption" fontWeight="medium">
            {rep.username}
          </MDTypography>
        ),
        // Add onClick event to make the row clickable
        onClick: () => {
          navigate(userRole === userRoles.HR ? "/hr/login-monitoring" : "/dd/login-monitoring", {
            state: rep.id,
          }); // Pass the rep data to the onRowClick handler
        },
      }));

      setData({ columns, rows });
    } else {
      // If no data in Redux, make API request
      async function fetchMedReps() {
        try {
          const response = await axiosInstance.get("common/get-med-reps", {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });

          const medReps = response.data;

          // Store the data into Redux
          dispatch(setMedRepsData(medReps));

          // Define columns
          const columns = [
            { Header: "Полное имя", accessor: "full_name", align: "left" },
            { Header: "Имя пользователя", accessor: "username", align: "left" },
          ];

          // Define rows
          const rows = medReps.map((rep) => ({
            full_name: (
              <MDTypography variant="caption" fontWeight="medium">
                {rep.full_name}
              </MDTypography>
            ),
            username: (
              <MDTypography variant="caption" fontWeight="medium">
                {rep.username}
              </MDTypography>
            ),
            // Add onClick event to make the row clickable
            onClick: () => {
              navigate(
                userRole === userRoles.HR ? "/hr/login-monitoring" : "/dd/login-monitoring",
                { state: rep.id }
              ); // Pass the rep data to the onRowClick handler
            },
          }));

          setData({ columns, rows });
        } catch (error) {
          console.error(error);
        }
      }

      fetchMedReps();
    }
  }, [accessToken, dispatch, medRepsFromRedux, onRowClick]);

  return data;
}
