import { useQuery } from "@tanstack/react-query";
import ErrorPage from "../components/common/Error/ErrorPage/ErrorPage";
import LoadingPage from "../components/common/Loading/LoadingPage/LoadingPage";
import Section from "../components/common/Sections/Sections";
import { GridLayout } from "../components/layout/GridLayout/GridLayout";
import Layout from "../components/layout/Layout/Layout";
import RoomList from "../components/rooms/RoomList/RoomList";
import { ListRoomsResponse } from "../types/Room";
import { callAPI } from "../utils/apiService";

const Rooms = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["rooms"],
    queryFn: () => callAPI<ListRoomsResponse>(`/rooms/list`, "GET"),
  });

  if (error) return <ErrorPage />;
  if (isLoading || data === undefined) return <LoadingPage />;

  return (
    <Layout name="Rooms">
      <GridLayout
        topRightTallBase={
          <Section>
            <RoomList rooms={data} />
          </Section>
        }
        bottomLeftBaseWide={<Section>Test</Section>}
      />
    </Layout>
  );
};

export default Rooms;
