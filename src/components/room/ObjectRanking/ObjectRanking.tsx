import { PhotoIcon } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";
import React, { useMemo } from "react";
import { useAuth } from "../../../provider/authProvider";
import {
  Object,
  ObjectRanking as ObjectRankingT,
  RankingSystem,
} from "../../../types/Room";
import Divider from "../../common/Dividers/Dividers";
import TransitionTabs, {
  Tab,
} from "../../common/Tabs/TransitionTabs/TransitionTabs";
import styles from "./ObjectRanking.module.css";

type ObjectRankingProps = {
  rankingSystem: RankingSystem;
  objects: Array<Object>;
  onClick: (object: Object) => void;
  view: string;
  setView: (view: string) => void;
};

const tabs: Tab[] = [
  { label: "Combined Ranking", id: "combined" },
  { label: "User Ranking", id: "user" },
];

const ObjectRanking: React.FC<ObjectRankingProps> = ({
  rankingSystem,
  objects,
  onClick,
  view,
  setView,
}) => {
  const { user } = useAuth();

  const combinedRanking: Object[] = useMemo(
    () =>
      [...objects].sort(
        (a, b) => b.averageRankingPoints - a.averageRankingPoints,
      ),
    [objects],
  );
  const userRanking: Object[] = useMemo(
    () =>
      [...objects]
        .filter((o) => o.ranking.find((r) => r.user === user?._id))
        .sort((a, b) => {
          const userA = getUserRankingValue(
            a.ranking,
            rankingSystem,
            user?._id as string,
          );
          const userB = getUserRankingValue(
            b.ranking,
            rankingSystem,
            user?._id as string,
          );
          if (rankingSystem === RankingSystem.RANK) {
            return userA - userB;
          } else {
            return userB - userA;
          }
        }),
    [objects, user],
  );

  const listLength =
    view === "combined" ? combinedRanking.length : userRanking.length;

  return (
    <div className={styles.container}>
      <TransitionTabs
        tabs={tabs}
        selected={view}
        setTab={setView}
        borderRadius="var(--border-radius-sm)"
      />
      <Divider
        margin="1rem"
        thickness="1px"
        color="rgba(var(--base-light), 0.3)"
      />
      <div className={styles.listWrapper}>
        <div className={styles.listNumbers}>
          {Array.from({ length: listLength }, (_, i) => i + 1).map((i) => (
            <div key={i}>{i}</div>
          ))}
        </div>
        <div className={styles.objectList}>
          {view === "combined" &&
            renderObjects(combinedRanking, onClick, "combined")}
          {view === "user" && renderObjects(userRanking, onClick, "user")}
        </div>
      </div>
    </div>
  );
};

const renderObjects = (
  objects: Object[],
  onClick: (object: Object) => void,
  view: string,
) => {
  return (
    <>
      {objects.map((object, index) => (
        <motion.div
          layoutId={`modal-${object.name}-${view}`}
          onClick={() => onClick(object)}
          key={object._id + view}
          className={styles.object}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            ease: "easeOut",
            delay: 0.2 + index * 0.1,
            layout: {
              duration: 0.5,
            },
          }}
        >
          {object.image ? (
            <motion.img
              transition={{
                layout: {
                  duration: 0.5,
                },
              }}
              layoutId={`img-${object.name}-${view}`}
              className={styles.objectImg}
              src={object.image}
              alt={object.name}
            />
          ) : (
            <motion.div
              className={styles.imgContainer}
              layoutId={`img-${object.name}-${view}`}
              transition={{
                layout: {
                  duration: 0.5,
                },
              }}
            >
              <PhotoIcon />
            </motion.div>
          )}

          <motion.p
            layoutId={`header-${object.name}-${view}`}
            transition={{
              layout: {
                duration: 0.5,
              },
            }}
            layout="position"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {object.name}
          </motion.p>
        </motion.div>
      ))}
    </>
  );
};

const MotionPhotoIcon = motion.create(PhotoIcon, { forwardMotionProps: true });

const getUserRankingValue = (
  objectRanking: ObjectRankingT[],
  rankingSystem: RankingSystem,
  userId: string,
) => {
  switch (rankingSystem) {
    case RankingSystem.TIER:
      return objectRanking.find((r) => r.user === userId)?.tier || 0;
    case RankingSystem.POINTS:
      return objectRanking.find((r) => r.user === userId)?.points || 0;
    case RankingSystem.RANK:
      return objectRanking.find((r) => r.user === userId)?.rank || 0;
    default:
      return 0;
  }
};

export default ObjectRanking;
