import React, { useState, useMemo } from "react";
import PropTypes from "prop-types";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DataTable from "examples/Tables/DataTable";
import { ChevronDown, ChevronRight } from "lucide-react";

const PharmacyInventoryTable = ({ data }) => {
  const [expandedRows, setExpandedRows] = useState({});

  const toggleRow = (id) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const columns = [
    { Header: "", accessor: "expander", width: "50px" },
    { Header: "Контр Агент", accessor: "company_name" },
    { Header: "Регион", accessor: "region" },
    { Header: "Общ.коль", accessor: "total_amount" },
  ];

  const rows = useMemo(() => {
    let result = [];
    data.forEach((item, index) => {
      result.push({
        expander: (
          <MDTypography
            component="a"
            href="#"
            color="text"
            onClick={(e) => {
              e.preventDefault();
              toggleRow(item.id);
            }}
          >
            {expandedRows[item.id] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </MDTypography>
        ),
        index: index + 1,
        company_name: item.company_name,
        region: item.region.name,
        total_amount: item.currntbalanceinstock.reduce((sum, stock) => sum + stock.amount, 0),
        rowBackgroundColor: expandedRows[item.id] ? "#f0f0f0" : "#fff",
      });

      if (expandedRows[item.id]) {
        item.currntbalanceinstock.forEach((stock, stockIndex) => {
          result.push({
            expander: "",
            index: `${index + 1}.${stockIndex + 1}`,
            company_name: `Препарат: ${stock.product.name}`,
            region: "",
            total_amount: `Коль: ${stock.amount} шт.`,
            rowBackgroundColor: "#f9f9f9",
          });
        });
      }
    });
    return result;
  }, [data, expandedRows]);

  return (
    <Card>
      <MDBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
        <MDBox>
          <MDTypography variant="h6" gutterBottom>
            Аптеки
          </MDTypography>
        </MDBox>
      </MDBox>
      <MDBox>
        <DataTable
          table={{
            columns,
            rows,
          }}
          showTotalEntries={false}
          isSorted={false}
          noEndBorder
          entriesPerPage={{ defaultValue: 100 }}
          getRowProps={(row) => ({
            style: {
              backgroundColor: row.original.rowBackgroundColor,
              fontWeight: row.index % 2 === 0 ? "bold" : "normal",
            },
          })}
          getCellProps={(cell) => ({
            style: {
              color: cell.column.id === "total_amount" ? "#4caf50" : "inherit",
            },
          })}
        />
      </MDBox>
    </Card>
  );
};

PharmacyInventoryTable.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      company_name: PropTypes.string.isRequired,
      region: PropTypes.shape({
        name: PropTypes.string.isRequired,
      }).isRequired,
      currntbalanceinstock: PropTypes.arrayOf(
        PropTypes.shape({
          amount: PropTypes.number.isRequired,
          product: PropTypes.shape({
            name: PropTypes.string.isRequired,
          }).isRequired,
        })
      ).isRequired,
    })
  ).isRequired,
};

export default PharmacyInventoryTable;
