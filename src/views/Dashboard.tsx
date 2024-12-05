import { useQuery } from "@tanstack/react-query";
import ErrorPage from "../components/common/Error/ErrorPage/ErrorPage";
import LoadingPage from "../components/common/Loading/LoadingPage/LoadingPage";
import Section from "../components/common/Sections/Sections";
import AwaitsAction from "../components/dashboard/AwaitsAction/AwaitsAction";
import DashboardHeader from "../components/dashboard/DashboardHeader/DashboardHeader";
import DashboardNav from "../components/dashboard/DashboardNav/DashboardNav";
import FriendRequests from "../components/dashboard/FriendRequests/FriendRequests";
import GridLayout from "../components/layout/GridLayout/GridLayout";
import Layout from "../components/layout/Layout/Layout";
import PinnedRoom from "../components/rooms/PinnedRoom/PinnedRoom";
import { useAuth } from "../provider/authProvider";
import { ListRoomsResponse } from "../types/Room";
import { callAPI } from "../utils/apiService";

const Dashboard = () => {
  const { user } = useAuth();

  const { data, isLoading, error } = useQuery({
    queryKey: ["rooms"],
    queryFn: () => callAPI<ListRoomsResponse>(`/rooms/list`, "GET"),
  });

  if (error) return <ErrorPage />;
  if (user === undefined || isLoading || data === undefined) {
    return <LoadingPage name="Dashboard" />;
  }

  if (user === null) {
    return (
      <Layout name="Dashboard">
        <div></div>
      </Layout>
    );
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
            <div></div>
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
    </Layout>
  );
};

export default Dashboard;
