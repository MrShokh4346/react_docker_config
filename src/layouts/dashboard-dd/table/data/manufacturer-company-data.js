import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import IconButton from "@mui/material/IconButton";
import DriveFileRenameOutlineOutlinedIcon from "@mui/icons-material/DriveFileRenameOutlineOutlined";

import axiosInstance from "services/axiosInstance";
import MDTypography from "components/MDTypography";

import ManufacturerCompanyModal from "../../dialogs/modal/shared/manufacturer-company-modal";

export default function useManufacturerCompanyData(apiPath) {
  const [data, setData] = useState({ columns: [], rows: [] });
  const accessToken = useSelector((state) => state.auth.accessToken);
  const [open, setOpen] = useState(false);
  const [campanyToUpdate, setCampanyToUpdate] = useState({ id: null, name: "" });

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCampanyToUpdate({ id: null, name: "" }); // Clear update data on modal close
  };

  const handleSubmit = async (updatedMnfct) => {
    try {
      const response = await axiosInstance.put(
        `http://localhost:8000/common/update-manufactured-company/${updatedMnfct.id}?name=${updatedMnfct.name}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      // Assuming response.data contains the updated region data
      const updatedMnfctData = response.data;

      // Optionally update state or trigger a refresh of data
      fetchMnfct(); // Example: Refresh data after update
    } catch (error) {
      console.error("Error updating region:", error);
    }
  };

  useEffect(() => {
    async function fetchManufacturerCompanies() {
      try {
        const response = await axiosInstance.get(apiPath, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const manufacturerCompanies = response.data.sort((a, b) => a.id - b.id);

        const columns = [
          { Header: "Название", accessor: "name", align: "left" },
          { Header: "Действия", accessor: "action", align: "right" },
        ];

        const rows = manufacturerCompanies.map((mnfct) => ({
          name: (
            <MDTypography variant="caption" fontWeight="medium">
              {mnfct.name}
            </MDTypography>
          ),
          action: (
            <div>
              <IconButton
                onClick={() => {
                  handleOpen();
                  setCampanyToUpdate({ id: mnfct.id, name: mnfct.name });
                }}
                aria-label="update"
              >
                <DriveFileRenameOutlineOutlinedIcon />
              </IconButton>
              <ManufacturerCompanyModal
                open={open}
                handleClose={handleClose}
                handleSubmit={handleSubmit}
                campanyToUpdate={campanyToUpdate}
              />
            </div>
          ),
        }));

        setData({ columns, rows });
      } catch (error) {
        console.error(error);
      }
    }

    fetchManufacturerCompanies();
  }, [accessToken, apiPath, open]);

  return data;
}
