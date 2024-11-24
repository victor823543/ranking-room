import { useEffect, useRef, useState } from "react";
import { to1Dec } from "../../../utils/functions/numberFunctions";
import styles from "./RangeInput.module.css";

type RangeInputProps = {
  min: number;
  max: number;
  step?: number;
  color?: string;
  startValue?: number;
  onDragEnd: (value: number) => void;
  fieldColor?: string;
  fillColor?: string;
  showValue?: "right-side" | "left-side" | "inside" | "none";
  showDragValue?: boolean;
  height?: string;
};

export const RangeInput: React.FC<RangeInputProps> = ({
  min,
  max,
  step = 1,
  startValue,
  onDragEnd,
  fieldColor = "rgba(var(--base-x-dark), 0.4)",
  fillColor = "rgb(var(--primary))",
  color = "white",
  showValue = "none",
  showDragValue = true,
  height = "2rem",
}) => {
  const [value, setValue] = useState(startValue || min);
  const [fillWidth, setFillWidth] = useState(
    (startValue ? startValue - min / (max - min) : 0) * 100,
  );
  const [isDragging, setIsDragging] = useState(false);
  const [cursorX, setCursorX] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setValue(startValue || min);
  }, [startValue, min]);

  // Update fill width when value changes
  useEffect(() => {
    setFillWidth(((value - min) / (max - min)) * 100);
  }, [value, min, max]);

  const handleMove = (clientX: number) => {
    setCursorX(clientX);
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const newValue = Math.min(
        max,
        Math.max(min, ((clientX - rect.left) / rect.width) * (max - min) + min),
      );
      setValue(newValue);
      return newValue;
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    handleMove(e.clientX); // Initial call to set the first value
    setIsDragging(true);

    const handleMouseMove = (e: MouseEvent) => handleMove(e.clientX);
    const handleMouseUp = () => {
      setIsDragging(false);
      setValue((prevValue) => {
        const adjustedValue = Math.round((prevValue - min) / step) * step + min;
        setTimeout(() => onDragEnd(adjustedValue), 0);
        return adjustedValue;
      });
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX); // Initial call to set the first value
    setIsDragging(true);

    const handleTouchMove = (e: TouchEvent) => handleMove(e.touches[0].clientX);
    const handleTouchEnd = () => {
      setIsDragging(false);
      setValue((prevValue) => {
        const adjustedValue = Math.round((prevValue - min) / step) * step + min;
        setTimeout(() => onDragEnd(adjustedValue), 0);
        return adjustedValue;
      });
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };

    document.addEventListener("touchmove", handleTouchMove);
    document.addEventListener("touchend", handleTouchEnd);
  };

  return (
    <div
      className={`${styles.container} ${showValue === "left-side" ? styles.numLeft : showValue === "right-side" ? styles.numRight : ""}`}
      style={
        {
          "--fill-color": fillColor,
          "--field-color": fieldColor,
          "--text-color": color,
          "--height": height,
        } as React.CSSProperties
      }
    >
      {["left-side", "right-side"].includes(showValue) && (
        <div
          className={`${styles.valueDisplay}`}
          style={{ left: `${fillWidth}%` }}
        >
          {step % 1 !== 0 ? to1Dec(value) : Math.round(value)}
        </div>
      )}
      <div
        className={styles.inputContainer}
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        <div
          className={styles.field}
          style={{
            backgroundColor: fieldColor,
          }}
        >
          <div
            className={styles.fill}
            style={{ width: `${fillWidth}%`, backgroundColor: fillColor }}
          ></div>
        </div>
        {/* Display drag tooltip if `showDragValue` is true and dragging */}
        {showDragValue && isDragging && (
          <div
            className={styles.dragValue}
            style={{
              left: `${cursorX - (containerRef.current?.getBoundingClientRect().left || 0)}px`,
              opacity:
                cursorX >=
                  (containerRef.current?.getBoundingClientRect().left || 0) &&
                cursorX <=
                  (containerRef.current?.getBoundingClientRect().right || 0)
                  ? 1
                  : 0,
            }}
          >
            {step % 1 !== 0 ? to1Dec(value) : Math.round(value)}
          </div>
        )}
      </div>
    </div>
  );
};

export default RangeInput;
