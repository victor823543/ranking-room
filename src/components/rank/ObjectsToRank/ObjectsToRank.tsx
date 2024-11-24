import React, { useEffect } from "react";
import { useAuth } from "../../../provider/authProvider";
import { useDragObjectsContext } from "../../../provider/dragObjectsProvider";
import { Object } from "../../../types/Room";
import RankObject from "../RankObject/RankObject";
import styles from "./ObjectsToRank.module.css";

type ObjectsToRankProps = {
  objects: Array<Object>;
};

const ObjectsToRank: React.FC<ObjectsToRankProps> = ({ objects }) => {
  const { user } = useAuth();

  const { notRankedItems, setItems } = useDragObjectsContext();

  useEffect(() => {
    if (objects && user?._id) {
      setItems(objects, user._id);
    }
  }, [objects, user]);

  return (
    <div className={styles.objectList}>
      {notRankedItems.map((object) => (
        <RankObject key={object._id} object={object} />
      ))}
    </div>
  );
};

export default ObjectsToRank;
