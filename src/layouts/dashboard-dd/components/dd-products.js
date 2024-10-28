// @mui material components
import { Box, Button } from "@mui/material";
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";

// Dashboard components
import { Outlet, useNavigate } from "react-router-dom";
import DeputyDirectorTable from "../table";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

function DeputyDirectorProducts() {
  const [categories, setCategories] = useState([]);
  const [categori, setCategori] = useState(0);

  const [man_companies, setMan_companies] = useState([]);
  const [man_company, setMan_company] = useState(0);

  const handleChange = (e) => {
    setCategori(e.target.value);
  };
  const handleChangeManCompany = (e) => {
    setMan_company(e.target.value);
  };

  const { accessToken } = useSelector((state) => state.auth);
  useEffect(() => {
    const getManCompany = async () => {
      try {
        const { data } = await axios.get(`http://localhost:8000/common/get-manufactured-company`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setMan_companies(data);
      } catch (error) {
        console.log(error);
      }
    };
    const getCategory = async () => {
      try {
        const { data } = await axios.get(`http://localhost:8000/common/get-product-category`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setCategories(data);
      } catch (error) {
        console.log(error);
      }
    };
    getManCompany();
    getCategory();
  }, [setCategories, setMan_companies]);

  const datas = [
    {
      categories: [{ id: 0, name: "All" }, ...man_companies],
      categori: man_company,
      handleChange: handleChangeManCompany,
      title: "Производитель",
    },
    {
      categories: [{ id: 0, name: "All" }, ...categories],
      categori,
      handleChange,
      title: "Категория",
    },
  ];

  const navigate = useNavigate();
  return (
    <DashboardLayout>
      <MDBox py={3}>
        <MDBox>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={12}>
              <DeputyDirectorTable
                path={"dd/get-products"}
                tableType="products"
                title={"Продукты"}
                navigatePath="/dd/add-product"
                showFilters
                selectDatas={datas}
              />
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
      <Outlet />
    </DashboardLayout>
  );
}

export default DeputyDirectorProducts;
