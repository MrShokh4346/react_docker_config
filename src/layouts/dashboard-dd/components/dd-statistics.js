import { Box, Card, TextField } from "@mui/material";

import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import { useState } from "react";
import ManagersBarChart from "../elements/managers-bar-chart";
import GeneralTradeBarChart from "../elements/general-trade-bar-chart";
import GeneralTradePieChart from "../elements/general-trade-pie-chart";
import SubBarChart from "../elements/sub-bar-chart";
import StatisticsFilterTools from "../elements/statistics-filter-tools";

const DeputyDirectorStatistics = () => {
  return (
    <DashboardLayout>
      <MDBox py={3} sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <StatisticsFilterTools />

        <Card
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            // gap: "1rem",
          }}
        >
          <Box
            sx={{
              padding: "1rem",
            }}
          >
            <ManagersBarChart />
          </Box>
          <Box
            sx={{
              padding: "1rem",
            }}
          >
            <GeneralTradeBarChart />
          </Box>
          <Box
            sx={{
              padding: "1rem",
            }}
          >
            <GeneralTradePieChart />
          </Box>
          <Box
            sx={{
              gridColumn: "1 / span 3",
              padding: "1rem",
            }}
          >
            <SubBarChart />
          </Box>
        </Card>
      </MDBox>
    </DashboardLayout>
  );
};

export default DeputyDirectorStatistics;
