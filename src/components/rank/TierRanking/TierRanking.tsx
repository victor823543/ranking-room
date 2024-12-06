import { useMutation } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../provider/authProvider";
import { useTierListContext } from "../../../provider/tierListProvider";
import { GetRoomResponse } from "../../../types/Room";
import { callAPI } from "../../../utils/apiService";
import { defaultTierListNames } from "../../../utils/constants";
import Spinner from "../../common/Loading/Spinner/Spinner";
import RankHeader from "../RankHeader/RankHeader";
import TierList from "../TierList/TierList";
import TierObjects from "../TierObjects/TierObjects";
import styles from "./TierRanking.module.css";

type TierRankingProps = {
  data: GetRoomResponse;
};

const TierRanking: React.FC<TierRankingProps> = ({ data }) => {
  const { notRankedItems, rankedItems, setItems, getObjectRanking, reload } =
    useTierListContext();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (data.objects && user?._id) {
      setItems(data.objects, user._id);
    }
  }, [data.objects, user]);

  const mutation = useMutation({
    mutationFn: (objects: Array<{ object: string; tier: number }>) =>
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
    if (!rankedItems || Object.keys(rankedItems).length === 0) return;
    const ranking = getObjectRanking();
    console.log(ranking);
    mutation.mutate(ranking);
  };

  if (!user) {
    return <Spinner />;
  }

  return (
    <div className={styles.tierRanking}>
      <RankHeader
        leftToRank={notRankedItems.length}
        totalRanked={Object.keys(rankedItems).length}
        roomData={data}
        onSubmit={handleSubmit}
        onReload={() => reload(data.objects)}
      />
      <div className={styles.grid}>
        <TierList tierNames={defaultTierListNames} />
        <TierObjects objects={data.objects} />
      </div>
    </div>
  );
};

export default TierRanking;
