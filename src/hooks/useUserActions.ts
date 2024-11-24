import { useMutation, useQueryClient } from "@tanstack/react-query";
import { RespondToFriendRequestResponse } from "../types/FriendRequest";
import { UserStatus } from "../types/User";
import { callAPI } from "../utils/apiService";

type UseUserActionsProps = Partial<{
  onAddFriendSuccess: () => void;
  onRespondToRequestSuccess: (response: RespondToFriendRequestResponse) => void;
  onAddFriendError: (err: any) => void;
  onRespondToRequestError: (err: any) => void;
}>;

export type RespondToRequest = ({
  requestId,
  accept,
}: {
  requestId: string;
  accept: boolean;
}) => void;

type UseUserActionsReturn = {
  addFriend: (userId: string) => void;
  respondToRequest: RespondToRequest;
  handleActionClick: HandleActionButtonClick;
};

type RespondToRequestArgs = {
  status: UserStatus.RECEIVED_REQUEST;
  requestId: string;
  accept: boolean;
};

type AddFriendArgs = {
  status: UserStatus.DEFAULT;
  friendId: string;
};

export type HandleActionButtonClickArgs = AddFriendArgs | RespondToRequestArgs;

export type HandleActionButtonClick = (
  args: HandleActionButtonClickArgs,
) => void;

const useUserActions = ({
  onAddFriendSuccess,
  onAddFriendError,
  onRespondToRequestSuccess,
  onRespondToRequestError,
}: UseUserActionsProps): UseUserActionsReturn => {
  const queryClient = useQueryClient();

  const addFriendMutation = useMutation({
    mutationFn: (userId: string) =>
      callAPI(`/friend-request/${userId}`, "POST"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
      if (onAddFriendSuccess) {
        onAddFriendSuccess();
      }
    },
    onError: (err) => {
      if (onAddFriendError) {
        onAddFriendError(err);
      }
      console.log(err);
    },
  });

  const respondToRequestMutation = useMutation({
    mutationFn: ({
      requestId,
      accept,
    }: {
      requestId: string;
      accept: boolean;
    }) => {
      return callAPI<RespondToFriendRequestResponse>(
        `/friend-request/respond/${requestId}`,
        "PATCH",
        { accept },
      );
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
      queryClient.invalidateQueries({ queryKey: ["friends"] });
      if (onRespondToRequestSuccess) {
        onRespondToRequestSuccess(response);
      }
    },
    onError: (err) => {
      if (onRespondToRequestError) {
        onRespondToRequestError(err);
      }
      console.log(err);
    },
  });

  const addFriend = (userId: string) => {
    addFriendMutation.mutate(userId);
  };

  const respondToRequest: RespondToRequest = ({ requestId, accept }) => {
    respondToRequestMutation.mutate({ requestId, accept });
  };

  const handleActionClick = (args: HandleActionButtonClickArgs) => {
    switch (args.status) {
      case UserStatus.DEFAULT:
        addFriendMutation.mutate(args.friendId);
        break;
      case UserStatus.RECEIVED_REQUEST:
        respondToRequestMutation.mutate({
          requestId: args.requestId,
          accept: args.accept,
        });
        break;
    }
  };

  return {
    addFriend,
    respondToRequest,
    handleActionClick,
  };
};

export default useUserActions;
