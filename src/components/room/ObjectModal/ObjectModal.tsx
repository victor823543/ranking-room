import { PhotoIcon } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";
import React from "react";
import { Object } from "../../../types/Room";
import { ModalWrapperBlur, OpaqueModal } from "../../common/Modals/Modals";
import styles from "./ObjectModal.module.css";

type ObjectModalProps = {
  onWrapperClick?: () => void;
  object: Object;
  currentView: string;
};

const ObjectModal: React.FC<ObjectModalProps> = ({
  onWrapperClick,
  object,
  currentView,
}) => {
  return (
    <ModalWrapperBlur
      onClick={onWrapperClick ? () => onWrapperClick() : undefined}
    >
      <OpaqueModal
        layoutId={`modal-${object.name}-${currentView}`}
        style={{
          outline: "solid 1px rgba(var(--base), 0.4)",
        }}
        transition={{
          layout: {
            duration: 0.5,
          },
        }}
      >
        <div className={styles.container}>
          <motion.h1
            className={styles.h1}
            transition={{
              layout: {
                duration: 0.6,
              },
            }}
            layoutId={`header-${object.name}-${currentView}`}
            layout="position"
          >
            {object.name}
          </motion.h1>
          <div className={styles.imgContainer}>
            {object.image ? (
              <motion.img
                transition={{
                  layout: {
                    duration: 0.5,
                  },
                }}
                layoutId={`img-${object.name}-${currentView}`}
                className={styles.objectImg}
                src={object.image}
                alt={object.name}
              />
            ) : (
              <PhotoIcon />
            )}
          </div>
        </div>
      </OpaqueModal>
    </ModalWrapperBlur>
  );
};

export default ObjectModal;
