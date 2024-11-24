import { PhotoIcon } from "@heroicons/react/24/solid";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../provider/authProvider";
import { GetRoomResponse, Object as ObjectT } from "../../../types/Room";
import { callAPI } from "../../../utils/apiService";
import Spinner from "../../common/Loading/Spinner/Spinner";
import RangeInput from "../../common/RangeInput/RangeInput";
import RankHeader from "../RankHeader/RankHeader";
import styles from "./PointsRanking.module.css";

type PointsRankingProps = {
  data: GetRoomResponse;
};

const PointsRanking: React.FC<PointsRankingProps> = ({ data }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [points, setPoints] = useState<
    Record<string, { object: ObjectT; points: number }>
  >(
    data.objects.reduce(
      (acc, object) => {
        acc[object._id] = {
          object,
          points: object.ranking.find((r) => r.user === user?._id)?.points || 0,
        };
        return acc;
      },
      {} as Record<string, { object: ObjectT; points: number }>,
    ),
  );

  const mutation = useMutation({
    mutationFn: (objects: Array<{ object: string; points: number }>) =>
      callAPI(`/objects/rank/${data.id}`, "PUT", {
        objectRanking: objects,
        rankingSystem: data.rankingSystem,
      }),
    onSuccess: () => {
      console.log("Ranking saved");
      navigate(`/rooms/${data.id}`);
    },
  });

  const handleSubmit = () => {
    if (!points || Object.keys(points).length === 0) return;
    const ranking = Object.entries(points).map(([object, { points }]) => ({
      object,
      points,
    }));
    mutation.mutate(ranking);
  };

  const reload = () => {
    setPoints(
      data.objects.reduce(
        (acc, object) => {
          acc[object._id] = { object, points: 0 };
          return acc;
        },
        {} as Record<string, { object: ObjectT; points: number }>,
      ),
    );
  };

  const handlePointsChange = (id: string, points: number) => {
    setPoints((prev) => ({
      ...prev,
      [id]: { ...prev[id], points },
    }));
  };

  const totalRanked = useMemo(
    () =>
      Object.keys(points).filter((key) => points[key].points > 0).length || 0,
    [points],
  );
  const leftToRank = useMemo(
    () => Object.keys(points).length - totalRanked,
    [points, totalRanked],
  );

  if (!user || !points) {
    return <Spinner />;
  }

  return (
    <div className={styles.pointsRanking}>
      <RankHeader
        leftToRank={leftToRank}
        totalRanked={totalRanked}
        roomData={data}
        onSubmit={handleSubmit}
        onReload={reload}
      />
      <div className={styles.grid}>
        {Object.values(points).map(({ object, points }) => (
          <div className={styles.rankingWrapper} key={object._id}>
            <motion.div className={styles.object} key={object._id}>
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
            <div className={styles.inputWrapper}>
              <RangeInput
                min={0}
                max={10}
                startValue={points}
                step={1}
                onDragEnd={(value) => handlePointsChange(object._id, value)}
                showValue="left-side"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PointsRanking;
