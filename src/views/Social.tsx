import { useQuery } from "@tanstack/react-query";
import Alerts from "../components/common/Alerts/Alerts";
import ErrorPage from "../components/common/Error/ErrorPage/ErrorPage";
import LoadingPage from "../components/common/Loading/LoadingPage/LoadingPage";
import Section from "../components/common/Sections/Sections";
import { GridLayout } from "../components/layout/GridLayout/GridLayout";
import Layout from "../components/layout/Layout/Layout";
import AddFriends from "../components/social/AddFriends/AddFriends";
import FriendList from "../components/social/FriendList/FriendList";
import SocialHeader from "../components/social/SocialHeader/SocialHeader";
import { useAlerts } from "../hooks/useAlerts";
import { ListFriendRequestsResponse } from "../types/FriendRequest";
import { ListFriendsResponse } from "../types/User";
import { callAPI } from "../utils/apiService";

const Social = () => {
  const { alerts, pushAlert, removeAlert } = useAlerts();
  const {
    data: friendList,
    isLoading: friendsIsLoading,
    error: friendsError,
  } = useQuery({
    queryKey: ["friends"],
    queryFn: () => callAPI<ListFriendsResponse>(`/users/friends`, "GET"),
  });

  const {
    data: friendRequests,
    isLoading: friendRequestsIsLoading,
    error: friendRequestsError,
  } = useQuery({
    queryKey: ["friendRequests"],
    queryFn: () =>
      callAPI<ListFriendRequestsResponse>(`/friend-request/list`, "GET"),
  });

  if (friendsError || friendRequestsError) return <ErrorPage />;
  if (
    friendRequestsIsLoading ||
    friendsIsLoading ||
    friendList === undefined ||
    friendRequests === undefined
  )
    return <LoadingPage name="Social" />;

  return (
    <Layout name="Social">
      <GridLayout
        topLeftShortWide={<SocialHeader numberOfFriends={friendList.length} />}
        bottomLeftBaseWide={
          <Section>
            <FriendList
              friends={friendList}
              sentRequests={friendRequests.sentRequests}
              receivedRequests={friendRequests.receivedRequests}
              pushAlert={pushAlert}
            />
          </Section>
        }
        topRightTallBase={
          <Section>
            <AddFriends
              friends={friendList}
              sentRequests={friendRequests.sentRequests}
              receivedRequests={friendRequests.receivedRequests}
              pushAlert={pushAlert}
            />
          </Section>
        }
      />
      <Alerts
        list={alerts}
        onClose={(item) => removeAlert(item)}
        onDurationEnd={(item) => removeAlert(item)}
        hasSidebar={true}
      />
    </Layout>
  );
};

export default Social;
