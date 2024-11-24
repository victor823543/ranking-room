import React, { useState } from "react";
import { Alert, ErrorAlert, SuccessAlert } from "../../../hooks/useAlerts";
import useUserActions, {
  HandleActionButtonClick,
} from "../../../hooks/useUserActions";
import { ReceivedRequest, SentRequest } from "../../../types/FriendRequest";
import { FriendInfo, UserStatus } from "../../../types/User";
import Divider from "../../common/Dividers/Dividers";
import Table from "../../common/Table/Table";
import TransitionTabs, {
  Tab,
} from "../../common/Tabs/TransitionTabs/TransitionTabs";
import { UserDisplayButton } from "../AddFriends/AddFriends";

type FriendListProps = {
  friends: Array<FriendInfo>;
  sentRequests: Array<SentRequest>;
  receivedRequests: Array<ReceivedRequest>;
  pushAlert: (item: Alert) => void;
};

const tabs: Tab[] = [
  { label: "Friends", id: "friends" },
  { label: "Friend Requests", id: "received" },
  { label: "Sent Requests", id: "sent" },
];

const FriendList: React.FC<FriendListProps> = ({
  friends,
  sentRequests,
  receivedRequests,
  pushAlert,
}) => {
  const [view, setView] = useState("friends");

  const { handleActionClick } = useUserActions({
    onRespondToRequestSuccess: (response) =>
      pushAlert(new SuccessAlert(response.message, { duration: 3 })),
    onRespondToRequestError: () =>
      pushAlert(
        new ErrorAlert("An error occurred. Please try again.", { duration: 3 }),
      ),
  });

  return (
    <div>
      <TransitionTabs
        tabs={tabs}
        selected={view}
        setTab={setView}
        borderRadius="var(--border-radius-sm)"
      />
      <Divider
        margin="1rem"
        thickness="1px"
        color="rgba(var(--base-light), 0.3)"
      />
      {view === "friends" &&
        renderTable({ status: UserStatus.FRIEND, friends })}
      {view === "received" &&
        renderTable({
          status: UserStatus.RECEIVED_REQUEST,
          receivedRequests,
          handleClick: handleActionClick,
        })}
      {view === "sent" &&
        renderTable({
          status: UserStatus.SENT_REQUEST,
          sentRequests,
        })}
    </div>
  );
};

type RenderTableProps =
  | {
      status: UserStatus.FRIEND;
      friends: Array<FriendInfo>;
    }
  | {
      status: UserStatus.SENT_REQUEST;
      sentRequests: Array<SentRequest>;
    }
  | {
      status: UserStatus.RECEIVED_REQUEST;
      receivedRequests: Array<ReceivedRequest>;
      handleClick: HandleActionButtonClick;
    };

const renderTable = (props: RenderTableProps) => {
  switch (props.status) {
    case UserStatus.FRIEND:
      const tableData = props.friends.map((friend) => ({
        name: friend.username,
        action: (
          <UserDisplayButton
            user={friend}
            status={UserStatus.FRIEND}
            handleClick={() => {}}
          />
        ),
      }));
      return <Table data={tableData} showTableHead={false} />;
    case UserStatus.SENT_REQUEST:
      const tableDataSent = props.sentRequests.map((sentRequest) => ({
        name: sentRequest.receiverName,
        action: (
          <UserDisplayButton
            user={{
              _id: sentRequest.receiverId,
              username: sentRequest.receiverName,
            }}
            status={UserStatus.SENT_REQUEST}
            handleClick={() => {}}
          />
        ),
      }));
      return <Table data={tableDataSent} showTableHead={false} />;
    case UserStatus.RECEIVED_REQUEST:
      const tableDataReceived = props.receivedRequests.map(
        (receivedRequest) => ({
          name: receivedRequest.senderName,
          action: (
            <UserDisplayButton
              user={{
                _id: receivedRequest.senderId,
                username: receivedRequest.senderName,
              }}
              requestId={receivedRequest._id}
              status={UserStatus.RECEIVED_REQUEST}
              handleClick={props.handleClick}
            />
          ),
        }),
      );
      return <Table data={tableDataReceived} showTableHead={false} />;
  }
};

export default FriendList;
