import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Breadcrumbs from "../../components/common/Breadcrumbs/Breadcrumbs";
import Divider from "../../components/common/Dividers/Dividers";
import ErrorPage from "../../components/common/Error/ErrorPage/ErrorPage";
import { Header } from "../../components/common/Headers/Headers";
import LoadingPage from "../../components/common/Loading/LoadingPage/LoadingPage";
import Layout from "../../components/layout/Layout/Layout";
import DeleteRoom from "../../components/room/DeleteRoom/DeleteRoom";
import NameSettings from "../../components/room/NameSettings/NameSettings";
import RoomUserSettings from "../../components/room/RoomUserSettings/RoomUserSettings";
import SettingsConfirm from "../../components/room/SettingsConfirm/SettingsConfirm";
import { useAlerts, WarningAlert } from "../../hooks/useAlerts";
import useRoomSettings from "../../hooks/useRoomSettings";
import { useAuth } from "../../provider/authProvider";
import { GetRoomResponse, UserPrivilage } from "../../types/Room";
import { callAPI } from "../../utils/apiService";
import styles from "./RoomSettings.module.css";

const RoomSettings = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { pushAlert } = useAlerts();
  const navigate = useNavigate();

  const { data, isLoading, error } = useQuery({
    enabled: !!id,
    queryKey: ["room", id],
    queryFn: () => callAPI<GetRoomResponse>(`/rooms/${id}`, "GET"),
  });

  const {
    fields,
    setName,
    updatedValues,
    updateSettings,
    deleteRoom,
    addUser,
    deleteUser,
    changeRole,
  } = useRoomSettings(data);

  const hasEditPrivilege: boolean | null = useMemo(() => {
    if (data === undefined || user === undefined) return null;
    return (
      data?.users
        .find((u) => u.userId === user?._id)
        ?.privilages.includes(UserPrivilage.EDIT) || false
    );
  }, [data, user]);

  useEffect(() => {
    if (hasEditPrivilege === false) {
      navigate(`/rooms/${id}`);
      pushAlert(
        new WarningAlert("You don't have permission to edit this room", {
          global: true,
        }),
      );
    }
  }, [hasEditPrivilege]);

  if (error) return <ErrorPage />;
  if (isLoading || data === undefined) return <LoadingPage name="Rooms" />;

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
          <Divider margin="1rem" color="rgb(var(--base))" />
        </div>
        <Header variant="primary" center={false}>
          Settings
        </Header>
        {updatedValues && (
          <SettingsConfirm
            updateSettings={updateSettings}
            updatedValues={updatedValues}
          />
        )}
        <NameSettings value={fields.name || ""} setValue={setName} />
        <RoomUserSettings
          users={fields.users}
          addUser={addUser}
          changeRole={changeRole}
          deleteUser={deleteUser}
        />
        <DeleteRoom deleteRoom={deleteRoom} />
      </div>
    </Layout>
  );
};

export default RoomSettings;
