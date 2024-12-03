import {
  motion,
  useAnimationFrame,
  useMotionTemplate,
  useMotionValue,
  useTransform,
} from "framer-motion";
import React, { useRef } from "react";
import styles from "./BorderAnimationButton.module.css";

/**
 * Props for the BorderAnimationButton component.
 */
interface BorderAnimationButtonProps {
  /**
   * The content inside the button (usually text or elements).
   */
  children: React.ReactNode;

  /**
   * Function to be called when the button is clicked.
   */
  onClick: () => void;

  /**
   * Background color of the button's content area.
   * @default '#ffffff'
   */
  backgroundColor?: string;

  /**
   * Starting color for the gradient shadow effect.
   * @default '#4ed857'
   */
  shadowStartColor?: string;

  /**
   * Ending color for the gradient shadow effect.
   * @default '#2bcd9c'
   */
  shadowEndColor?: string;

  /**
   * Color of the animated line that moves around the button.
   * @default '#0cb100'
   */
  lineColor?: string;

  /**
   * Border radius of the button and its shadow, as a string.
   * @default '2rem'
   */
  borderRadius?: string;

  /**
   * Width of the border around the button, in pixels.
   * @default 3
   */
  borderWidth?: number;

  /**
   * The size of the animating line that moves around the button.
   * Can be a number (for pixel size) or a string with units.
   * @default 160
   */
  lineSize?: number | string;

  /**
   * Duration of the border animation, in seconds.
   * @default 4
   */
  animationDuration?: number;
}

/**
 * BorderAnimationButton is a customizable button with an animated border and shadow gradient effect.
 *
 * @param children - The content inside the button.
 * @param onClick - The function to be called when the button is clicked.
 * @param backgroundColor - The background color of the button content area.
 * @param shadowStartColor - The start color of the button's shadow gradient.
 * @param shadowEndColor - The end color of the button's shadow gradient.
 * @param lineColor - The color of the animating line around the button.
 * @param borderRadius - The border radius of the button and its shadow.
 * @param borderWidth - The width of the button's border.
 * @param lineSize - The size of the animated line around the button.
 * @param animationDuration - The duration of the border animation.
 */
const BorderAnimationButton: React.FC<BorderAnimationButtonProps> = ({
  children,
  onClick,
  backgroundColor = "rgb(var(--base-3x-dark))",
  shadowStartColor = "rgb(var(--primary-light))",
  shadowEndColor = "rgb(var(--primary-x-dark))",
  lineColor = "rgb(var(--primary-dark))",
  borderRadius = "2rem",
  borderWidth = 3,
  lineSize = 160,
  animationDuration = 4,
}) => {
  return (
    <div
      style={{
        position: "relative",
        width: "fit-content",
        height: "fit-content",
      }}
    >
      {/* Shadow div with a gradient background, positioned behind the button */}
      <div
        style={{
          borderRadius: borderRadius,
          backgroundImage: `linear-gradient(to bottom right, ${shadowStartColor}, ${shadowEndColor})`,
        }}
        className={styles.btnShadow}
      ></div>

      {/* Main button */}
      <button
        style={{
          borderRadius: borderRadius,
          padding: `${borderWidth}px`,
        }}
        onClick={onClick}
        className={styles.btn}
      >
        {/* Absolute positioned container for animated line */}
        <div
          style={{
            borderRadius: `calc(${borderRadius} * 0.96)`,
            position: "absolute",
            inset: 0,
          }}
        >
          {/* Border animation with configurable duration */}
          <BorderAnimation duration={animationDuration * 1000}>
            <div
              style={{
                width: lineSize,
                height: lineSize,
                backgroundImage: `radial-gradient(${lineColor} 35%, transparent 65%)`,
              }}
              className={styles.animatingLine}
            />
          </BorderAnimation>
        </div>

        {/* Button content (like text or icons) */}
        <div
          className={styles.btnContent}
          style={{
            borderRadius: `calc(${borderRadius} * 0.96)`,
            backgroundColor,
          }}
        >
          {children}
        </div>
      </button>
    </div>
  );
};

export default BorderAnimationButton;

interface BorderAnimationProps {
  children: React.ReactNode;
  duration?: number;
  rx?: string;
  ry?: string;
}

const BorderAnimation: React.FC<BorderAnimationProps> = ({
  children,
  duration = 4000,
  rx,
  ry,
}) => {
  const pathRef = useRef<any>();
  const progress = useMotionValue<number>(0);

  useAnimationFrame((time) => {
    const length = pathRef.current?.getTotalLength();
    if (length) {
      const pxPerMillisecond = length / duration;
      progress.set((time * pxPerMillisecond) % length);
    }
  });

  const x = useTransform(
    progress,
    (val) => pathRef.current?.getPointAtLength(val).x,
  );
  const y = useTransform(
    progress,
    (val) => pathRef.current?.getPointAtLength(val).y,
  );

  const transform = useMotionTemplate`translateX(${x}px) translateY(${y}px) translateX(-50%) translateY(-50%)`;

  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        style={{ position: "absolute" }}
        width="100%"
        height="100%"
      >
        <rect
          fill="none"
          width="100%"
          height="100%"
          rx={rx}
          ry={ry}
          ref={pathRef}
        />
      </svg>
      <motion.div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          display: "inline-block",
          transform,
        }}
      >
        {children}
      </motion.div>
    </>
  );
};
