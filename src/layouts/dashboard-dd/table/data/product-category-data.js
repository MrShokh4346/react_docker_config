import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

import IconButton from "@mui/material/IconButton";
import DriveFileRenameOutlineOutlinedIcon from "@mui/icons-material/DriveFileRenameOutlineOutlined";

import axiosInstance from "services/axiosInstance";
import MDTypography from "components/MDTypography";
import ProductCategoryModal from "../../dialogs/modal/shared/product-category-modal";

export default function useProductCategoryData(apiPath) {
  const [data, setData] = useState({ columns: [], rows: [] });
  const accessToken = useSelector((state) => state.auth.accessToken);

  const [open, setOpen] = useState(false);
  const [categoryToUpdate, setCategoryToUpdate] = useState({ id: null, name: "" });

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCategoryToUpdate({ id: null, name: "" }); // Clear update data on modal close
  };

  const handleSubmit = async (updatedCategory) => {
    try {
      const response = await axiosInstance.put(
        `http://localhost:8000/common/update-product-category/${updatedCategory.id}?name=${updatedCategory.name}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      // Optionally update state or trigger a refresh of data
      fetchRegions(); // Example: Refresh data after update
    } catch (error) {
      console.error("Error updating region:", error);
    }
  };

  useEffect(() => {
    async function fetchCategories() {
      try {
        console.log(apiPath);
        const response = await axiosInstance.get(apiPath, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const categories = response.data.sort((a, b) => a.id - b.id);

        const columns = [
          { Header: "Название", accessor: "name", align: "left" },
          { Header: "Действия", accessor: "action", align: "right" },
        ];

        const rows = categories.map((category) => ({
          name: (
            <MDTypography variant="caption" fontWeight="medium">
              {category.name}
            </MDTypography>
          ),
          action: (
            <div>
              <IconButton
                onClick={() => {
                  handleOpen();
                  setCategoryToUpdate({ id: category.id, name: category.name });
                }}
                aria-label="update"
              >
                <DriveFileRenameOutlineOutlinedIcon />
              </IconButton>
              <ProductCategoryModal
                open={open}
                handleClose={handleClose}
                handleSubmit={handleSubmit}
                categoryToUpdate={categoryToUpdate}
              />
            </div>
          ),
        }));

        setData({ columns, rows });
      } catch (error) {
        console.error(error);
      }
    }

    fetchCategories();
  }, [accessToken, apiPath, open]);

  return data;
}
