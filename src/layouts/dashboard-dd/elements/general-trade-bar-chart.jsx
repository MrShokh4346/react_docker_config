import { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import axiosInstance from "services/axiosInstance";

const GeneralTradeBarChart = () => {
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
      type: "bar",
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: true,
        dataLabels: {
          position: "top",
        },
      },
    },
    dataLabels: {
      enabled: true,
      offsetX: -20,
      style: {
        fontSize: "12px",
        colors: ["#304758"],
      },
      formatter: function (val) {
        return formatNumber(val);
      },
    },
    xaxis: {
      categories: Object.keys(filteredData),
      labels: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    title: {
      text: `Umumiy savdo - ${formatNumber(umumiy_savdo)} so'm`,
      align: "center",
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return formatNumber(val);
        },
      },
    },
  };

  const series = [
    {
      data: Object.values(filteredData),
    },
  ];

  return <ReactApexChart options={options} series={series} type="bar" />;
};

export default GeneralTradeBarChart;
