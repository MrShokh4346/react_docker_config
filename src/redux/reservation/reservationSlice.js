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
} = reservationSlice.actions;

// Selector to apply filters and return filtered data
export const selectFilteredReservations = (state) => {
  const { reservations, filters } = state.reservation;
  let filtered = reservations;

  // Apply filters
  if (filters.invoice_number) {
    filtered = filtered.filter((row) =>
      row.invoice_number.toString().includes(filters.invoice_number)
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

  return filtered;
};

export default reservationSlice.reducer;