import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Chart from "react-apexcharts";
import axiosInstance from "services/axiosInstance";

const ManagersBarChart = () => {
  const accessToken = useSelector((state) => state.auth.accessToken);

  const [categories, setCategories] = useState([]); // Array to store product managers
  const [seriesData, setSeriesData] = useState([]); // Array to store total sum

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await axiosInstance.get("/dd/get-users-sales-report", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        // Sort the data by total_sum in descending order
        const sortedData = [...response?.data].sort((a, b) => b?.total_sum - a?.total_sum);

        // Extract product managers and total sum after sorting
        setCategories(sortedData?.map((item) => item?.product_manager));
        setSeriesData(sortedData?.map((item) => item?.total_sum));
      } catch (error) {
        console.error(error);
      }
    }

    fetchUsers();
  }, [accessToken]);

  const chartOptions = {
    chart: {
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 4,
      },
    },
    colors: ["#ffc800"],
    dataLabels: {
      enabled: false,
    },
    title: {
      text: "Менеджер по продукту",
      style: {
        fontSize: "24px",
      },
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    xaxis: {
      categories: categories, // Use dynamic categories
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: (val) => `${val.toLocaleString()} сум`,
      },
    },
  };

  const series = [
    {
      name: "",
      data: seriesData, // Use dynamic data for the series
    },
  ];

  return <Chart options={chartOptions} series={series} height={350} type="bar" />;
};

export default ManagersBarChart;
