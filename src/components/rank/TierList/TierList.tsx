import { PhotoIcon } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useTierListContext } from "../../../provider/tierListProvider";
import styles from "./TierList.module.css";

type TierListProps = {
  tierNames: { name: string; points: number }[];
};

const TierList: React.FC<TierListProps> = ({ tierNames }) => {
  const tierRef = useRef<HTMLDivElement>(null);
  const sortedTierNames = useMemo(
    () => [...tierNames].sort((a, b) => b.points - a.points),
    [tierNames],
  );

  const {
    rankedItems,
    setDraggedItemTier,
    draggedItemTier,
    draggedItem,
    moveItem,
    setSelectedItem,
    selectedItem,
  } = useTierListContext();

  const [internalDraggedId, setInternalDraggedId] = useState<string | null>(
    null,
  );
  const [internalDraggedFrom, setInternalDraggedFrom] = useState<number | null>(
    null,
  );
  const [internalDraggedItemRank, setInternalDraggedItemRank] = useState<
    number | null
  >(null);

  useEffect(() => {
    const tierElement = tierRef.current;
    if (!tierElement) return;

    const handlePointerMove = (event: PointerEvent) => {
      if (draggedItem || internalDraggedFrom !== null) {
        const rect = tierElement.getBoundingClientRect();
        if (
          event.clientX >= rect.left &&
          event.clientX <= rect.right &&
          event.clientY >= rect.top &&
          event.clientY <= rect.bottom
        ) {
          const tierElements = tierElement.querySelectorAll(".tier");
          let tier: number | null = null;

          tierElements.forEach((tierEl, index) => {
            const tierRect = tierEl.getBoundingClientRect();
            if (
              event.clientY >= tierRect.top &&
              event.clientY <= tierRect.bottom &&
              tier === null
            ) {
              tier = tierNames.length - index;
            }
          });

          if (tier !== null) {
            if (internalDraggedFrom !== null) {
              setInternalDraggedItemRank(tier);
            } else {
              setDraggedItemTier(tier);
            }
          } else {
            setDraggedItemTier(null);
            setInternalDraggedItemRank(internalDraggedFrom);
          }
        } else {
          setDraggedItemTier(null);
          setInternalDraggedItemRank(internalDraggedFrom);
        }
      }
    };

    window.addEventListener("pointermove", handlePointerMove);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, [
    tierRef,
    tierNames.length,
    setDraggedItemTier,
    setInternalDraggedItemRank,
    draggedItem,
    internalDraggedFrom,
  ]);

  const handleDragStart = (objectId: string, tier: number) => {
    setInternalDraggedId(objectId);
    setInternalDraggedFrom(tier);
  };

  const handleDragEnd = () => {
    if (
      internalDraggedItemRank !== null &&
      internalDraggedFrom !== null &&
      internalDraggedId !== null
    ) {
      moveItem(internalDraggedId, internalDraggedFrom, internalDraggedItemRank);
      setInternalDraggedId(null);
      setInternalDraggedFrom(null);
      setInternalDraggedItemRank(null);
    }
  };

  return (
    <div className={styles.tierList} ref={tierRef}>
      {sortedTierNames.map((tier, index) => (
        <div className={`tier ${styles.tier}`} key={index}>
          <div className={styles.tierName}>{tier.name}</div>
          <div className={styles.objects}>
            {rankedItems[tier.points] &&
              rankedItems[tier.points].map((object) => (
                <motion.div
                  variants={objectVariants}
                  initial="normal"
                  whileDrag="dragging"
                  animate={
                    selectedItem?._id === object._id ? "selected" : "normal"
                  }
                  className={`${styles.object} ${selectedItem?._id === object._id ? styles.selected : ""}`}
                  drag
                  dragSnapToOrigin
                  key={object._id}
                  onDragStart={() => handleDragStart(object._id, tier.points)}
                  onDragEnd={handleDragEnd}
                  onMouseDown={() => setSelectedItem(object)}
                >
                  {object.image ? (
                    <img
                      className={styles.objectImg}
                      src={object.image}
                      alt={object.name}
                    />
                  ) : (
                    <PhotoIcon />
                  )}
                </motion.div>
              ))}
            {(draggedItemTier === tier.points ||
              internalDraggedItemRank === tier.points) && (
              <motion.div
                className={styles.empty}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
              />
            )}
          </div>
        </div>
      ))}
    </div>
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
  selected: {
    backgroundColor: "rgba(var(--primary), 0.2)",
    zIndex: 800,
    backdropFilter: "blur(0)",
  },
};

export default TierList;
