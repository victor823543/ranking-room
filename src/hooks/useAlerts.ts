import { useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { AppDispatch } from "../app/store";
import {
  clearGlobalAlerts,
  pushGlobalAlert,
  removeGlobalAlert,
} from "../slices/alertSlice";

export type Alert = {
  id: string;
  type: AlertType;
  message: string;
  link?: AlertLink;
  closeable: boolean;
  duration?: number;
  global: boolean;
};

export type AlertLink = {
  title: string;
  to: string;
  reload?: boolean;
};

export enum AlertType {
  Warning = "warning",
  Error = "error",
  Success = "success",
}

export const useAlerts = (defaultAlert?: Alert) => {
  const { state } = useLocation();
  const dispatch: AppDispatch = useDispatch();

  const defaults: Array<Alert> = defaultAlert ? [defaultAlert] : [];

  if (state && state.error) {
    defaults.push(state.error as Alert);
    window.history.replaceState({}, "");
  }

  const [alerts, setAlerts] = useState<Array<Alert>>(defaults);

  const pushAlert = (item: Alert) => {
    if (item.global) {
      dispatch(pushGlobalAlert(convertToSerializable(item)));
    } else {
      setAlerts((prev) => [...prev, item]);
    }
  };

  const removeAlert = (item: Alert) => {
    if (item.global) {
      dispatch(removeGlobalAlert(convertToSerializable(item)));
    } else {
      setAlerts((prev) => prev.filter((alert) => alert !== item));
    }
  };

  const clearAlerts = () => {
    dispatch(clearGlobalAlerts());
    setAlerts([]);
  };

  return {
    alerts,
    pushAlert,
    removeAlert,
    clearAlerts,
  };
};

class AlertBase {
  id: string;
  type: AlertType;
  message: string;
  link?: AlertLink;
  closeable: boolean;
  duration?: number;
  global: boolean;

  constructor(
    type: AlertType,
    message: string,
    link?: AlertLink,
    closeable: boolean = true,
    duration?: number,
    global: boolean = false,
  ) {
    this.id = crypto.randomUUID();
    this.type = type;
    this.message = message;
    this.link = link;
    this.closeable = closeable;
    this.duration = duration;
    this.global = global;
  }
}

type OptionalAlertOptions = {
  link?: AlertLink;
  closeable?: boolean;
  duration?: number;
  global?: boolean;
};

export class WarningAlert extends AlertBase {
  constructor(
    message: string,
    { link, closeable, duration, global }: OptionalAlertOptions = {},
  ) {
    super(AlertType.Warning, message, link, closeable, duration, global);
  }
}

export class ErrorAlert extends AlertBase {
  constructor(
    message: string,
    { link, closeable, duration, global }: OptionalAlertOptions = {},
  ) {
    super(AlertType.Error, message, link, closeable, duration, global);
  }
}

export class SuccessAlert extends AlertBase {
  constructor(
    message: string,
    { link, closeable, duration, global }: OptionalAlertOptions = {},
  ) {
    super(AlertType.Success, message, link, closeable, duration, global);
  }
}

const convertToSerializable = (alert: Alert): Alert => {
  const serializableAlert = {
    ...alert,
    id: alert.id,
    type: alert.type,
    message: alert.message,
    link: alert.link ? { ...alert.link } : undefined,
    closeable: alert.closeable,
    global: alert.global,
  };
  return serializableAlert;
};
