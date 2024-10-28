import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import Card from "@mui/material/Card";
import Alert from "@mui/material/Alert";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import BasicLayout from "layouts/authentication/components/BasicLayout";

function WholesaleManagerAddProduct() {
  const { wholesale_id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { accessToken } = useSelector((state) => state.auth);
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [product_id, setProductId] = useState("");
  const [products, setProducts] = useState([]);
  const [factory_id, setFactoryId] = useState("");
  const [factories, setFactories] = useState([]);
  const [message, setMessage] = useState({ color: "", content: "" });
  const [isSubmitting, setIsSubmitting] = useState(false); // New state to track submission
  const user = location.state || {};

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/common/get-product`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const prodeuts = response.data;
        setProducts(prodeuts);
      } catch (error) {
        console.error("Не удалось получить производителей:", error);
      }
    };

    fetchProducts();
  }, [accessToken]);

  useEffect(() => {
    const fetchFactories = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/common/get-manufactured-company`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const manufacturerCompanies = response.data;
        setFactories(manufacturerCompanies);
      } catch (error) {
        console.error("Не удалось получить производителей:", error);
      }
    };

    fetchFactories();
  }, [accessToken]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const productData = {
      product_id,
      factory_id,
      quantity,
      price,
    };

    try {
      const response = await axios.post(
        `http://localhost:8000/ws/wholesale-add-product/${wholesale_id}`,
        productData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      setMessage({ color: "success", content: "Данные успешно добавлены" });
      setIsSubmitting(true); // Disable the button after clicking

      setTimeout(() => {
        navigate(-1);
      }, 2000);
    } catch (error) {
      console.log(error);
      setMessage({
        color: "error",
        content:
          "Не удалось добавить данные. " +
          (error.response?.data?.detail ||
            "Проверьте правильность введенных данных и попробуйте снова."),
      });
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
            Добавить продукт
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          {message.content && <Alert severity={message.color}>{message.content}</Alert>}
          <MDBox component="form" role="form" onSubmit={handleSubmit}>
            <MDBox mb={2}>
              <FormControl fullWidth>
                <InputLabel id="product-label">Продукт</InputLabel>
                <Select
                  labelId="product-label"
                  value={product_id}
                  label="Продукт"
                  onChange={(e) => setProductId(e.target.value)}
                  sx={{ height: "45px" }}
                >
                  {products.map((product) => (
                    <MenuItem key={product.id} value={product.id}>
                      {product.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </MDBox>
            <MDBox mb={2}>
              <FormControl fullWidth>
                <InputLabel id="factory-label">Производственные компании</InputLabel>
                <Select
                  labelId="factory-label"
                  value={factory_id}
                  label="Производственные компании"
                  onChange={(e) => setFactoryId(e.target.value)}
                  sx={{ height: "45px" }}
                >
                  {factories.map((factory) => (
                    <MenuItem key={factory.id} value={factory.id}>
                      {factory.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="number"
                label="Количество"
                fullWidth
                value={quantity}
                onChange={(e) => {
                  const value = parseFloat(e.target.value);
                  if (value >= 0 || e.target.value === "") {
                    setQuantity(e.target.value);
                  }
                }}
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

            <MDBox mt={4} mb={1}>
              <MDButton
                variant="gradient"
                color="info"
                fullWidth
                type="submit"
                disabled={isSubmitting}
              >
                Добавить
              </MDButton>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </BasicLayout>
  );
}

export default WholesaleManagerAddProduct;
