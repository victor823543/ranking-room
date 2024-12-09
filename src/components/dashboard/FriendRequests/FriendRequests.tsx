import { UserIcon } from "@heroicons/react/24/solid";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import React from "react";
import { Alert, SuccessAlert } from "../../../hooks/useAlerts";
import useUserActions from "../../../hooks/useUserActions";
import { ListFriendRequestsResponse } from "../../../types/FriendRequest";
import { UserStatus } from "../../../types/User";
import { callAPI } from "../../../utils/apiService";
import { formatDate } from "../../../utils/functions/dateFunctions";
import Spinner from "../../common/Loading/Spinner/Spinner";
import { UserDisplayButton } from "../../social/AddFriends/AddFriends";
import styles from "./FriendRequests.module.css";

type FriendRequestsProps = {
  pushAlert: (alert: Alert) => void;
};

const FriendRequests: React.FC<FriendRequestsProps> = ({ pushAlert }) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["friendRequests"],
    queryFn: () =>
      callAPI<ListFriendRequestsResponse>(`/friend-request/list`, "GET"),
  });

  const { handleActionClick } = useUserActions({
    onRespondToRequestSuccess: (response) => {
      pushAlert(new SuccessAlert(response.message, { duration: 3 }));
    },
  });

  if (error) return null;
  if (data === undefined || isLoading) return <Spinner />;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.iconWrapper}>
          <UserIcon />
        </div>
        <h3 className={styles.h3}>Friend Requests</h3>
      </div>
      {data.receivedRequests.length === 0 && (
        <div className={styles.noRequests}>
          <p>No friend requests waiting response</p>
        </div>
      )}
      {data.receivedRequests.length > 0 && (
        <motion.div
          className={styles.requests}
          variants={listVariants}
          initial="hidden"
          animate="visible"
        >
          {data.receivedRequests.map((request) => (
            <motion.div
              key={request._id}
              className={styles.requestWrapper}
              variants={requestVariants}
            >
              <div className={styles.request}>
                <p>{request.senderName}</p>
                <p>Sent: {formatDate(request.timestamp, "medium")}</p>
                <div className={styles.requestActions}>
                  <UserDisplayButton
                    user={{
                      _id: request.senderId,
                      username: request.senderName,
                    }}
                    requestId={request._id}
                    status={UserStatus.RECEIVED_REQUEST}
                    handleClick={handleActionClick}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

const listVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const requestVariants = {
  hidden: { opacity: 0, x: -15 },
  visible: { opacity: 1, x: 0 },
};

export default FriendRequests;
