import { useQuery } from "@tanstack/react-query";
import ErrorPage from "../components/common/Error/ErrorPage/ErrorPage";
import LoadingPage from "../components/common/Loading/LoadingPage/LoadingPage";
import Section from "../components/common/Sections/Sections";
import AppSearch from "../components/dashboard/AppSearch/AppSearch";
import AwaitsAction from "../components/dashboard/AwaitsAction/AwaitsAction";
import DashboardHeader from "../components/dashboard/DashboardHeader/DashboardHeader";
import DashboardNav from "../components/dashboard/DashboardNav/DashboardNav";
import FriendRequests from "../components/dashboard/FriendRequests/FriendRequests";
import ToggleAppSearch from "../components/dashboard/ToggleAppSearch/ToggleAppSearch";
import GridLayout from "../components/layout/GridLayout/GridLayout";
import Layout from "../components/layout/Layout/Layout";
import PinnedRoom from "../components/rooms/PinnedRoom/PinnedRoom";
import { useHandleSearchParam } from "../hooks/useHandleSearchParam";
import { useAuth } from "../provider/authProvider";
import { ListRoomsResponse, Object } from "../types/Room";
import { callAPI } from "../utils/apiService";

const Dashboard = () => {
  const { user } = useAuth();
  const { addParam, removeParam, hasParam } = useHandleSearchParam("search");

  const { data, isLoading, error } = useQuery({
    queryKey: ["rooms"],
    queryFn: () => callAPI<ListRoomsResponse>(`/rooms/list`, "GET"),
  });

  const {
    data: objectsData,
    isLoading: objectsIsLoading,
    error: objectsError,
  } = useQuery({
    queryKey: ["objects"],
    queryFn: () => callAPI<{ objects: Object[] }>(`/objects`, "GET"),
  });

  if (error || objectsError) return <ErrorPage />;
  if (
    user === undefined ||
    isLoading ||
    data === undefined ||
    objectsIsLoading ||
    objectsData === undefined ||
    user === null
  ) {
    return <LoadingPage name="Dashboard" />;
  }

  return (
    <Layout name="Dashboard">
      <GridLayout
        topLeftShortWide={<DashboardHeader user={user} />}
        bottomLeftBaseBase={<DashboardNav />}
        topRightShortBase={
          <Section>
            <AwaitsAction rooms={data} user={user} />
          </Section>
        }
        midMidShortNarrow={
          <Section>
            <ToggleAppSearch onSearchClick={addParam} />
          </Section>
        }
        bottomMidShortNarrow={
          <Section>
            <PinnedRoom room={data.find((r) => r.isPinned) || null} />
          </Section>
        }
        bottomRightBaseNarrow={
          <Section>
            <FriendRequests />
          </Section>
        }
      />
      {hasParam && (
        <AppSearch
          onWrapperClick={removeParam}
          rooms={data}
          objects={objectsData.objects}
        />
      )}
    </Layout>
  );
};

export default Dashboard;
