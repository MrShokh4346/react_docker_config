import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import axiosInstance from "services/axiosInstance";
import MDTypography from "components/MDTypography";

export default function useBonusHistoryData(bonusId) {
  const [data, setData] = useState({ columns: [], rows: [] });
  const accessToken = useSelector((state) => state.auth.accessToken);

  useEffect(() => {
    async function fetchBonusHistory() {
      try {
        const response = await axiosInstance.get(
          `http://localhost:8000/mr/get-bonus-history/${bonusId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        const bonusHistory = response.data.sort((a, b) => new Date(a.date) - new Date(b.date));

        const columns = [
          { Header: "Дата", accessor: "date", align: "left" },
          { Header: "Сумма", accessor: "amount", align: "left" },
          { Header: "Описание", accessor: "description", align: "left" },
        ];

        const rows = bonusHistory.map((bonus) => ({
          date: (
            <MDTypography variant="caption" fontWeight="medium">
              {new Date(bonus.date).toLocaleDateString()}
            </MDTypography>
          ),
          amount: (
            <MDTypography variant="caption" fontWeight="medium">
              {bonus.amount.toLocaleString()}
            </MDTypography>
          ),
          description: (
            <MDTypography variant="caption" fontWeight="medium">
              {bonus.description || "-"}
            </MDTypography>
          ),
        }));

        setData({ columns, rows });
      } catch (error) {
        console.error(error);
      }
    }

    fetchBonusHistory();
  }, [accessToken]);

  return data;
}
