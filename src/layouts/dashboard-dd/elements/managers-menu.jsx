import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import axios from "axios";
import { useSelector } from "react-redux";
import userRoles from "constants/userRoles";

export default function ManagersMenu({
  setRegion,
  setFf_manager,
  setProduct_manager,
  region,
  ff_manager,
  product_manager,
}) {
  const { accessToken } = useSelector((state) => state.auth);

  const [regions, setRegions] = useState([{ username: "", full_name: "All" }]);
  const [ff_managers, setFf_managers] = useState([{ username: "", full_name: "All" }]);
  const [product_managers, setProduct_managers] = useState([{ username: "", full_name: "All" }]);

  const handleChangeFfManager = (e) => {
    setRegion("");
    setProduct_manager("");
    setFf_manager(e.target.value);
  };

  const handleChangeRegion = (e) => {
    setFf_manager("");
    setProduct_manager("");
    setRegion(e.target.value);
  };

  const handleChangeProductManager = (e) => {
    setRegion("");
    setFf_manager("");
    setProduct_manager(e.target.value);
  };

  useEffect(() => {
    const fetchFieldForceManagers = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/common/get-users`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const fieldForceManagers = response.data.filter(
          (user) => user.status === userRoles.FIELD_FORCE_MANAGER
        );
        setFf_managers([{ username: "", full_name: "All" }, ...fieldForceManagers]);
      } catch (error) {
        console.error("Не удалось получить пользователей:", error);
      }
    };

    const fetchRegionalManagers = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/common/get-users`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const regionalManagers = response.data.filter(
          (user) => user.status === userRoles.REGIONAL_MANAGER
        );
        setRegions([{ username: "", full_name: "All" }, ...regionalManagers]);
      } catch (error) {
        console.error("Не удалось получить пользователей:", error);
      }
    };

    const fetchProductManagers = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/common/get-users`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const productManagers = response.data.filter(
          (user) => user.status === userRoles.PRODUCT_MANAGER
        );
        setProduct_managers([{ username: "", full_name: "All" }, ...productManagers]);
      } catch (error) {
        console.error("Не удалось получить пользователей:", error);
      }
    };

    fetchFieldForceManagers();
    fetchRegionalManagers();
    fetchProductManagers();
  }, [accessToken]);

  return (
    <>
      <FormControl sx={{ m: 1, minWidth: 200 }}>
        <InputLabel id="ff_manager-select-label">Field Force Managers</InputLabel>
        <Select
          labelId="ff_manager-select-label"
          id="ff_manager-select"
          value={ff_manager}
          label="Field Force Managers"
          onChange={handleChangeFfManager}
          sx={{ height: "45px" }}
        >
          {ff_managers.map((manager) => (
            <MenuItem key={manager.username} value={manager.username}>
              {manager.username ? manager.full_name : "All"}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl sx={{ m: 1, minWidth: 200 }}>
        <InputLabel id="region-select-label">Regional Managers</InputLabel>
        <Select
          labelId="region-select-label"
          id="region-select"
          value={region}
          label="Regional Managers"
          onChange={handleChangeRegion}
          sx={{ height: "45px" }}
        >
          {regions.map((manager) => (
            <MenuItem key={manager.username} value={manager.username}>
              {manager.full_name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl sx={{ m: 1, minWidth: 200 }}>
        <InputLabel id="product_manager-select-label">Product Managers</InputLabel>
        <Select
          labelId="product_manager-select-label"
          id="product_manager-select"
          value={product_manager}
          label="Product Managers"
          onChange={handleChangeProductManager}
          sx={{ height: "45px" }}
        >
          {product_managers.map((manager) => (
            <MenuItem key={manager.username} value={manager.username}>
              {manager.full_name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </>
  );
}

ManagersMenu.propTypes = {
  setRegion: PropTypes.func,
  setFf_manager: PropTypes.func,
  setProduct_manager: PropTypes.func,
  region: PropTypes.string,
  ff_manager: PropTypes.string,
  product_manager: PropTypes.string,
};
