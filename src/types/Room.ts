export type CreateRoomBody = {
  name: string;
  users?: Array<RoomUser>;
  rankingSystem: RankingSystem;
  objects: Array<{ name: string; image?: string }>;
  maxPoints?: number;
  categories?: string[];
  tierNames?: string[];
  isPublic?: boolean;
};

export type UpdateRoomBody = {
  name?: string;
  users?: Array<RoomUser>;
};

export type RoomUser = {
  userId: string;
  privilages: UserPrivilage[];
  role: UserRole;
};

export type RoomUserExtended = RoomUser & {
  username: string;
};

export type GetRoomResponse = {
  id: string;
  name: string;
  users: Array<RoomUserExtended>;
  rankingSystem: RankingSystem;
  maxPoints?: number;
  categories?: string[];
  tierNames?: string[];
  objects: Array<Object>;
  isPinned: boolean;
};

export type ListRoomsResponse = Array<{
  id: string;
  name: string;
  users: Array<RoomUserExtended>;
  objects: Array<Object>;
  timestamp: number;
  rankingSystem: RankingSystem;
  isPinned: boolean;
}>;

export type Object = {
  _id: string;
  name: string;
  image?: string;
  room: string;
  ranking: ObjectRanking[];
  averageRankingPoints: number;
  averageCategoryPoints?: Record<string, number>;
  timestamp: number;
};

export type ObjectRanking = {
  user: string;
  points?: number;
  rank?: number;
  tier?: number;
  categoryRanking?: Record<string, number>;
};

export enum UserPrivilage {
  INVITE = "INVITE",
  EDIT = "EDIT",
  DELETE = "DELETE",
  ADD = "ADD",
  RANK = "RANK",
  VIEW = "VIEW",
}

export enum UserRole {
  ADMIN = "ADMIN",
  CONTRIBUTOR = "CONTRIBUTOR",
  USER = "USER",
  VIEW_ONLY = "VIEW_ONLY",
  CUSTOM = "CUSTOM",
}

export const convertRoleToPrivilages = {
  [UserRole.ADMIN]: [
    UserPrivilage.INVITE,
    UserPrivilage.EDIT,
    UserPrivilage.DELETE,
    UserPrivilage.ADD,
    UserPrivilage.RANK,
    UserPrivilage.VIEW,
  ],
  [UserRole.CONTRIBUTOR]: [
    UserPrivilage.ADD,
    UserPrivilage.RANK,
    UserPrivilage.VIEW,
  ],
  [UserRole.USER]: [UserPrivilage.VIEW, UserPrivilage.RANK],
  [UserRole.VIEW_ONLY]: [UserPrivilage.VIEW],
  [UserRole.CUSTOM]: [],
};

export enum RankingSystem {
  TIER = "TIER",
  POINTS = "POINTS",
  RANK = "RANK",
  CATEGORY = "CATEGORY",
}

export const convertRankingSystemToLabel = {
  [RankingSystem.TIER]: "Tierlist",
  [RankingSystem.POINTS]: "Pointssystem",
  [RankingSystem.RANK]: "Rankinglist",
  [RankingSystem.CATEGORY]: "Categorysystem",
};

export const convertUserRoleToLabel = {
  [UserRole.ADMIN]: "Admin",
  [UserRole.CONTRIBUTOR]: "Contributor",
  [UserRole.USER]: "User",
  [UserRole.VIEW_ONLY]: "Viewer",
  [UserRole.CUSTOM]: "Custom",
};

export type RankObjectsBody =
  | {
      rankingSystem: RankingSystem.RANK;
      objectRanking: Array<{ object: string; rank: number }>;
    }
  | {
      rankingSystem: RankingSystem.POINTS;
      objectRanking: Array<{ object: string; points: number }>;
    }
  | {
      rankingSystem: RankingSystem.TIER;
      objectRanking: Array<{ object: string; tier: number }>;
    }
  | {
      rankingSystem: RankingSystem.CATEGORY;
      objectRanking: Array<{
        object: string;
        categoryRanking: Record<string, number>;
      }>;
    };
