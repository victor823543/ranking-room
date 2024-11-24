import { XMarkIcon } from "@heroicons/react/24/outline";
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/solid";
import classNames from "classnames";
import { SVGProps, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { RootState } from "../../../app/store";
import { Alert, AlertLink, AlertType } from "../../../hooks/useAlerts";
import { selectGlobalAlerts } from "../../../slices/alertSlice";
import styles from "./Alerts.module.css";

type AlertProps = {
  message: string;
  link?: AlertLink;
  closeable: boolean;
  duration?: number;
  onClose?: () => void;
  onDurationEnd?: () => void;
};

type AlertStylingProps = {
  variant: AlertType;
  Icon: React.FC<SVGProps<SVGElement>>;
};

const createAlertComponent = ({ variant, Icon }: AlertStylingProps) => {
  return ({
    message,
    link,
    closeable,
    duration,
    onClose,
    onDurationEnd,
  }: AlertProps) => {
    useEffect(() => {
      if (duration) {
        const timer = setTimeout(() => {
          if (onDurationEnd !== undefined) {
            onDurationEnd();
          }
        }, duration * 1000);
        return () => clearTimeout(timer);
      }
    }, [duration]);
    return (
      <div
        className={`${styles.alert} ${styles[variant]}`}
        data-cy={`${variant}-alert`}
      >
        <div className={styles.iconWrapper}>
          <Icon className={styles.icon} />
        </div>
        <div className={styles.text}>
          <span>{message}</span>
          {link && (
            <Link to={link.to} className={styles.link}>
              {link.title}
            </Link>
          )}
        </div>
        {closeable && (
          <button
            className={styles.close}
            onClick={() => {
              onClose && onClose();
            }}
          >
            <XMarkIcon className={styles.closeIcon} />
          </button>
        )}
      </div>
    );
  };
};

const WarningAlert = createAlertComponent({
  variant: AlertType.Warning,
  Icon: ExclamationTriangleIcon as React.FC<SVGProps<SVGElement>>,
});

const ErrorAlert = createAlertComponent({
  variant: AlertType.Error,
  Icon: ExclamationTriangleIcon as React.FC<SVGProps<SVGElement>>,
});

const SuccessAlert = createAlertComponent({
  variant: AlertType.Success,
  Icon: CheckCircleIcon as React.FC<SVGProps<SVGElement>>,
});

type AlertsProps = {
  list: Array<Alert>;
  hasSidebar?: boolean;
  onClose?: (item: Alert) => void;
  onDurationEnd?: (item: Alert) => void;
};

const Alerts: React.FC<AlertsProps> = ({
  list,
  hasSidebar = true,
  onClose,
  onDurationEnd,
}) => {
  const globalAlerts = useSelector((state: RootState) =>
    selectGlobalAlerts(state),
  );

  const alerts = useMemo(() => list.concat(globalAlerts), [list, globalAlerts]);
  return (
    <div
      className={classNames(
        styles.container,
        { [styles.hasSidebar]: hasSidebar },
        { [styles.noSidebar]: !hasSidebar },
      )}
    >
      <div className={styles.alertList}>
        {alerts
          .filter((item) => item.type === AlertType.Error)
          .map((item) => (
            <ErrorAlert
              key={item.id}
              message={item.message}
              link={item.link}
              closeable={item.closeable}
              duration={item.duration}
              onClose={() => onClose?.(item)}
              onDurationEnd={() => onDurationEnd?.(item)}
            />
          ))}
        {alerts
          .filter((item) => item.type === AlertType.Warning)
          .map((item) => (
            <WarningAlert
              key={item.id}
              message={item.message}
              link={item.link}
              closeable={item.closeable}
              duration={item.duration}
              onClose={() => onClose?.(item)}
              onDurationEnd={() => onDurationEnd?.(item)}
            />
          ))}
        {alerts
          .filter((item) => item.type === AlertType.Success)
          .map((item) => (
            <SuccessAlert
              key={item.id}
              message={item.message}
              link={item.link}
              closeable={item.closeable}
              duration={item.duration}
              onClose={() => onClose?.(item)}
              onDurationEnd={() => onDurationEnd?.(item)}
            />
          ))}
      </div>
    </div>
  );
};

export default Alerts;
