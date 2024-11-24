import { motion, useAnimate } from "framer-motion";
import React from "react";
import Divider from "../Dividers/Dividers";
import styles from "./ChoiceBoxes.module.css";

type ChoiceBoxesProps = {
  boxes: Array<{
    title: string;
    content: React.ReactNode;
    id: string;
  }>;
  onClick: ({
    title,
    id,
    index,
  }: {
    title: string;
    id: string;
    index: number;
  }) => void;
  animateOutOnClick?: boolean;
  onAnimateOutComplete?: () => void;
};

const ChoiceBoxes: React.FC<ChoiceBoxesProps> = ({
  boxes,
  onClick,
  animateOutOnClick,
  onAnimateOutComplete,
}) => {
  const [scope, animate] = useAnimate();

  const animateOut = async (index: number) => {
    for (let i = 0; i < boxes.length - 1; i++) {
      animate(
        `#box-${i}`,
        { opacity: 0, y: -100, filter: "blur(10px)" },
        {
          delay: 0.1 * i,
          ease: "easeIn",
          duration: 0.3,
        },
      );
    }
    await animate(
      `#box-${boxes.length - 1}`,
      { opacity: 0, y: -100, filter: "blur(10px)" },
      {
        delay: 0.1 * (boxes.length - 1),
        ease: "easeIn",
        duration: 0.3,
      },
    );
  };

  const handleClick = async ({
    title,
    id,
    index,
  }: {
    title: string;
    id: string;
    index: number;
  }) => {
    onClick({ title, id, index });
    if (animateOutOnClick) {
      await animateOut(index);
      onAnimateOutComplete && onAnimateOutComplete();
    }
  };

  return (
    <div className={styles.container} ref={scope}>
      {boxes.map((box, index) => (
        <motion.div
          key={box.id}
          id={`box-${index}`}
          className={`box ${styles.box}`}
          onClick={() => handleClick({ title: box.title, id: box.id, index })}
          custom={index}
          variants={boxVariants}
          initial="hidden"
          animate="visible"
          whileHover={{ scale: 1.05 }}
          //   whileTap={{ scale: 0.95 }}
        >
          <motion.h3
            className={styles.title}
            variants={itemVariants}
            initial="hidden"
            animate="visible"
          >
            {box.title}
          </motion.h3>
          <Divider
            orientation="horizontal"
            thickness="1px"
            color="rgb(var(--base-mid))"
          />
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className={styles.contentWrapper}
          >
            {box.content}
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
};

const boxVariants = {
  hidden: (i: number) => ({
    opacity: 0,
    y: -70,
    transition: {
      delay: i * 0.1,
    },
  }),
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.25,
      ease: "easeOut",
      when: "beforeChildren",
      staggerChildren: 0.15,
    },
  }),
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default ChoiceBoxes;
