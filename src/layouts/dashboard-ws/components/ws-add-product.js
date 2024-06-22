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
  const [message, setMessage] = useState({ color: "", content: "" });
  const user = location.state || {};

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`https://it-club.uz/common/get-product`, {
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

  const handleSubmit = async (event) => {
    event.preventDefault();

    const productData = {
      product_id,
      factory_id: 0,
      quantity,
      price,
    };

    try {
      const response = await axios.post(
        `https://it-club.uz/ws/wholesale-add-product/${wholesale_id}`,
        productData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      setMessage({ color: "success", content: "Продукт успешно добавлен" });

      setTimeout(() => {
        navigate(-1);
      }, 2000);
    } catch (error) {
      console.log(error);
      setMessage({
        color: "error",
        content:
          "Не удалось добавить продукт. " +
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
                <InputLabel id="manufactuer-companies-label">Производители</InputLabel>
                <Select
                  labelId="manufactuer-companies-label"
                  value={product_id}
                  label="Производители"
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
              <MDInput
                type="number"
                label="Количество"
                fullWidth
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="number"
                label="Цена"
                fullWidth
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </MDBox>

            <MDBox mt={4} mb={1}>
              <MDButton variant="gradient" color="info" fullWidth type="submit">
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
