// reservationSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  reservations: [],
  filters: {
    selectedMonth: null,
    selectedPharmacy: "all",
    selectedMedRep: null,
    selectedEntity: null,
    selectedType: "all",
    invoiceNumber: "",
  },
  medReps: [],
  pharmacies: [],
  hospitals: [],
  wholesales: [],
};

const reservationSlice = createSlice({
  name: "reservation",
  initialState,
  reducers: {
    setReservations: (state, action) => {
      state.reservations = action.payload;
    },
    setFilters: (state, action) => {
      console.log(action);
      state.filters = { ...state.filters, ...action.payload };
    },
    setMedReps: (state, action) => {
      state.medReps = action.payload;
    },
    setPharmacies: (state, action) => {
      state.pharmacies = action.payload;
    },
    setHospitals: (state, action) => {
      state.hospitals = action.payload;
    },
    setWholesales: (state, action) => {
      state.wholesales = action.payload;
    },
    setMonth: (state, action) => {
      state.filters.month = action.payload;
    },
    updateReservationDiscount: (state, action) => {
      const { id, discount } = action.payload;
      const reservationIndex = state.reservations.findIndex((res) => res.id === id);
      if (reservationIndex !== -1) {
        state.reservations[reservationIndex].discount = discount;
      }
    },
    updateReservationInvoiceNumber: (state, action) => {
      const { id, invoiceNumber } = action.payload;
      const reservationIndex = state.reservations.findIndex((res) => res.id === id);
      if (reservationIndex !== -1) {
        state.reservations[reservationIndex].invoice_number = invoiceNumber;
      }
    },
    updateReservationExpiryDate: (state, action) => {
      const { id, expireDate } = action.payload;
      const reservationIndex = state.reservations.findIndex((res) => res.id === id);

      if (reservationIndex !== -1) {
        state.reservations[reservationIndex].expire_date = expireDate;
      }
    },
  },
});

export const {
  setReservations,
  setFilters,
  setMedReps,
  setPharmacies,
  setHospitals,
  setWholesales,
  setMonth,
  updateReservationDiscount,
  updateReservationInvoiceNumber,
  updateReservationExpiryDate,
} = reservationSlice.actions;

// Selector to apply filters and return filtered data
export const selectFilteredReservations = (state) => {
  const { reservations, filters } = state.reservation;
  let filtered = reservations;

  // Apply filters
  if (filters.invoiceNumber) {
    filtered = filtered.filter((row) =>
      row.invoice_number.toString().includes(filters.invoiceNumber)
    );
  }

  if (filters.selectedMedRep) {
    filtered = filtered.filter(
      (row) =>
        row.pharmacy?.med_rep?.full_name === filters.selectedMedRep.full_name ||
        row.hospital?.med_rep?.full_name === filters.selectedMedRep.full_name
    );
  }

  if (filters.selectedEntity) {
    if (filters.selectedEntity.type === "Оптовик") {
      filtered = filtered.filter(
        (row) => row.wholesale?.company_name === filters.selectedEntity.name
      );
    } else {
      filtered = filtered.filter(
        (row) =>
          row.pharmacy?.company_name === filters.selectedEntity.company_name ||
          row.hospital?.company_name === filters.selectedEntity.company_name
      );
    }
  }

  if (filters.selectedType !== "all") {
    filtered = filtered.filter((row) => row[filters.selectedType.toLowerCase()] !== undefined);
  }

  // New filter based on selected reservation type (bron or faktura)
  if (filters.selectedDocumentType === "bron") {
    console.log("IF");

    filtered = filtered.filter((row) => row.checked === false);
  } else if (filters.selectedDocumentType === "faktura") {
    console.log("ELSE");

    filtered = filtered.filter((row) => row.checked === true);
  }

  return filtered;
};

export default reservationSlice.reducer;
