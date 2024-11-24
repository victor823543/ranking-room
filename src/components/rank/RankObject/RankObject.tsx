import { PhotoIcon } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";
import React from "react";
import { useDragObjectsContext } from "../../../provider/dragObjectsProvider";
import { Object } from "../../../types/Room";
import styles from "./RankObject.module.css";

type RankObjectProps = {
  object: Object;
};

const RankObject: React.FC<RankObjectProps> = ({ object }) => {
  const { setDraggedItem, handleDrop } = useDragObjectsContext();

  return (
    <motion.div
      variants={objectVariants}
      initial="normal"
      whileDrag="dragging"
      className={styles.object}
      drag
      dragSnapToOrigin
      key={object._id}
      dragConstraints={{ left: 0 }}
      onDragStart={() => setDraggedItem(object)}
      onDragEnd={handleDrop}
    >
      <div className={styles.imgContainer}>
        {object.image ? (
          <img
            className={styles.objectImg}
            src={object.image}
            alt={object.name}
          />
        ) : (
          <PhotoIcon />
        )}
      </div>
      <p>{object.name}</p>
    </motion.div>
  );
};

const objectVariants = {
  normal: {
    backgroundColor: "rgba(var(--base-light), 0.2)",
    zIndex: 0,
    backdropFilter: "blur(0px)",
  },
  dragging: {
    backgroundColor: "rgba(var(--primary), 0.5)",
    zIndex: 1000,
    backdropFilter: "blur(8px)",
  },
};

export default RankObject;
