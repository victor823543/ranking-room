import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Alert, ErrorAlert, SuccessAlert } from "../../../hooks/useAlerts";
import useUserActions, {
  HandleActionButtonClickArgs,
} from "../../../hooks/useUserActions";
import { useAuth } from "../../../provider/authProvider";
import { ReceivedRequest, SentRequest } from "../../../types/FriendRequest";
import { FriendInfo, UserInfo, UserStatus } from "../../../types/User";
import { callAPI } from "../../../utils/apiService";
import Divider from "../../common/Dividers/Dividers";
import Spinner from "../../common/Loading/Spinner/Spinner";
import SearchField from "../../common/Search/SearchField/SearchField";
import styles from "./AddFriends.module.css";

type AddFriendsProps = {
  friends: Array<FriendInfo>;
  sentRequests: Array<SentRequest>;
  receivedRequests: Array<ReceivedRequest>;
  pushAlert: (item: Alert) => void;
};

type HandleButtonClickArgs =
  | {
      status: UserStatus.DEFAULT;
      friendId: string;
    }
  | {
      status: UserStatus.RECEIVED_REQUEST;
      requestId: string;
      accept: boolean;
    };

const AddFriends: React.FC<AddFriendsProps> = ({
  friends,
  sentRequests,
  receivedRequests,
  pushAlert,
}) => {
  const { user: thisUser } = useAuth();
  const { data, isLoading, error } = useQuery({
    queryKey: ["allUsers"],
    queryFn: () => callAPI<Array<UserInfo>>(`/users/all`, "GET"),
  });

  const [filteredUsers, setFilteredUsers] = useState<Array<UserInfo>>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const { handleActionClick } = useUserActions({
    onAddFriendSuccess: () => {
      pushAlert(new SuccessAlert("Friend request sent!", { duration: 3 }));
    },
    onRespondToRequestSuccess: (response) => {
      pushAlert(new SuccessAlert(response.message, { duration: 3 }));
    },
    onAddFriendError: () => {
      pushAlert(
        new ErrorAlert("An error occurred. Please try again.", { duration: 3 }),
      );
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    if (e.target.value.length > 1) {
      const filtered = data?.filter(
        (user) =>
          user.username.toLowerCase().includes(e.target.value.toLowerCase()) &&
          user._id !== thisUser?._id,
      );
      setFilteredUsers(filtered || []);
    } else setFilteredUsers([]);
  };

  if (error) return null;
  if (isLoading || data === undefined) return <Spinner />;

  return (
    <div className={styles.container}>
      <SearchField
        value={searchTerm}
        onChange={handleInputChange}
        placeholder="Search for Users"
      />
      <Divider thickness="1px" color="rgba(var(--base-light), 0.3)" />
      <div className={styles.userList}>
        {filteredUsers.length > 0 &&
          filteredUsers.map((user) => {
            const userStatus: UserStatus = friends.some(
              (friend) => friend._id === user._id,
            )
              ? UserStatus.FRIEND
              : sentRequests.some(
                    (sentRequest) => sentRequest.receiverId === user._id,
                  )
                ? UserStatus.SENT_REQUEST
                : receivedRequests.some(
                      (receivedRequest) =>
                        receivedRequest.senderId === user._id,
                    )
                  ? UserStatus.RECEIVED_REQUEST
                  : UserStatus.DEFAULT;

            const requestId =
              userStatus === UserStatus.RECEIVED_REQUEST
                ? receivedRequests.find(
                    (request) => request.senderId === user._id,
                  )?._id
                : undefined;
            return (
              <div key={user._id} className={styles.userDisplay}>
                <p>{user.username}</p>
                <UserDisplayButton
                  user={user}
                  status={userStatus}
                  requestId={requestId}
                  handleClick={handleActionClick}
                />
              </div>
            );
          })}
      </div>
    </div>
  );
};

export const UserDisplayButton: React.FC<{
  user: UserInfo;
  requestId?: string;
  status: UserStatus;
  handleClick: (args: HandleActionButtonClickArgs) => void;
}> = ({ user, status, handleClick, requestId }) => {
  switch (status) {
    case UserStatus.FRIEND:
      return <div className={styles.userStatus}>Added</div>;
    case UserStatus.SENT_REQUEST:
      return <div className={styles.userStatus}>Request sent</div>;
    case UserStatus.RECEIVED_REQUEST:
      return (
        <div className={styles.respondBtn}>
          <button
            className={styles.accept}
            onClick={() =>
              handleClick({ status, requestId: requestId || "", accept: true })
            }
          >
            Accept
          </button>
          <Divider orientation="vertical" thickness="1px" />
          <button
            className={styles.decline}
            onClick={() =>
              handleClick({ status, requestId: requestId || "", accept: false })
            }
          >
            Decline
          </button>
        </div>
      );
    case UserStatus.DEFAULT:
      return (
        <button
          className={styles.addBtn}
          onClick={() => handleClick({ status, friendId: user._id })}
        >
          Add Friend
        </button>
      );
  }
};

export default AddFriends;
