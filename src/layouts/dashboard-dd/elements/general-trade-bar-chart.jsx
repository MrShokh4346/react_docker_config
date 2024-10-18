import { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import axiosInstance from "services/axiosInstance";
import { formatNumber } from "utils/formatNumber";
import { CustomLoading } from "../components/dd-statistics";

const ChartComponent = ({ filteredData, title }) => {
  const series = [
    {
      data: Object.values(filteredData),
    },
  ];

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
      text: title,
      style: {
        fontSize: "20px",
      },
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return formatNumber(val);
        },
      },
    },
  };

  return <ReactApexChart options={options} series={series} type="bar" />;
};

const GeneralTradeBarChart = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading) return <CustomLoading />;
  if (error) return <div>Error: {error}</div>;
  if (!data) return null;

  const { umumiy_savdo, ...filteredData } = data;

  return (
    <ChartComponent
      filteredData={filteredData}
      title={`Общая торговля - ${formatNumber(umumiy_savdo)} сум`}
    />
  );
};

ChartComponent.propTypes = {
  filteredData: Object,
  title: String,
};

export default GeneralTradeBarChart;
