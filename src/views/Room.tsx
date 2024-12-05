import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import Alerts from "../components/common/Alerts/Alerts";
import ErrorPage from "../components/common/Error/ErrorPage/ErrorPage";
import LoadingPage from "../components/common/Loading/LoadingPage/LoadingPage";
import Section from "../components/common/Sections/Sections";
import GridLayout from "../components/layout/GridLayout/GridLayout";
import Layout from "../components/layout/Layout/Layout";
import CreateObjectPrompt from "../components/room/CreateObjectPrompt/CreateObjectPrompt";
import ObjectModal from "../components/room/ObjectModal/ObjectModal";
import ObjectRanking from "../components/room/ObjectRanking/ObjectRanking";
import RankPrompt from "../components/room/RankPrompt/RankPrompt";
import RoomHeader from "../components/room/RoomHeader/RoomHeader";
import { useAlerts } from "../hooks/useAlerts";
import { useHandleSearchParam } from "../hooks/useHandleSearchParam";
import { useAuth } from "../provider/authProvider";
import {
  convertRoleToPrivilages,
  GetRoomResponse,
  UserPrivilage,
  UserRole,
} from "../types/Room";
import { callAPI } from "../utils/apiService";

const Room = () => {
  const { alerts, pushAlert, removeAlert } = useAlerts();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { currentValue, hasParam, setParam, removeParam } =
    useHandleSearchParam("view-object");

  const [view, setView] = useState("combined");

  const { data, isLoading, error } = useQuery({
    enabled: !!id,
    queryKey: ["room", id],
    queryFn: () => callAPI<GetRoomResponse>(`/rooms/${id}`, "GET"),
  });

  useEffect(() => {
    console.log(data);
  }, [data]);

  const currentObject = useMemo(
    () => data?.objects.find((o) => o._id === currentValue),
    [data, currentValue],
  );

  const userRole = useMemo(
    () =>
      data?.users.find((u) => u.userId === user?._id)?.role ||
      UserRole.VIEW_ONLY,
    [data, user],
  );

  const userPrivilages = useMemo(
    () => convertRoleToPrivilages[userRole],
    [userRole],
  );

  const rankedObjects = useMemo(
    () =>
      data?.objects.filter((o) => o.ranking.some((r) => r.user === user?._id))
        .length || 0,
    [data, user],
  );

  if (error) return <ErrorPage />;
  if (isLoading || data === undefined || !user)
    return <LoadingPage name="Rooms" />;

  return (
    <Layout name="Rooms">
      <GridLayout
        topLeftShortWide={
          <RoomHeader
            id={data.id}
            name={data.name}
            rankingSystem={data.rankingSystem}
            userRole={userRole}
            isPinned={data.isPinned}
            isLiked={data.likedBy.includes(user._id)}
          />
        }
        topRightTallBase={
          <Section>
            <ObjectRanking
              objects={data.objects}
              rankingSystem={data.rankingSystem}
              onClick={(object) => setParam(object._id)}
              view={view}
              setView={setView}
            />
          </Section>
        }
        bottomLeftBaseNarrow={
          <Section>
            <RankPrompt
              totalObjects={data.objects.length}
              rankedObjects={rankedObjects}
              hasRankPermission={userPrivilages.includes(UserPrivilage.RANK)}
              pushAlert={pushAlert}
            />
          </Section>
        }
        bottomInnerBaseNarrow={
          <Section>
            <CreateObjectPrompt
              totalObjects={data.objects.length}
              hasAddPermission={userPrivilages.includes(UserPrivilage.ADD)}
              pushAlert={pushAlert}
            />
          </Section>
        }
      />
      {hasParam && currentObject && (
        <ObjectModal
          currentView={view}
          onWrapperClick={removeParam}
          object={currentObject}
          totalObjects={data.objects.length}
          rankingSystem={data.rankingSystem}
          roomUsers={data.users}
        />
      )}
      <Alerts
        list={alerts}
        onClose={(item) => removeAlert(item)}
        onDurationEnd={(item) => removeAlert(item)}
        hasSidebar={true}
      />
    </Layout>
  );
};

export default Room;
