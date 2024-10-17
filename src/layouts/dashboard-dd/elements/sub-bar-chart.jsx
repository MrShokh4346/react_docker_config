import Chart from "react-apexcharts";

const SubBarChart = () => {
  const data = [
    {
      name: "Net Profit",
      data: [21, 22, 10, 28, 16, 21, 13, 30],
    },
  ];

  return (
    <Chart
      options={{
        // chart: {
        //   height: 350,
        //   type: "bar",
        //   events: {
        //     click: function (chart, w, e) {
        //       // console.log(chart, w, e)
        //     },
        //   },
        // },
        chart: {
          toolbar: {
            show: false,
          },
        },
        plotOptions: {
          bar: {
            borderRadius: 4,
          },
        },
        colors: ["#0084ff"],
        dataLabels: {
          enabled: false,
        },
        legend: {
          show: false,
        },
        title: {
          text: "Medpristavitellar ismi",
          style: {
            fontSize: "24px",
          },
        },
        xaxis: {
          categories: ["John", "Joe", "Jake", "Amber", "Peter", "Mary", "David", "Lily"],
          // labels: {
          //   style: {
          //     colors: [],
          //     fontSize: "12px",
          //   },
          // },
        },
      }}
      series={data}
      height={350}
      type="bar"
    />
  );
};

export default SubBarChart;
