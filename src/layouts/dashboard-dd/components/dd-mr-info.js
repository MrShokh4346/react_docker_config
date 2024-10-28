// @mui material components
import { Box, Grid, Typography } from "@mui/material";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";

// Dashboard components
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import DeputyDirectorTable from "../table";
import ProductPlanTable from "../table/mr-product-plan-table";

function DeputyDirectorMRInfo() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = location.state || {};
  return (
    <DashboardLayout>
      <MDBox py={3}>
        <MDBox>
          <Typography variant="h5" component="h2" fontWeight="medium" gutterBottom>
            {user.full_name}
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <DeputyDirectorTable
                path={`/mr/get-doctor-visit-plan?user_id=${user.id}`}
                tableType="doctor-plan"
                title="Планы врачей"
                navigatePath="/dd/add-doctor-plan"
                navigateState={user}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <DeputyDirectorTable
                path={`mr/get-pharmacy-visit-plan?user_id=${user.id}`}
                tableType="pharmacy-plan"
                title="Планы аптек"
                navigatePath="/dd/add-pharmacy-plan"
                navigateState={user}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <DeputyDirectorTable
                path={`mr/get-pharmacy?user_id=${user.id}`}
                tableType="mr-pharmacies"
                title="Аптеки"
                navigatePath="/dd/add-pharmacy"
                navigateState={user}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <DeputyDirectorTable
                path={`http://localhost:8000/mr/get-doctors-by-med-rep/${user.id}`}
                tableType="mr-doctors"
                title="Врачи"
                navigatePath="/dd/add-doctor"
                navigateState={user}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <DeputyDirectorTable
                path={`dd/notofications/${user.id}`}
                tableType="notifications"
                title="Уведомления"
                navigatePath="/dd/add-notification"
                navigateState={user}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <ProductPlanTable medRepId={user.id} />
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
      <Outlet />
    </DashboardLayout>
  );
}

export default DeputyDirectorMRInfo;
