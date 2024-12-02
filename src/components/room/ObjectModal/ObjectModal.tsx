import { ArrowLongRightIcon } from "@heroicons/react/24/outline";
import { PhotoIcon } from "@heroicons/react/24/solid";
import { yupResolver } from "@hookform/resolvers/yup";
import { motion } from "framer-motion";
import React from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import AddImageSvg from "../../../assets/svgs/AddImageSvg";
import { useHandleSearchParam } from "../../../hooks/useHandleSearchParam";
import {
  Object,
  ObjectRanking,
  RankingSystem,
  RoomUserExtended,
} from "../../../types/Room";
import { getOrdinalSuffix } from "../../../utils/functions/numberFunctions";
import CustomizableButton from "../../common/Buttons/CustomizableButton";
import Divider from "../../common/Dividers/Dividers";
import ImageModal from "../../common/ImageModal/ImageModal";
import { ModalWrapperBlur, OpaqueModal } from "../../common/Modals/Modals";
import ProgressBar from "../../common/Progress/ProgressBar/ProgressBar";
import styles from "./ObjectModal.module.css";

type ObjectModalProps = {
  onWrapperClick?: () => void;
  object: Object;
  currentView: string;
  totalObjects: number;
  rankingSystem: RankingSystem;
  roomUsers: RoomUserExtended[];
};

const schema = yup.object({
  image: yup.string().url("Invalid URL"),
});

type FormFields = yup.InferType<typeof schema>;

const ObjectModal: React.FC<ObjectModalProps> = ({
  onWrapperClick,
  object,
  currentView,
  rankingSystem,
  roomUsers,
}) => {
  const { hasParam, addParam, removeParam } =
    useHandleSearchParam("select-image");

  const form = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
    criteriaMode: "all",
    resolver: yupResolver(schema),
  });

  return (
    <>
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
            <div className={styles.grid}>
              <div className={styles.selectImage}>
                <div className={styles.imgContainer}>
                  {object.image ? (
                    <motion.img
                      initial={{ width: "10rem", height: "10rem" }}
                      animate={
                        form.getValues("image")
                          ? { width: "5rem", height: "5rem" }
                          : { width: "10rem", height: "10rem" }
                      }
                      transition={{
                        layout: {
                          duration: 0.5,
                        },
                      }}
                      layoutId={`img-${object.name}-${currentView}`}
                      className={`${form.getValues("image") ? styles.hasNewImg : ""}`}
                      src={object.image}
                      alt={object.name}
                    />
                  ) : (
                    <PhotoIcon />
                  )}
                  {form.getValues("image") && (
                    <>
                      <div className={styles.arrowContainer}>
                        <ArrowLongRightIcon />
                      </div>
                      <div className={styles.secondImgContainer}>
                        <img
                          className={styles.objectImg}
                          src={form.getValues("image")}
                          alt="New image"
                        />
                      </div>
                    </>
                  )}
                </div>
                <Divider thickness="1px" color="rgb(var(--base))" margin="2rem">
                  select new
                </Divider>
                <div className={styles.lowerSection}>
                  <motion.button
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    layout
                    transition={{
                      delay: 0.4,
                      layout: {
                        delay: 0,
                      },
                    }}
                    type="button"
                    className={styles.imgBtn}
                    onClick={addParam}
                    style={{ padding: "0.5rem 0.25rem 0.25rem 0.5rem" }}
                  >
                    <AddImageSvg />
                  </motion.button>
                  {form.getValues("image") && (
                    <CustomizableButton variant="primary">
                      Confirm
                    </CustomizableButton>
                  )}
                </div>
              </div>
              <div className={styles.displayRanking}>
                <h2 className={styles.h2}>User Ranking</h2>
                <p></p>
                <Divider color="rgba(var(--base), 0.5)" margin="1rem" />
                {object.ranking.map((ranking) => (
                  <UserRanking
                    key={ranking.user}
                    rankingSystem={rankingSystem}
                    ranking={ranking}
                    username={
                      roomUsers.find((u) => u.userId === ranking.user)
                        ?.username || ""
                    }
                  />
                ))}
              </div>
            </div>
          </div>
        </OpaqueModal>
      </ModalWrapperBlur>
      {hasParam && (
        <ImageModal
          onWrapperClick={removeParam}
          onUploadComplete={(url) => {
            form.setValue("image", url), removeParam();
          }}
          onSelectImage={(url) => {
            form.setValue("image", url), removeParam();
          }}
        />
      )}
    </>
  );
};

type UserRankingProps = {
  rankingSystem: RankingSystem;
  ranking: ObjectRanking;
  username: string;
  totalObjects?: number;
};

const UserRanking: React.FC<UserRankingProps> = ({
  rankingSystem,
  ranking,
  username,
  totalObjects,
}) => {
  let value: number = 0;
  let max: number = 0;
  switch (rankingSystem) {
    case RankingSystem.TIER:
      value = (ranking.tier as number) + 1;
      max = 5;
      break;
    case RankingSystem.POINTS:
      value = ranking.points as number;
      max = 10;
      break;
    case RankingSystem.RANK:
      value = ranking.rank as number;
      max = totalObjects || 5;
      break;
  }

  return (
    <div className={styles.userRanking}>
      <h3 className={styles.username}>{username}</h3>
      <p className={styles.rankingValue}>
        {rankingSystem === RankingSystem.RANK
          ? getOrdinalSuffix(value)
          : `${value} / ${max}`}
      </p>
      <ProgressBar value={value} max={max} />
      <div className={styles.fadeDivider} />
    </div>
  );
};

export default ObjectModal;
