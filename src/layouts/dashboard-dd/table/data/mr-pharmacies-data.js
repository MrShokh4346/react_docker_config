import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axiosInstance from "services/axiosInstance";
import MDTypography from "components/MDTypography";
import DriveFileRenameOutlineOutlinedIcon from "@mui/icons-material/DriveFileRenameOutlineOutlined";
import { IconButton } from "@mui/material";
import PharmaciesModal from "../../dialogs/modal/shared/pharmacies-modal";

export default function usePharmacyData(apiPath, onRowClick) {
  const [data, setData] = useState({ columns: [], rows: [] });
  const accessToken = useSelector((state) => state.auth.accessToken);
  const [open, setOpen] = useState(false);
  const [pharmaciesToUpdate, setPharmaciesToUpdate] = useState({
    id: null,
    company_name: "",
    contact1: "",
    email: "",
    brand_name: "",
    latitude: "",
    longitude: "",
    address: "",
    inter_branch_turnover: "",
    pharmacy_director: "",
    region_id: null,
  });

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async (updatedPharmecy) => {
    try {
      const response = await axiosInstance.patch(
        `http://localhost:8000/mr/update-pharmacy/${updatedPharmecy.id}`,
        updatedPharmecy,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
    } catch (error) {
      console.error("Error updating medical organization:", error);
    }
  };

  useEffect(() => {
    async function fetchPharmacies() {
      try {
        const response = await axiosInstance.get(apiPath, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const pharmacies = response.data.sort((a, b) =>
          a.company_name.localeCompare(b.company_name)
        );

        const columns = [
          { Header: "Название компании", accessor: "name", align: "left" },
          { Header: "Бренд", accessor: "brand", align: "left" },
          { Header: "Директор", accessor: "director", align: "left" },
          { Header: "ДЕЙСТВИЯ", accessor: "action", align: "right" },
        ];

        const rows = pharmacies.map((pharmacy) => ({
          name: (
            <MDTypography
              variant="caption"
              fontWeight="medium"
              onClick={() => onRowClick(pharmacy.id)}
            >
              {pharmacy.company_name}
            </MDTypography>
          ),
          brand: (
            <MDTypography
              variant="caption"
              fontWeight="medium"
              onClick={() => onRowClick(pharmacy.id)}
            >
              {pharmacy.brand_name}
            </MDTypography>
          ),
          director: (
            <MDTypography
              variant="caption"
              fontWeight="medium"
              onClick={() => onRowClick(pharmacy.id)}
            >
              {pharmacy.pharmacy_director}
            </MDTypography>
          ),
          action: (
            <div>
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpen();
                  setPharmaciesToUpdate({
                    id: pharmacy.id,
                    pharmacy_director: pharmacy.pharmacy_director,
                    contact1: pharmacy.contact1,
                    email: pharmacy.email,
                    brand_name: pharmacy.brand_name,
                    company_name: pharmacy.company_name,
                    inter_branch_turnover: pharmacy.inter_branch_turnover,
                    latitude: pharmacy.latitude,
                    longitude: pharmacy.longitude,
                    address: pharmacy.address,
                    med_rep: pharmacy.med_rep.id,
                    discount: pharmacy.discount,
                    region: pharmacy.region.id,
                  });
                }}
                aria-label="update"
              >
                <DriveFileRenameOutlineOutlinedIcon />
              </IconButton>
              <PharmaciesModal
                open={open}
                handleClose={handleClose}
                handleSubmit={handleSubmit}
                pharmaciesToUpdate={pharmaciesToUpdate}
              />
            </div>
          ),
        }));

        setData({ columns, rows });
      } catch (error) {
        console.error(error);
      }
    }

    fetchPharmacies();
  }, [accessToken, apiPath, open]);

  return data;
}
