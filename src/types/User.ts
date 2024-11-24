export type User = {
  _id: string;
  username: string;
  email: string;
  timestamp: number;
};

export type UserInfo = {
  _id: string;
  username: string;
};

export type FriendInfo = {
  _id: string;
  username: string;
  friends: UserInfo[];
};

export type ListFriendsResponse = FriendInfo[];

export enum UserStatus {
  FRIEND,
  SENT_REQUEST,
  RECEIVED_REQUEST,
  DEFAULT,
}
