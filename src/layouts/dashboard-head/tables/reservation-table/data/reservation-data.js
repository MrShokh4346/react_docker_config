import { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  setReservations,
  selectFilteredReservations,
} from "../../../../../redux/reservation/reservationSlice"; // Import the reservation actions
import MDTypography from "components/MDTypography";
import { format, differenceInDays } from "date-fns";
import { IconButton, Switch, Tooltip, Snackbar, Alert, Button } from "@mui/material";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import EditIcon from "@mui/icons-material/Edit";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import DeleteIcon from "@mui/icons-material/Delete";
import AssignmentReturnIcon from "@mui/icons-material/AssignmentReturn";
import ViewProductListDialog from "../../../dialogs/reservation-product-list-dialog";
import axiosInstance from "services/axiosInstance";
import ExpiryDateDialog from "layouts/dashboard-head/dialogs/edit-expiry-date-dialog";
import { useNavigate } from "react-router-dom";
import userRoles from "constants/userRoles";
import ViewReservationHistory from "layouts/dashboard-head/dialogs/view-reservation-history";
import axios from "axios";
import { updateReservationExpiryDate } from "../../../../../redux/reservation/reservationSlice"; // Update with the actual path

export default function useReservationData(checked) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Fetching reservations and user details from Redux
  const { reservations, filters } = useSelector((state) => state.reservation);
  const { selectedMonth } = filters;

  const { accessToken, userRole } = useSelector((state) => state.auth);

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [reservation, setReservation] = useState({});
  const [productListDialogOpen, setProductListDialogOpen] = useState(false);
  const filteredReservations = useSelector(selectFilteredReservations);

  // Memoize the sorted reservations
  const sortedReservations = useMemo(() => {
    return [...filteredReservations].sort((a, b) => {
      const dateComparison = new Date(b.date) - new Date(a.date);
      return dateComparison !== 0 ? dateComparison : b.id - a.id;
    });
  }, [filteredReservations]);

  const handleProductListDialogOpen = () => {
    setProductListDialogOpen(true);
  };

  const handleProductListDialogClose = () => {
    setProductListDialogOpen(false);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    // Fetch reservations if they don't exist or if selectedMonth has changed
    if (!filteredReservations.length || selectedMonth) {
      fetchReservations(selectedMonth); // Pass selectedMonth to the fetch function
    }
  }, [accessToken, selectedMonth]);

  useEffect(() => {
    fetchReservations();
  }, [checked]);

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleOpenDialog = (reservation) => {
    setSelectedReservation(reservation);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleUpdateExpiryDate = async (newDate) => {
    const type = getRsrvType(selectedReservation);
    try {
      const response = await axiosInstance.post(
        `http://localhost:8000/head/update-${
          type === "pharmacy" ? "" : `${type}-`
        }reservation-expire-date/${selectedReservation.id}`,
        { date: newDate },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.status === 200) {
        fetchReservations();
        dispatch(updateReservationExpiryDate({ id: selectedReservation.id, expireDate: newDate }));

        setSnackbar({
          open: true,
          message: "Срок истечения изменен!",
          severity: "success",
        });
      }
    } catch (error) {
      console.error("Failed to update expiry date", error);
      setSnackbar({
        open: true,
        message: "Не удалось изменить срок истечения",
        severity: "error",
      });
    }
    handleCloseDialog();
  };

  async function fetchReservations() {
    setIsLoading(true);
    try {
      const apiPath = !selectedMonth
        ? "head/get-all-reservations"
        : `head/get-all-reservations?month_number=${selectedMonth}`;
      const response = await axiosInstance.get(apiPath, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Sort the reservations by the 'date' property in descending order
      // const filteredReservations = response.data.sort((a, b) => {
      //   const dateComparison = new Date(b.date) - new Date(a.date);
      //   if (dateComparison !== 0) {
      //     return dateComparison;
      //   }
      //   return b.id - a.id;
      // });

      const data = response.data.filter((data) => data.checked === checked);

      // Store the fetched reservations in Redux
      dispatch(setReservations(data));
    } catch (error) {
      console.error("Error fetching reservations", error);

      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  }

  const handleDelete = async (rsrv) => {
    if (window.confirm("Вы уверены что хотите выполнить это действие?")) {
      const type = getRsrvType(rsrv);
      let url = "";

      switch (type) {
        case "pharmacy":
          url = `http://localhost:8000/head/delete-reservation/${rsrv.id}`;
          break;
        case "wholesale":
          url = `http://localhost:8000/head/delete-wholesale-reservation/${rsrv.id}`;
          break;
        case "hospital":
          url = `http://localhost:8000/head/delete-hospital-reservation/${rsrv.id}`;
          break;
      }

      try {
        await axiosInstance.delete(url, null, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        // Dispatch an action to remove the deleted reservation from Redux
        dispatch(setReservations(reservations.filter((row) => row.id !== rsrv.id)));

        setSnackbar({ open: true, message: "Бронирование удалено", severity: "success" });
      } catch (error) {
        console.log("Failed to delete reservation", error);
        setSnackbar({ open: true, message: "Не удалось удалить бронирование", severity: "error" });
      }
    }
  };

  // Column and row construction as before
  const constructColumns = () => {
    let columns = [
      { Header: "Дата реализаци", accessor: "expiry_date", align: "left" },
      { Header: "Сумма с/ф", accessor: "total_payable", align: "left" },
      { Header: "Номер с/ф", accessor: "invoice_number", align: "left" },
      { Header: "Контрагент", accessor: "company_name", align: "left" },
      { Header: "Поступление", accessor: "profit", align: "center" },
      { Header: "Дебитор", accessor: "debt", align: "center" },
      { Header: "Скидка %", accessor: "discount", align: "center" },
      { Header: "Дата брони", accessor: "date_reservation", align: "left" },
      { Header: "Одобрено", accessor: "check", align: "left" },
      { Header: "Производитель", accessor: "man_company", align: "left" },
      { Header: "Промо", accessor: "promo", align: "left" },
      { Header: "Возврат цена", accessor: "returned_price", align: "left" },
      { Header: "Регион", accessor: "region", align: "left" },
      { Header: "История Поступлений", accessor: "view", align: "left" },
      { Header: "Список продуктов", accessor: "product_list", align: "center" },
      { Header: "МП", accessor: "med_rep", align: "left" },
      { Header: "Тип К/А", accessor: "type", align: "center" },
      { Header: "ИНН", accessor: "ibt", align: "center" },
      { Header: "Скачать", accessor: "download", align: "center" },
    ];

    if (userRole === userRoles.HEAD_OF_ORDERS) {
      columns.splice(
        -1,
        0,
        { Header: "Возвратить", accessor: "return", align: "center" },
        { Header: "Удалить", accessor: "delete", align: "center" } // Added delete column
      );
      columns.splice(-8, 0, { Header: "Действие", accessor: "add", align: "left" });
    }

    return columns;
  };

  const constructRows = () => {
    return sortedReservations.map((rsrv) => {
      const entity = rsrv.pharmacy || rsrv.hospital || rsrv.wholesale;
      const daysSinceImplementation = differenceInDays(
        new Date(),
        new Date(rsrv.date_implementation)
      );
      const rowBackgroundColor =
        rsrv.checked &&
        daysSinceImplementation > (getRsrvType(rsrv) === "wholesale" ? 60 : 30) &&
        rsrv.debt > 5000
          ? "#f77c48"
          : rsrv.checked && rsrv.debt < 5000
          ? "#88f2a1"
          : "white";

      return {
        expiry_date: (
          <div style={{ display: "flex", alignItems: "center" }}>
            <MDTypography variant="caption" fontWeight="medium">
              {format(new Date(rsrv.date_implementation), "dd/MM/yyyy")}
            </MDTypography>
            {userRole === userRoles.HEAD_OF_ORDERS && (
              <IconButton
                size="small"
                onClick={() => handleOpenDialog(rsrv)}
                style={{ marginLeft: "8px" }}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            )}
          </div>
        ),
        total_payable: (
          <MDTypography variant="caption" fontWeight="medium">
            {rsrv.total_payable_with_nds?.toLocaleString("ru-RU")} сум
          </MDTypography>
        ),
        invoice_number: (
          <MDTypography variant="caption" fontWeight="medium">
            <div style={{ display: "flex", alignItems: "center" }}>
              <MDTypography variant="caption" fontWeight="medium">
                {rsrv.invoice_number}
              </MDTypography>
              {userRole === userRoles.HEAD_OF_ORDERS && (
                <IconButton
                  size="small"
                  onClick={() =>
                    navigate("/head/set-invoice-number", {
                      state: { reservationId: rsrv.id, type: getRsrvType(rsrv) },
                    })
                  }
                  style={{ marginLeft: "8px" }}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              )}
            </div>
          </MDTypography>
        ),
        company_name: (
          <Tooltip title={entity.company_name} arrow>
            <MDTypography variant="caption" fontWeight="medium">
              {entity.company_name.length > 20
                ? `${entity.company_name.substring(0, 20)}...`
                : entity.company_name}
            </MDTypography>
          </Tooltip>
        ),
        region: (
          <MDTypography variant="caption" fontWeight="medium">
            {entity.region ? entity.region.name : "-"}
          </MDTypography>
        ),
        med_rep: (
          <MDTypography variant="caption" fontWeight="medium">
            {entity.med_rep?.full_name || "-"}
          </MDTypography>
        ),
        type: (
          <MDTypography variant="caption" fontWeight="medium">
            {getRsrvTypeRussian(rsrv)}
          </MDTypography>
        ),
        ibt: (
          <MDTypography variant="caption" fontWeight="medium">
            {entity.inter_branch_turnover || "-"}
          </MDTypography>
        ),
        profit: (
          <MDTypography variant="caption" fontWeight="medium">
            {rsrv.profit.toLocaleString("ru-RU")}
          </MDTypography>
        ),
        debt: (
          <MDTypography variant="caption" fontWeight="medium">
            {rsrv.checked ? rsrv.debt.toLocaleString("ru-RU") : 0}
          </MDTypography>
        ),
        discount: (
          <div style={{ display: "flex", alignItems: "center" }}>
            <MDTypography variant="caption" fontWeight="medium">
              {rsrv.discount ? `${rsrv.discount} %` : "0"}
            </MDTypography>
            {userRole === userRoles.HEAD_OF_ORDERS &&
              (rsrv.checked ? (
                <Tooltip title="Уже одобрено">
                  <span>
                    <IconButton
                      size="small"
                      onClick={() => {}}
                      style={{ marginLeft: "8px" }}
                      disabled
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </span>
                </Tooltip>
              ) : (
                <Tooltip title="Установить скидку">
                  <IconButton
                    size="small"
                    onClick={() =>
                      navigate("/head/set-discount", {
                        state: { reservationId: rsrv.id, type: getRsrvType(rsrv) },
                      })
                    }
                    style={{ marginLeft: "8px" }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              ))}
          </div>
        ),
        date_reservation: (
          <MDTypography variant="caption" fontWeight="medium">
            {format(new Date(rsrv.date), "dd/MM/yyyy")}
          </MDTypography>
        ),
        checked: getStatusIndicator(rsrv.checked),
        check:
          userRole === userRoles.HEAD_OF_ORDERS ? (
            <Switch checked={rsrv.checked} onChange={() => confirmToggle(rsrv)} color="warning" />
          ) : (
            getStatusIndicator(rsrv.checked)
          ),
        man_company: (
          <MDTypography variant="caption" fontWeight="medium">
            {entity.manufactured_company || "-"}
          </MDTypography>
        ),
        promo: (
          <MDTypography variant="caption" fontWeight="medium">
            {entity.promo?.toLocaleString("ru-RU")}
          </MDTypography>
        ),
        returned_price: (
          <MDTypography variant="caption" fontWeight="medium">
            {rsrv.returned_price?.toLocaleString("ru-RU")}
          </MDTypography>
        ),
        add: !rsrv.checked ? (
          <Tooltip title="Сначала необходимо одобрить бронь">
            <span>
              <Button
                variant="contained"
                color="success"
                sx={{ color: "white" }}
                style={{ cursor: "not-allowed" }}
                disabled
              >
                Поступление
              </Button>
            </span>
          </Tooltip>
        ) : (
          <Button
            variant="contained"
            color="success"
            sx={{ color: "white" }}
            style={{ cursor: "pointer" }}
            onClick={() => {
              const type = getRsrvType(rsrv);
              let path = "/head/pay-reservation-";

              switch (type) {
                case "pharmacy":
                  path += "pharmacy";
                  break;
                case "wholesale":
                  path += "wholesale";
                  break;
                case "hospital":
                  path += "hospital";
                  break;
              }

              navigate(path, {
                state: {
                  reservationId: rsrv.id,
                  invoice_number: rsrv.invoice_number,
                  med_rep_id: rsrv.pharmacy?.med_rep?.id,
                  realized_debt: rsrv.reailized_debt,
                },
              });
            }}
          >
            Поступление
          </Button>
        ),
        view: (
          <Tooltip title="История поступлений">
            <IconButton
              onClick={() => {
                handleClickOpen();
                setReservation({ id: rsrv.id, type: getRsrvType(rsrv) });
              }}
              sx={{
                "&:hover": {
                  backgroundColor: "#e0f2f1",
                },
              }}
            >
              <RemoveRedEyeIcon />
            </IconButton>
          </Tooltip>
        ),
        download: (
          <Tooltip title="Загрузить отчет">
            <IconButton
              sx={{
                "&:hover": {
                  backgroundColor: "#e0f2f1",
                },
              }}
              onClick={() => downloadReport(rsrv)}
            >
              <CloudDownloadIcon />
            </IconButton>
          </Tooltip>
        ),
        product_list: (
          <Tooltip title="Просмотр списка продуктов">
            <IconButton
              onClick={() => {
                setReservation({ id: rsrv.id, type: getRsrvType(rsrv), checked: rsrv.checked });
                handleProductListDialogOpen(rsrv);
              }}
              sx={{
                "&:hover": {
                  backgroundColor: "#e0f2f1",
                },
              }}
            >
              <RemoveRedEyeIcon />
            </IconButton>
          </Tooltip>
        ),
        return:
          getRsrvType(rsrv) !== "wholesale" ? (
            <Tooltip title="Возврат">
              <span>
                <IconButton
                  onClick={() =>
                    navigate("/head/return-product", {
                      state: { reservationId: rsrv.id, reservationType: getRsrvType(rsrv) },
                    })
                  }
                >
                  <AssignmentReturnIcon />
                </IconButton>
              </span>
            </Tooltip>
          ) : (
            <Tooltip title="Возврат не осуществим оптовикам">
              <span>
                <IconButton disabled>
                  <AssignmentReturnIcon />
                </IconButton>
              </span>
            </Tooltip>
          ),
        delete: rsrv.checked ? (
          <Tooltip title="Уже одобрено">
            <span>
              <IconButton sx={{ color: "red" }} disabled>
                <DeleteIcon />
              </IconButton>
            </span>
          </Tooltip>
        ) : (
          <Tooltip title="Удалить">
            <IconButton sx={{ color: "red" }} onClick={() => handleDelete(rsrv)}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        ),
        rowBackgroundColor,
      };
    });
  };

  // Memoize constructColumns to avoid re-running when userRole doesn't change
  const columns = useMemo(() => constructColumns(), [userRole]);

  // Memoize constructRows to avoid re-running when sortedReservations don't change
  const rows = useMemo(() => constructRows(), [sortedReservations]);

  function getRsrvTypeRussian(rsrv) {
    if (rsrv.pharmacy) {
      return "Аптека";
    } else if (rsrv.hospital) {
      return "Больница";
    } else if (rsrv.wholesale) {
      return "Оптовик";
    }
  }

  function getStatusIndicator(checked) {
    return (
      <div
        style={{
          backgroundColor: checked ? "#57da79" : "#ffb938",
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
          {checked ? "Проверено" : "Не проверено"}
        </MDTypography>
      </div>
    );
  }

  function confirmToggle(rsrv) {
    if (rsrv.checked) {
      setSnackbar({
        open: true,
        message: "Уже одобрено",
        severity: "warning",
      });
    } else {
      if (window.confirm("Вы уверены что хотите выполнить это действие?")) {
        toggleChecked(rsrv);
      }
    }
  }

  async function toggleChecked(rsrv) {
    const newChecked = !rsrv.checked;
    const type = getRsrvType(rsrv);
    try {
      await axiosInstance.post(
        `http://localhost:8000/head/check-${type === "pharmacy" ? "" : `${type}-`}reservation/${
          rsrv.id
        }`,
        {
          checked: newChecked,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      rsrv.checked = newChecked;
      rsrv.status = getStatusIndicator(newChecked);
      fetchReservations(); // Refresh the data
      setSnackbar({
        open: true,
        message: "Одобрено",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.detail,
        severity: "error",
      });
    }
  }

  function downloadReport(rsrv) {
    const type = getRsrvType(rsrv);
    const entity = rsrv.pharmacy || rsrv.hospital || rsrv.wholesale;
    const url =
      type === "wholesale"
        ? `http://localhost:8000/ws/get-wholesale-report/${rsrv.id}`
        : `http://localhost:8000/mr/get-${type === "pharmacy" ? "" : `${type}-`}report/${rsrv.id}`;
    axios({
      url: url,
      method: "GET",
      responseType: "blob", // Important
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((response) => {
        let filename = `${entity.company_name}_${format(new Date(rsrv.date), "dd/MM/yyyy")}`;

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${filename}.xlsx` || `report-${rsrv.id}.xlsx`);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      })
      .catch((error) => console.error("Download error", error));
  }

  return {
    columns,
    rows,
    expired_debt: filteredReservations.reduce((sum, r) => sum + parseFloat(r.debtValue), 0),
    ExpiryDateDialogComponent: (
      <>
        <ExpiryDateDialog
          open={openDialog}
          handleClose={handleCloseDialog}
          handleSubmit={handleUpdateExpiryDate}
          currentExpiryDate={selectedReservation?.expire_date}
        />
        <ViewReservationHistory open={open} handleClose={handleClose} reservation={reservation} />
        <ViewProductListDialog
          open={productListDialogOpen}
          handleClose={handleProductListDialogClose}
          reservation={reservation}
        />
      </>
    ),
    SnackbarComponent: (
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    ),
    isLoading,
  };
}

function getRsrvType(rsrv) {
  if (rsrv.pharmacy) {
    return "pharmacy";
  } else if (rsrv.hospital) {
    return "hospital";
  } else if (rsrv.wholesale) {
    return "wholesale";
  }
}
