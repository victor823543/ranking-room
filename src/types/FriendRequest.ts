export type SentRequest = {
  _id: string;
  receiverName: string;
  receiverId: string;
  timestamp: number;
};

export type ReceivedRequest = {
  _id: string;
  senderName: string;
  senderId: string;
  timestamp: number;
};

export type ListFriendRequestsResponse = {
  sentRequests: SentRequest[];
  receivedRequests: ReceivedRequest[];
};

export type RespondToFriendRequestBody = {
  accept: boolean;
};

export type RespondToFriendRequestResponse = {
  message: string;
};
