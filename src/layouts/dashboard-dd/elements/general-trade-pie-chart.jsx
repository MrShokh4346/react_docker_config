import { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import axiosInstance from "services/axiosInstance";
const GeneralTradePieChart = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const formatNumber = (number) => {
    return new Intl.NumberFormat("uz-UZ").format(number);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get("/dd/get-reservations-sales-report");
        setData(response.data);
      } catch (err) {
        setError(err.message || "An error occurred while fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!data) return null;

  const { umumiy_savdo, ...filteredData } = data;

  const options = {
    chart: {
      type: "pie",
    },
    labels: Object.keys(filteredData),

    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
    tooltip: {
      y: {
        formatter: function (val) {
          return formatNumber(val);
        },
      },
    },
  };

  const series = Object.values(filteredData);

  return (
    <div>
      <ReactApexChart options={options} series={series} type="pie" />
    </div>
  );
};

export default GeneralTradePieChart;
