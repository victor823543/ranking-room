import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import Breadcrumbs from "../../components/common/Breadcrumbs/Breadcrumbs";
import ErrorPage from "../../components/common/Error/ErrorPage/ErrorPage";
import LoadingPage from "../../components/common/Loading/LoadingPage/LoadingPage";
import Layout from "../../components/layout/Layout/Layout";
import ListRanking from "../../components/rank/ListRanking/ListRanking";
import PointsRanking from "../../components/rank/PointsRanking/PointsRanking";
import { useAuth } from "../../provider/authProvider";
import { DragObjectsProvider } from "../../provider/dragObjectsProvider";
import { GetRoomResponse, RankingSystem } from "../../types/Room";
import { callAPI } from "../../utils/apiService";
import styles from "./Rank.module.css";

const Rank = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();

  const { data, isLoading, error } = useQuery({
    enabled: !!id,
    queryKey: ["room", id],
    queryFn: () => callAPI<GetRoomResponse>(`/rooms/${id}`, "GET"),
  });

  if (error) return <ErrorPage />;
  if (isLoading || data === undefined) return <LoadingPage />;

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
