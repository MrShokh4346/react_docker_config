import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import MDBox from "components/MDBox";
import DataTable from "examples/Tables/DataTable";
import PropTypes from "prop-types";

const DashboardProfitTable = ({ data }) => {
  const columns = [
    {
      Header: "Организация",
      accessor: (row) => row.reservation?.pharmacy?.company_name || "N/A",
      Cell: ({ value }) => (
        <span style={{ fontWeight: "bold", color: "#344767", fontSize: "12px" }}>{value}</span>
      ),
    },
    {
      Header: "№ счет фактуры",
      accessor: (row) => row.reservation?.invoice_number || "N/A",
      Cell: ({ value }) => (
        <span style={{ fontWeight: "bold", color: "#344767", fontSize: "12px" }}>{value}</span>
      ),
    },
    {
      Header: "Дата",
      accessor: (row) => {
        if (!row.date) return "N/A";
        const date = new Date(row.date);
        return date.toLocaleDateString("ru-RU", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });
      },
      Cell: ({ value }) => (
        <span style={{ fontWeight: "bold", color: "#344767", fontSize: "12px" }}>{value}</span>
      ),
    },
    {
      Header: "Сумма",
      accessor: (row) => row.amount || "N/A",
      Cell: ({ value }) => (
        <span style={{ fontWeight: "bold", color: "#344767", fontSize: "12px" }}>{value}</span>
      ),
    },
    {
      Header: "МедПред",
      accessor: (row) => row.reservation?.pharmacy?.med_rep?.full_name || "N/A",
      Cell: ({ value }) => (
        <span style={{ fontWeight: "bold", color: "#344767", fontSize: "12px" }}>{value}</span>
      ),
    },
    {
      Header: "Комментария",
      accessor: (row) => row.description || "N/A",
      Cell: ({ value }) => (
        <span style={{ fontWeight: "bold", color: "#344767", fontSize: "12px" }}>{value}</span>
      ),
    },
  ];

  return (
    <DataTable
      table={{ columns, rows: data }}
      entriesPerPage={{ defaultValue: 1000 }}
      noEndBorder
    />
  );
};

export default DashboardProfitTable;

DashboardProfitTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object),
  value: PropTypes.string,
};
