import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axiosInstance from "services/axiosInstance";

import IconButton from "@mui/material/IconButton";
import DriveFileRenameOutlineOutlinedIcon from "@mui/icons-material/DriveFileRenameOutlineOutlined";

import MDTypography from "components/MDTypography";
import SpecialityModal from "../../dialogs/modal/shared/speciality-modal";

export default function useSpecialityData(apiPath) {
  const [data, setData] = useState({ columns: [], rows: [] });
  const accessToken = useSelector((state) => state.auth.accessToken);

  const [open, setOpen] = useState(false);
  const [specialityToUpdate, setSpecialityToUpdate] = useState({ id: null, name: "" });

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSpecialityToUpdate({ id: null, name: "" }); // Clear update data on modal close
  };

  const handleSubmit = async (updatedSpeciality) => {
    try {
      const response = await axiosInstance.put(
        `http://localhost:8000/common/update-speciality/${updatedSpeciality.id}?name=${updatedSpeciality.name}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      // Assuming response.data contains the updated region data
      const updatedSpecialityData = response.data;

      // Optionally update state or trigger a refresh of data
      fetchSpecialities(); // Example: Refresh data after update
    } catch (error) {
      console.error("Error updating region:", error);
    }
  };

  useEffect(() => {
    async function fetchSpecialities() {
      try {
        console.log(apiPath);
        const response = await axiosInstance.get(apiPath, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const specialities = response.data.sort((a, b) => a.id - b.id);

        const columns = [
          { Header: "Название", accessor: "name", align: "left" },
          { Header: "Действия", accessor: "action", align: "right" },
        ];

        const rows = specialities.map((speciality) => ({
          name: (
            <MDTypography variant="caption" fontWeight="medium">
              {speciality.name}
            </MDTypography>
          ),
          action: (
            <div>
              <IconButton
                onClick={() => {
                  handleOpen();
                  setSpecialityToUpdate({ id: speciality.id, name: speciality.name });
                }}
                aria-label="update"
              >
                <DriveFileRenameOutlineOutlinedIcon />
              </IconButton>
              <SpecialityModal
                open={open}
                handleClose={handleClose}
                handleSubmit={handleSubmit}
                specialityToUpdate={specialityToUpdate}
              />
            </div>
          ),
        }));

        setData({ columns, rows });
      } catch (error) {
        console.error(error);
      }
    }

    fetchSpecialities();
  }, [accessToken, apiPath, open]);

  return data;
}
