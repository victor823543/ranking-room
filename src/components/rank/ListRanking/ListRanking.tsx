import { useMutation } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../provider/authProvider";
import { useDragObjectsContext } from "../../../provider/dragObjectsProvider";
import { GetRoomResponse } from "../../../types/Room";
import { callAPI } from "../../../utils/apiService";
import Spinner from "../../common/Loading/Spinner/Spinner";
import ObjectsToRank from "../ObjectsToRank/ObjectsToRank";
import RankHeader from "../RankHeader/RankHeader";
import RankList from "../RankList/RankList";
import styles from "./ListRanking.module.css";

type ListRankingProps = {
  data: GetRoomResponse;
};

const ListRanking: React.FC<ListRankingProps> = ({ data }) => {
  const { notRankedItems, rankedItems, setItems, getObjectRanking, reload } =
    useDragObjectsContext();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (data.objects && user?._id) {
      setItems(data.objects, user._id);
    }
  }, [data.objects, user]);

  const mutation = useMutation({
    mutationFn: (objects: Array<{ object: string; rank: number }>) =>
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
    if (!rankedItems || rankedItems.length === 0) return;
    const ranking = getObjectRanking();
    mutation.mutate(ranking);
  };

  if (!user) {
    return <Spinner />;
  }

  return (
    <div className={styles.listRanking}>
      <RankHeader
        leftToRank={notRankedItems.length}
        totalRanked={rankedItems.length}
        roomData={data}
        onSubmit={handleSubmit}
        onReload={reload}
      />
      <div className={styles.grid}>
        <ObjectsToRank objects={data.objects} />
        <RankList objects={data.objects} />
      </div>
    </div>
  );
};

export default ListRanking;
