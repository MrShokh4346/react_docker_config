import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axiosInstance from "services/axiosInstance";
import MDTypography from "components/MDTypography";
import { useNavigate } from "react-router-dom";

export default function useProductReportData(products) {
  const [data, setData] = useState({ columns: [], rows: [] });
  const accessToken = useSelector((state) => state.auth.accessToken);

  useEffect(() => {
    function prepareRowColumns() {
      try {
        const columns = [
          { Header: "Продукт", accessor: "product_name", align: "left" },
          { Header: "Производственная компания", accessor: "man_company", align: "left" },
          { Header: "Количество", accessor: "quantity", align: "left" },
        ];

        const rows = products.map((element) => ({
          product_name: (
            <MDTypography variant="caption" fontWeight="medium">
              {element.product.name}
            </MDTypography>
          ),
          man_company: (
            <MDTypography variant="caption" fontWeight="medium">
              {element.product.man_company.name}
            </MDTypography>
          ),
          quantity: (
            <MDTypography variant="caption" fontWeight="medium">
              {element.product.quantity}
            </MDTypography>
          ),
        }));

        setData({ columns, rows });
      } catch (error) {
        console.error(error);
      }
    }

    prepareRowColumns();
  }, [accessToken, products]);

  return data;
}
