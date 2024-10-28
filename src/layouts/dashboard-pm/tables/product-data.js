import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axiosInstance from "services/axiosInstance";
import MDTypography from "components/MDTypography";
import DriveFileRenameOutlineOutlinedIcon from "@mui/icons-material/DriveFileRenameOutlineOutlined";
import { IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function useProductData(apiPath, id1, id2) {
  const navigate = useNavigate();
  const [data, setData] = useState({ columns: [], rows: [] });
  const accessToken = useSelector((state) => state.auth.accessToken);

  const [open, setOpen] = useState(false);

  const handleSubmit = async (udpatedProduct) => {
    try {
      const response = await axiosInstance.put(
        `http://localhost:8000/common/update-product/${udpatedProduct.id}`,
        udpatedProduct,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
    } catch (error) {
      console.error("не удалось обновить продукт:", error);
    }
  };

  useEffect(() => {
    async function fetchProducts() {
      try {
        const { data: fetchedData } = await axiosInstance.get(apiPath, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        fetchedData.sort((a, b) => a.id - b.id);

        const columns = [
          { Header: "Название", accessor: "name", align: "left" },
          { Header: "Цена", accessor: "price", align: "left" },
          { Header: "Произ. цена", accessor: "discount_price", align: "left" },
          { Header: "Производитель", accessor: "man_company", align: "left" },
          { Header: "Категория", accessor: "category", align: "left" },
          { Header: "Действия", accessor: "action", align: "right" },
        ];

        const rows = fetchedData
          .filter((prct) => (id1 === 0 && prct) || prct.man_company.id === id1)
          .filter((prct) => (id2 === 0 && prct) || prct.category.id === id2)
          .map((product) => ({
            name: (
              <MDTypography variant="caption" fontWeight="medium">
                {product.name}
              </MDTypography>
            ),
            price: (
              <MDTypography variant="caption" fontWeight="medium">
                {product.price}
              </MDTypography>
            ),
            discount_price: (
              <MDTypography variant="caption" fontWeight="medium">
                {product.discount_price}
              </MDTypography>
            ),
            man_company: (
              <MDTypography variant="caption" fontWeight="medium">
                {product.man_company.name}
              </MDTypography>
            ),
            category: (
              <MDTypography variant="caption" fontWeight="medium">
                {product.category.name}
              </MDTypography>
            ),
            action: (
              <div>
                <IconButton
                  onClick={() => {
                    navigate("/dd/update-product", { state: { productToUpdate: product } }); // Navigate with state
                  }}
                  aria-label="update"
                >
                  <DriveFileRenameOutlineOutlinedIcon />
                </IconButton>
              </div>
            ),
          }));

        setData({ columns, rows });
      } catch (error) {
        console.error(error);
      }
    }

    fetchProducts();
  }, [accessToken, apiPath, open, id1, id2]);

  return data;
}
