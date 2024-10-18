import React, { useEffect, useState } from "react";
import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import PharmacyInventoryTable from "./components/PharmacyInventoryTable";

const PharmacyInventory = () => {
  const [inventoryData, setInventoryData] = useState([]);

  useEffect(() => {
    // Fetch data from the API
    fetch("https://it-club.uz/mr/get-pharmacy-warehouse")
      .then((response) => response.json())
      .then((data) => setInventoryData(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    <DashboardLayout>
      <MDBox py={3}>
        <PharmacyInventoryTable data={inventoryData} />
      </MDBox>
    </DashboardLayout>
  );
};

export default PharmacyInventory;
