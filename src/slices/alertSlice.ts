import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Alert } from "../hooks/useAlerts";

interface AlertState {
  globalAlerts: Array<Alert>;
}

const initialState: AlertState = {
  globalAlerts: [],
};

const alertSlice = createSlice({
  name: "alert",
  initialState,
  reducers: {
    pushGlobalAlert: (state, action: PayloadAction<Alert>) => {
      state.globalAlerts = [...state.globalAlerts, action.payload];
    },
    removeGlobalAlert: (state, action: PayloadAction<Alert>) => {
      state.globalAlerts = [...state.globalAlerts].filter((alert) => {
        if (alert.id !== action.payload.id) return alert;
      });
    },
    clearGlobalAlerts: (state) => {
      return initialState;
    },
  },
  selectors: {
    selectGlobalAlerts: (session) => session.globalAlerts,
  },
});

export const { pushGlobalAlert, removeGlobalAlert, clearGlobalAlerts } =
  alertSlice.actions;

export const { selectGlobalAlerts } = alertSlice.selectors;

export default alertSlice;
