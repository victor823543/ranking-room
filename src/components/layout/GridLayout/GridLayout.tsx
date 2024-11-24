import React from "react";
import { GridLayoutProps } from "../../../types/GridLayoutTypes";
import styles from "./GridLayout.module.css";

// Define the GridLayout component with restricted props
export const GridLayout: React.FC<GridLayoutProps> = (props) => {
  return (
    <div className={styles.grid}>
      {Object.entries(props).map(([name, content], index) => (
        <React.Fragment key={index}>
          {content && <div className={styles[name]}>{content}</div>}
        </React.Fragment>
      ))}
    </div>
  );
};

export default GridLayout;
