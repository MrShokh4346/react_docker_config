import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import MDTypography from "components/MDTypography";
import { format } from "date-fns";
import { IconButton } from "@mui/material";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import CreditScore from "@mui/icons-material/CreditScore";
import axiosInstance from "services/axiosInstance";

export default function useReservationData(apiPath) {
  const [data, setData] = useState({ columns: [], rows: [] });
  const accessToken = useSelector((state) => state.auth.accessToken);

  useEffect(() => {
    async function fetchReservations() {
      try {
        const response = await axiosInstance.get(apiPath, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const reservations = response.data;

        const columns = [
          { Header: "Аптека", accessor: "pharmacy_name", align: "left" },
          { Header: "Медицинский представитель", accessor: "med_rep_name", align: "left" },
          { Header: "Дата", accessor: "date", align: "left" },
          { Header: "Сумма к оплате", accessor: "total_payable", align: "left" },
          { Header: "Скидка", accessor: "discount", align: "left" },
          { Header: "Статус", accessor: "status", align: "center" },
          { Header: "Проверить", accessor: "check", align: "center" },
          { Header: "Скачать", accessor: "download", align: "center" },
        ];

        const rows = reservations.map((rsrv) => ({
          pharmacy_name: (
            <MDTypography variant="caption" fontWeight="medium">
              {rsrv.pharmacy.company_name}
            </MDTypography>
          ),
          med_rep_name: (
            <MDTypography variant="caption" fontWeight="medium">
              {rsrv.pharmacy.med_rep.full_name}
            </MDTypography>
          ),
          date: (
            <MDTypography variant="caption" fontWeight="medium">
              {format(new Date(rsrv.date), "MM-dd-yyyy HH:mm")}
            </MDTypography>
          ),
          total_payable: (
            <MDTypography variant="caption" fontWeight="medium">
              {rsrv.total_payable}
            </MDTypography>
          ),
          discount: (
            <MDTypography variant="caption" fontWeight="medium">
              {`${rsrv.discount} %`}
            </MDTypography>
          ),
          status: (
            <div
              style={{
                backgroundColor: rsrv.checked ? "#57da79" : "#ffb938",
                padding: "8px",
                borderRadius: "4px",
              }}
            >
              <MDTypography
                variant="caption"
                fontWeight="medium"
                style={{
                  color: "white",
                }}
              >
                {rsrv.checked ? "Проверено" : "Не проверено"}
              </MDTypography>
            </div>
          ),
          check: (
            <IconButton
              sx={{
                "&:hover": {
                  backgroundColor: "#e0f2f1",
                },
              }}
              onClick={() => {
                alert("Check");
              }}
            >
              <CreditScore />
            </IconButton>
          ),
          download: (
            <IconButton
              sx={{
                "&:hover": {
                  backgroundColor: "#e0f2f1",
                },
              }}
              onClick={() => downloadReport(rsrv.id)}
            >
              <CloudDownloadIcon />
            </IconButton>
          ),
        }));

        setData({ columns, rows });
      } catch (error) {
        console.error(error);
      }
    }

    fetchReservations();
  }, [accessToken, apiPath]);

  function downloadReport(id) {
    axios({
      url: `https://it-club.uz/mr/get-report/${id}`,
      method: "GET",
      responseType: "blob", // Important
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `report-${id}.xlsx`); // or any other extension
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      })
      .catch((error) => console.error("Download error", error));
  }

  return data;
}
