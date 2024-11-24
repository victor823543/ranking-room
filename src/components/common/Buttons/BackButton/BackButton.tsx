import { ChevronLeftIcon } from "@heroicons/react/24/solid";
import React from "react";
import styles from "./BackButton.module.css";

type BackButtonProps = {
  onClick?: () => void;
};

export const BackButton: React.FC<BackButtonProps> = ({ onClick }) => {
  return (
    <button
      className={styles.backButton}
      onClick={onClick ? () => onClick() : () => window.history.back()}
    >
      <ChevronLeftIcon className={styles.backIcon} />
      <span>Back</span>
    </button>
  );
};
