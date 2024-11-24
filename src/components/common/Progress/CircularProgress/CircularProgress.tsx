import { motion, MotionValue } from "framer-motion";
import React from "react";
import styles from "./CircularProgress.module.css";

type CircularProgressProps = {
  size: number; // Diameter of the circle
  strokeWidth: number; // Width of the circle outline
  pathLength: MotionValue<number>; // MotionValue controlling the path length
  color?: string; // Color of the path (default is black)
  backgroundColor?: string; // Color of the circle outline background (default is light gray)
  children?: React.ReactNode;
};

const CircularProgress: React.FC<CircularProgressProps> = ({
  size,
  strokeWidth,
  pathLength,
  color = "black",
  backgroundColor = "lightgray",
  children,
}) => {
  const radius = (size - strokeWidth) / 2;

  return (
    <div style={{ width: size, height: size }} className={styles.container}>
      <svg width={size} height={size} className={styles.svg}>
        {/* Background Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Foreground Path (Progress) */}
        <motion.path
          d={`
          M ${size / 2},${size / 2 - radius}
          A ${radius},${radius} 0 1,1 ${size / 2},${size / 2 + radius}
          A ${radius},${radius} 0 1,1 ${size / 2},${size / 2 - radius}
        `}
          stroke={color}
          className="stroke-violet-500"
          strokeWidth={strokeWidth}
          fill="none"
          style={{
            pathLength,
          }}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: size * 0.15,
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default CircularProgress;

type StaticCircularProgressProps = {
  size: number; // Diameter of the circle
  strokeWidth: number; // Width of the circle outline
  pathLength: number; // Fraction controlling the path length (0-1)
  color?: string; // Color of the path (default is black)
  backgroundColor?: string; // Color of the circle outline background (default is transparent)
  children?: React.ReactNode;
};

export const StaticCircularProgress: React.FC<StaticCircularProgressProps> = ({
  size,
  strokeWidth,
  pathLength,
  color = "black",
  backgroundColor = "transparent",
  children,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - pathLength);

  return (
    <div style={{ width: size, height: size }} className={styles.container}>
      <svg
        width={size}
        height={size}
        className={styles.svg}
        data-testid="circular-progress-svg"
      >
        {/* Background Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Foreground Path (Progress) */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: size * 0.15,
        }}
      >
        {children}
      </div>
    </div>
  );
};
