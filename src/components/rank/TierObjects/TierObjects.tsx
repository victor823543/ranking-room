import { PhotoIcon } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";
import React, { useEffect } from "react";
import { useAuth } from "../../../provider/authProvider";
import { useTierListContext } from "../../../provider/tierListProvider";
import { Object } from "../../../types/Room";
import styles from "./TierObjects.module.css";

type TierObjectsProps = {
  objects: Array<Object>;
};

const TierObjects: React.FC<TierObjectsProps> = ({ objects }) => {
  const { user } = useAuth();

  const { notRankedItems, setItems } = useTierListContext();

  useEffect(() => {
    if (objects && user?._id) {
      setItems(objects, user._id);
    }
  }, [objects, user]);

  return (
    <div className={styles.objectList}>
      {notRankedItems.map((object) => (
        <TierObject key={object._id} object={object} />
      ))}
    </div>
  );
};

type TierObjectProps = {
  object: Object;
};

const TierObject: React.FC<TierObjectProps> = ({ object }) => {
  const { setDraggedItem, handleDrop } = useTierListContext();

  return (
    <motion.div
      variants={objectVariants}
      initial="normal"
      whileDrag="dragging"
      className={styles.object}
      drag
      dragSnapToOrigin
      key={object._id}
      dragConstraints={{ right: 0 }}
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

export default TierObjects;
