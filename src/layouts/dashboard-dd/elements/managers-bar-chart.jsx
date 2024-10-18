import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import axiosInstance from "services/axiosInstance";
import { formatNumber } from "utils/formatNumber";
import { CustomLoading } from "../components/dd-statistics";

const ChartComponent = ({ categories, seriesData }) => {
  const series = [
    {
      name: "",
      data: seriesData, // Use dynamic data for the series
    },
  ];

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
        fontSize: "20px",
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
        formatter: (val) => `${formatNumber(val)} сум`,
      },
    },
  };

  return <Chart options={chartOptions} series={series} height={350} type="bar" />;
};

const ManagersBarChart = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [categories, setCategories] = useState([]); // Array to store product managers
  const [seriesData, setSeriesData] = useState([]); // Array to store total sum

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await axiosInstance.get("/dd/get-users-sales-report");

        // Sort the data by total_sum in descending order
        const sortedData = [...response?.data].sort((a, b) => b?.total_sum - a?.total_sum);

        // Extract product managers and total sum after sorting
        setCategories(sortedData?.map((item) => item?.product_manager));
        setSeriesData(sortedData?.map((item) => item?.total_sum));
      } catch (error) {
        setError(error?.message || "An error occurred while fetching data");
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  if (loading) return <CustomLoading />;
  if (error) return <div>Error: {error}</div>;

  return <ChartComponent categories={categories} seriesData={seriesData} />;
};

ChartComponent.propTypes = {
  categories: Array,
  seriesData: Array,
};

export default ManagersBarChart;
