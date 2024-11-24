import React from "react";
import styles from "./Dividers.module.css";

type DividerProps = {
  /** The color of the divider. */
  color?: string;

  /** The color of the text on the divider. Else same as divider. */
  textColor?: string;

  /** The thickness of the divider. */
  thickness?: string;

  /** The orientation of the divider. */
  orientation?: "horizontal" | "vertical";

  /** The margin of the divider. */
  margin?: string;

  /** The text to display on the divider. */
  children?: string;
};

const Divider: React.FC<DividerProps> = ({
  color = "black",
  textColor = color,
  thickness = "1px",
  orientation = "horizontal",
  margin,
  children,
}) => {
  const marginStyle =
    orientation === "horizontal"
      ? { margin: `${margin} 0` }
      : { margin: `0 ${margin}` };
  return (
    <div
      className={`${styles.divider} ${styles[orientation]}`}
      style={margin ? marginStyle : {}}
    >
      <div
        className={styles.line}
        style={{ borderColor: color, borderWidth: thickness }}
      />
      {children && (
        <span
          style={{ color: textColor }}
          className={`${styles.text} ${styles[`${orientation}Text`]}`}
        >
          {children}
        </span>
      )}
      <div
        className={styles.line}
        style={{ borderColor: color, borderWidth: thickness }}
      />
    </div>
  );
};

export default Divider;
