import { PhotoIcon } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";
import React, { useMemo } from "react";
import { useHandleSearchParam } from "../../../hooks/useHandleSearchParam";
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
        id="object-ranking"
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
          {view === "combined" && renderObjects(combinedRanking, "combined")}
          {view === "user" && renderObjects(userRanking, "user")}
        </div>
      </div>
    </div>
  );
};

const renderObjects = (objects: Object[], view: string) => {
  const { currentValue, setParam } = useHandleSearchParam("view-object");

  return (
    <>
      {objects.map((object, index) => (
        <motion.div
          onClick={() => setParam(object._id)}
          key={object._id + view}
          className={styles.object}
          variants={objectVariants}
          custom={index}
          initial="hidden"
          animate={currentValue === object._id ? "open" : "visible"}
        >
          {object.image ? (
            <img
              className={styles.objectImg}
              src={object.image}
              alt={object.name}
            />
          ) : (
            <div className={styles.imgContainer}>
              <PhotoIcon />
            </div>
          )}

          <p>{object.name}</p>
        </motion.div>
      ))}
    </>
  );
};

const objectVariants = {
  hidden: { opacity: 0, y: 30, filter: "blur(0px)" },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.4,
      ease: "easeOut",
      delay: index * 0.1,
    },
  }),
  open: {
    opacity: 0.5,
    y: 0,
    filter: "blur(8px)",
    transition: {
      duration: 0.2,
      ease: "easeInOut",
    },
  },
};

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
