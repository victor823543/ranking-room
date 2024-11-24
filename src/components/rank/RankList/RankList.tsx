import { PhotoIcon } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import { useDragObjectsContext } from "../../../provider/dragObjectsProvider";
import { Object } from "../../../types/Room";
import styles from "./RankList.module.css";

type RankListProps = {
  objects: Array<Object>;
};

const RankList: React.FC<RankListProps> = ({ objects }) => {
  const listRef = useRef<HTMLDivElement>(null);
  const {
    rankedItems,
    setDraggedItemRank,
    draggedItemRank,
    draggedItem,
    rearangeRanked,
  } = useDragObjectsContext();

  const [internalDraggedFrom, setInternalDraggedFrom] = useState<number | null>(
    null,
  );
  const [internalDraggedItemRank, setInternalDraggedItemRank] = useState<
    number | null
  >(null);

  useEffect(() => {
    const listElement = listRef.current;
    if (!listElement) return;

    const handlePointerMove = (event: PointerEvent) => {
      if (draggedItem || internalDraggedFrom !== null) {
        const rect = listElement.getBoundingClientRect();
        if (
          event.clientX >= rect.left &&
          event.clientX <= rect.right &&
          event.clientY >= rect.top &&
          event.clientY <= rect.bottom
        ) {
          const itemHeight = rect.height / objects.length;
          const rank = Math.min(
            Math.floor((event.clientY - rect.top) / itemHeight),
            rankedItems.length,
          );
          if (internalDraggedFrom !== null) {
            setInternalDraggedItemRank(rank);
          } else {
            setDraggedItemRank(rank);
          }
        } else {
          setDraggedItemRank(null);
          setInternalDraggedItemRank(internalDraggedFrom);
        }
      }
    };

    window.addEventListener("pointermove", handlePointerMove);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, [
    listRef,
    objects.length,
    setDraggedItemRank,
    setInternalDraggedItemRank,
    draggedItem,
    internalDraggedFrom,
  ]);

  const handleDragEnd = () => {
    if (internalDraggedItemRank !== null && internalDraggedFrom !== null) {
      rearangeRanked(internalDraggedFrom, internalDraggedItemRank);
      setInternalDraggedFrom(null);
      setInternalDraggedItemRank(null);
    }
  };

  return (
    <motion.div className={styles.ranking}>
      <div className={styles.listContainer} ref={listRef}>
        <div className={styles.positionNumbers}>
          {Array.from({ length: objects.length }, (_, i) => (
            <div key={i} className={styles.positionNumber}>
              {i + 1}
              <div className={styles.underline}></div>
            </div>
          ))}
        </div>
        <ol className={styles.list}>
          {draggedItemRank !== null && (
            <li className={styles.emptyListItem}></li>
          )}
          {internalDraggedItemRank !== null && (
            <li className={styles.emptyListItem}></li>
          )}
          {rankedItems.map((object, i) => {
            let rank = draggedItemRank ?? internalDraggedItemRank ?? null;
            if (internalDraggedFrom !== null && rank !== null) {
              if (internalDraggedFrom < i) {
                rank++;
              }
            }
            let order = getOrder(rank, i);

            return (
              <motion.li
                layout
                key={object._id}
                className={`${styles.listItem} ${internalDraggedFrom === i ? styles.hidden : ""}`}
                style={
                  {
                    order,
                    "--topWhileDragging": `${i * 5}rem`,
                  } as unknown as React.CSSProperties
                }
              >
                <motion.div
                  className={styles.object}
                  drag="y"
                  dragSnapToOrigin
                  onDragStart={() => setInternalDraggedFrom(i)}
                  onDragEnd={handleDragEnd}
                  variants={objectVariants}
                  initial="normal"
                  whileDrag="dragging"
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
              </motion.li>
            );
          })}
        </ol>
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

const getOrder = (rank: number | null, i: number) => {
  if (rank === null) return 0;
  if (rank !== null) {
    if (rank > i) return -1;
    if (rank <= i) return 1;
  }
};

export default RankList;
