import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { format } from "date-fns";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axiosInstance from "services/axiosInstance";

const ViewReservationHistory = ({ open, handleClose, reservationId }) => {
  const accessToken = useSelector((state) => state.auth.accessToken);
  const [data, setData] = useState([]);
  const getReservationHistory = async () => {
    try {
      const { data } = await axiosInstance.get(
        `https://it-club.uz/mr/get-${
          reservationId.type === undefined ? "hospital-" : ""
        }reservation-history/${reservationId.reservationId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setData(data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getReservationHistory();
  }, [reservationId]);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      maxWidth="md" // Adjust the max width of the dialog
      fullWidth
    >
      <DialogTitle id="alert-dialog-title">История поступлений</DialogTitle>
      <DialogContent>
        <TableContainer component={Paper} style={{ minWidth: 600 }}>
          <Table aria-label="simple table">
            <TableBody>
              <TableRow>
                <TableCell
                  style={{
                    fontWeight: "bold",
                    textAlign: "center",
                    padding: "10px",
                  }}
                >
                  Поступление
                </TableCell>
                <TableCell
                  style={{
                    fontWeight: "bold",
                    textAlign: "center",
                    padding: "10px",
                  }}
                >
                  Дата
                </TableCell>
                <TableCell
                  style={{
                    fontWeight: "bold",
                    textAlign: "center",
                    padding: "10px",
                  }}
                >
                  Сумма
                </TableCell>
              </TableRow>
              {data.map((dat, key) => (
                <TableRow key={key}>
                  <TableCell style={{ textAlign: "center", padding: "10px" }}>
                    {dat.description}
                  </TableCell>
                  <TableCell style={{ textAlign: "center", padding: "10px" }}>
                    {format(new Date(dat.date), "MM-dd-yyyy")}
                  </TableCell>
                  <TableCell style={{ textAlign: "center", padding: "10px" }}>
                    {dat.amount.toLocaleString("ru-RU")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} autoFocus>
          выход
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ViewReservationHistory.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  reservationId: PropTypes.object.isRequired,
};

export default ViewReservationHistory;