import { useQuery } from "@tanstack/react-query";
import ErrorPage from "../components/common/Error/ErrorPage/ErrorPage";
import LoadingPage from "../components/common/Loading/LoadingPage/LoadingPage";
import Section from "../components/common/Sections/Sections";
import { GridLayout } from "../components/layout/GridLayout/GridLayout";
import Layout from "../components/layout/Layout/Layout";
import CreateNew from "../components/rooms/CreateNew/CreateNew";
import PinnedRoom from "../components/rooms/PinnedRoom/PinnedRoom";
import RoomList from "../components/rooms/RoomList/RoomList";
import RoomsHeader from "../components/rooms/RoomsHeader/RoomsHeader";
import { ListRoomsResponse } from "../types/Room";
import { callAPI } from "../utils/apiService";

const Rooms = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["rooms"],
    queryFn: () => callAPI<ListRoomsResponse>(`/rooms/list`, "GET"),
  });

  if (error) return <ErrorPage />;
  if (isLoading || data === undefined) return <LoadingPage name="Rooms" />;

  return (
    <Layout name="Rooms">
      <GridLayout
        topLeftShortWide={<RoomsHeader numberOfRooms={data.length} />}
        topRightTallBase={
          <Section>
            <RoomList rooms={data} />
          </Section>
        }
        bottomLeftBaseNarrow={<Section>Test</Section>}
        midInnerShortNarrow={
          <Section>
            <PinnedRoom room={data.find((r) => r.isPinned) || null} />
          </Section>
        }
        bottomInnerShortNarrow={
          <Section>
            <CreateNew />
          </Section>
        }
      />
    </Layout>
  );
};

export default Rooms;
