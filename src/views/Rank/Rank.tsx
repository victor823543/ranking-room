import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Breadcrumbs from "../../components/common/Breadcrumbs/Breadcrumbs";
import ErrorPage from "../../components/common/Error/ErrorPage/ErrorPage";
import LoadingPage from "../../components/common/Loading/LoadingPage/LoadingPage";
import Layout from "../../components/layout/Layout/Layout";
import ListRanking from "../../components/rank/ListRanking/ListRanking";
import PointsRanking from "../../components/rank/PointsRanking/PointsRanking";
import { useAlerts, WarningAlert } from "../../hooks/useAlerts";
import { useAuth } from "../../provider/authProvider";
import { DragObjectsProvider } from "../../provider/dragObjectsProvider";
import {
  GetRoomResponse,
  RankingSystem,
  UserPrivilage,
} from "../../types/Room";
import { callAPI } from "../../utils/apiService";
import styles from "./Rank.module.css";

const Rank = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { pushAlert } = useAlerts();
  const navigate = useNavigate();

  const { data, isLoading, error } = useQuery({
    enabled: !!id,
    queryKey: ["room", id],
    queryFn: () => callAPI<GetRoomResponse>(`/rooms/${id}`, "GET"),
  });

  const hasRankPrivilege: boolean | null = useMemo(() => {
    if (data === undefined || user === undefined) return null;
    return (
      data?.users
        .find((u) => u.userId === user?._id)
        ?.privilages.includes(UserPrivilage.RANK) || false
    );
  }, [data, user]);

  useEffect(() => {
    if (hasRankPrivilege === false) {
      navigate(`/rooms/${id}`);
      pushAlert(
        new WarningAlert(
          "You don't have permission to rank objects in this room",
          { global: true },
        ),
      );
    }
  }, [hasRankPrivilege]);

  if (error) return <ErrorPage />;
  if (isLoading || data === undefined || !hasRankPrivilege)
    return <LoadingPage name="Rooms" />;

  return (
    <DragObjectsProvider>
      <Layout name="Rooms">
        <div className={styles.container}>
          <div className={styles.breadcrumbsContainer}>
            <Breadcrumbs
              items={[
                { name: "Rooms", href: "/rooms" },
                { name: data.name, href: `/rooms/${data.id}` },
                { name: "Rank", href: `/rooms/${data.id}/rank` },
              ]}
            />
          </div>
          {render(data)}
        </div>
      </Layout>
    </DragObjectsProvider>
  );
};

const render = (data: GetRoomResponse) => {
  switch (data.rankingSystem) {
    case RankingSystem.TIER:
      return null;
    case RankingSystem.POINTS:
      return <PointsRanking data={data} />;
    case RankingSystem.RANK:
      return <ListRanking data={data} />;
  }
};

export default Rank;
