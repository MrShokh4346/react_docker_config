import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import { Button, Card, TextField, Alert } from "@mui/material";
import { Autocomplete } from "@mui/material";
import axiosInstance from "services/axiosInstance";
import { useSelector } from "react-redux";
import BasicLayout from "layouts/authentication/components/BasicLayout";

function DeputyDirectorUpdateProduct() {
  const navigate = useNavigate();
  const location = useLocation();
  const { productToUpdate } = location.state || {}; // Get product data from navigation state
  console.log(productToUpdate);

  const [name, setName] = useState(productToUpdate?.name || "");
  const [price, setPrice] = useState(productToUpdate?.price || "");
  const [discount_price, setDiscountPrice] = useState(productToUpdate?.discount_price || "");
  const [man_company_id, setManufacturerCompanyId] = useState(
    productToUpdate?.man_company.id || ""
  );
  const [category_id, setCategoryId] = useState(productToUpdate?.category.id || "");
  const [categories, setCategories] = useState([]);
  const [manufacturerCompanies, setManufacturerCompanies] = useState([]);
  const [message, setMessage] = useState(null); // State to manage success or error message
  const accessToken = useSelector((state) => state.auth.accessToken);

  useEffect(() => {
    fetchManCompAndCategories();
  }, []);

  const fetchManCompAndCategories = async () => {
    try {
      const [manCompanies, categories] = await Promise.all([
        axiosInstance.get("common/get-manufactured-company", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }),
        axiosInstance.get("common/get-product-category", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }),
      ]);
      setManufacturerCompanies(manCompanies.data);
      setCategories(categories.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const updatedProduct = {
      id: productToUpdate.id,
      name,
      price,
      discount_price,
      category_id,
      man_company_id,
    };

    try {
      await axiosInstance.put(
        `http://localhost:8000/common/update-product/${updatedProduct.id}`,
        updatedProduct,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setMessage({ type: "success", text: "Продукт успешно обновлен!" });

      // Navigate back after 2 seconds
      setTimeout(() => {
        navigate(-1);
      }, 2000);
    } catch (error) {
      setMessage({ type: "error", text: "Не удалось обновить продукт." });
      console.error("Не удалось обновить продукт:", error);
    }
  };

  return (
    <BasicLayout>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="info"
          mx={2}
          mt={-3}
          p={2}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Обновить продукт
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          {message && (
            <MDBox mb={2}>
              <Alert severity={message.type}>{message.text}</Alert>
            </MDBox>
          )}
          <MDBox component="form" role="form" onSubmit={handleFormSubmit}>
            <MDBox mb={2}>
              <MDInput
                type="text"
                label="Название"
                fullWidth
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="number"
                label="Цена"
                fullWidth
                value={price}
                onChange={(e) => {
                  const value = parseFloat(e.target.value);
                  if (value >= 0 || e.target.value === "") {
                    setPrice(e.target.value);
                  }
                }}
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="number"
                label="Цена производителя"
                fullWidth
                value={discount_price}
                onChange={(e) => {
                  const value = parseFloat(e.target.value);
                  if (value >= 0 || e.target.value === "") {
                    setDiscountPrice(e.target.value);
                  }
                }}
              />
            </MDBox>
            <MDBox mb={2}>
              <Autocomplete
                options={manufacturerCompanies}
                getOptionLabel={(option) => option.name}
                value={manufacturerCompanies.find((mc) => mc.id === man_company_id) || null}
                onChange={(event, newValue) => {
                  setManufacturerCompanyId(newValue ? newValue.id : "");
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Производители" variant="outlined" fullWidth />
                )}
              />
            </MDBox>
            <MDBox mb={2}>
              <Autocomplete
                options={categories}
                getOptionLabel={(option) => option.name}
                value={categories.find((category) => category.id === category_id) || null}
                onChange={(event, newValue) => {
                  setCategoryId(newValue ? newValue.id : "");
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Категория продукта" variant="outlined" fullWidth />
                )}
              />
            </MDBox>
            <MDBox display="flex" justifyContent="space-between" alignItems="center">
              <Button onClick={() => navigate(-1)} size="small" variant="outlined">
                <MDTypography variant="button">Отмена</MDTypography>
              </Button>
              <Button size="small" variant="contained" type="submit">
                <MDTypography style={{ color: "white" }} variant="button">
                  Сохранить
                </MDTypography>
              </Button>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </BasicLayout>
  );
}

export default DeputyDirectorUpdateProduct;
