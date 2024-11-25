import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import Breadcrumbs from "../../components/common/Breadcrumbs/Breadcrumbs";
import ErrorPage from "../../components/common/Error/ErrorPage/ErrorPage";
import LoadingPage from "../../components/common/Loading/LoadingPage/LoadingPage";
import Layout from "../../components/layout/Layout/Layout";
import NameSettings from "../../components/room/NameSettings/NameSettings";
import useRoomSettings from "../../hooks/useRoomSettings";
import { GetRoomResponse } from "../../types/Room";
import { callAPI } from "../../utils/apiService";
import styles from "./RoomSettings.module.css";

const RoomSettings = () => {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading, error } = useQuery({
    enabled: !!id,
    queryKey: ["room", id],
    queryFn: () => callAPI<GetRoomResponse>(`/rooms/${id}`, "GET"),
  });

  const { fields, setName } = useRoomSettings(data);

  if (error) return <ErrorPage />;
  if (isLoading || data === undefined) return <LoadingPage />;

  return (
    <Layout name="Rooms">
      <div className={styles.container}>
        <div className={styles.breadcrumbsContainer}>
          <Breadcrumbs
            items={[
              { name: "Rooms", href: "/rooms" },
              { name: data.name, href: `/rooms/${data.id}` },
              { name: "Settings", href: `/rooms/${data.id}/settings` },
            ]}
          />
        </div>
        <NameSettings value={fields.name || ""} setValue={setName} />
      </div>
    </Layout>
  );
};

export default RoomSettings;
