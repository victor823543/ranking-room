import { useMutation } from "@tanstack/react-query";
import { useEffect, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../provider/authProvider";
import {
  convertRoleToPrivilages,
  GetRoomResponse,
  RoomUser,
  RoomUserExtended,
  UpdateRoomBody,
  UserRole,
} from "../types/Room";
import { User } from "../types/User";
import { callAPI } from "../utils/apiService";

type UserRoomSettingsReturn = {
  updateSettings: () => void;
  deleteRoom: () => void;
  fields: FieldsType;
  setName: (name: string) => void;
  addUser: (user: RoomUserExtended) => void;
  deleteUser: (userId: string) => void;
  changeRole: (userId: string, role: UserRole) => void;
  updatedValues: UpdatedRoomValues | null;
};

type FieldsType = {
  name: string;
  users: RoomUserExtended[];
};

type UpdatedUser = {
  userId: string;
  name: { content: string; status: "updated" | "deleted" | "same" };
  role: { content: string; status: "updated" | "deleted" | "same" };
};

export type UpdatedRoomValues = {
  name?: { content: string; isUpdated: boolean };
  users?: UpdatedUser[];
};

type FieldsAction =
  | { type: "SET_NAME"; payload: string }
  | { type: "ADD_USER"; payload: RoomUserExtended }
  | { type: "DELETE_USER"; payload: string }
  | { type: "CHANGE_ROLE"; payload: { userId: string; role: UserRole } }
  | { type: "SET_USERS"; payload: RoomUserExtended[] };

const fieldsReducer = (state: FieldsType, action: FieldsAction): FieldsType => {
  switch (action.type) {
    case "SET_NAME":
      return { ...state, name: action.payload };
    case "ADD_USER":
      return { ...state, users: [...state.users, action.payload] };
    case "DELETE_USER":
      return {
        ...state,
        users: state.users.filter((user) => user.userId !== action.payload),
      };
    case "CHANGE_ROLE":
      return {
        ...state,
        users: state.users.map((user) =>
          user.userId === action.payload.userId
            ? { ...user, role: action.payload.role }
            : user,
        ),
      };
    case "SET_USERS":
      return { ...state, users: action.payload };
    default:
      return state;
  }
};

const useRoomSettings = (
  room: GetRoomResponse | undefined,
): UserRoomSettingsReturn => {
  const navigate = useNavigate();
  const { user: thisUser } = useAuth();

  const [fields, dispatch] = useReducer(fieldsReducer, {
    name: "",
    users: [],
  });
  const [updatedValues, setUpdatedValues] = useState<UpdatedRoomValues | null>(
    null,
  );

  // Set the fields to the room data when the room is loaded
  useEffect(() => {
    if (room) {
      dispatch({ type: "SET_NAME", payload: room.name });
      dispatch({ type: "SET_USERS", payload: room.users });
    }
  }, [room]);

  const setName = (name: string) => {
    dispatch({ type: "SET_NAME", payload: name });
  };

  const addUser = (user: RoomUserExtended) => {
    dispatch({ type: "ADD_USER", payload: user });
  };

  const deleteUser = (userId: string) => {
    dispatch({ type: "DELETE_USER", payload: userId });
  };

  const changeRole = (userId: string, role: UserRole) => {
    dispatch({ type: "CHANGE_ROLE", payload: { userId, role } });
  };

  useEffect(() => {
    const updatedValues = checkValues(fields, room, thisUser);
    setUpdatedValues(updatedValues);
  }, [fields]);

  const updateSettingsMutation = useMutation({
    mutationFn: (data: UpdateRoomBody) =>
      room
        ? callAPI(`/rooms/${room.id}`, "PUT", data)
        : Promise.reject(new Error("Room is undefined")),
    onSuccess: () => {
      if (room) {
        navigate(`/rooms/${room.id}`);
      }
    },
    onError: (err) => {
      console.log(err);
    },
  });

  const deleteRoomMutation = useMutation({
    mutationFn: () =>
      room
        ? callAPI(`/rooms/${room.id}`, "DELETE")
        : Promise.reject(new Error("Room is undefined")),
    onSuccess: () => {
      navigate("/rooms");
    },
    onError: (err) => {
      console.log(err);
    },
  });

  const updateSettings = () => {
    const getBodyUsers: RoomUser[] = fields.users.map((user) => ({
      userId: user.userId,
      role: user.role,
      privilages: convertRoleToPrivilages[user.role],
    }));
    updateSettingsMutation.mutate({ name: fields.name, users: getBodyUsers });
  };

  const deleteRoom = () => {
    deleteRoomMutation.mutate();
  };

  return {
    updateSettings,
    deleteRoom,
    fields,
    setName,
    updatedValues,
    addUser,
    deleteUser,
    changeRole,
  };
};

const checkValues = (
  body: FieldsType,
  room: GetRoomResponse | undefined,
  thisUser: User | null | undefined,
): UpdatedRoomValues | null => {
  if (!room) {
    return null;
  }

  let updatedValues: UpdatedRoomValues | null = null;

  if (body.name !== room.name && body.name) {
    updatedValues = {
      name: { content: body.name, isUpdated: true },
      users: [],
    };
  }

  if (room.users && body.users) {
    let updatedCount = 0;
    const currentUsers: UpdatedUser[] = room.users.map((user) => ({
      userId: user.userId,
      name: { content: user.username, status: "same" },
      role: { content: user.role, status: "same" },
    }));

    body.users.forEach((user) => {
      const currentUser = currentUsers.find(
        (current) => current.userId === user.userId,
      );

      if (currentUser) {
        if (currentUser.role.content !== user.role) {
          currentUser.role = { content: user.role, status: "updated" };
          updatedCount++;
        }
      } else {
        currentUsers.push({
          userId: user.userId,
          name: {
            content: user.username,
            status: "updated",
          },
          role: { content: user.role, status: "updated" },
        });
        updatedCount++;
      }
    });

    room.users.forEach((user) => {
      if (!body.users.find((u) => u.userId === user.userId)) {
        const currentUser = currentUsers.find(
          (current) => current.userId === user.userId,
        );
        if (currentUser) {
          currentUser.name = { content: user.username, status: "deleted" };
          currentUser.role = { content: user.role, status: "deleted" };
          updatedCount++;
        }
      }
    });

    if (updatedCount > 0) {
      if (!updatedValues) {
        updatedValues = {
          name: { content: room.name, isUpdated: false },
          users: currentUsers,
        };
      } else {
        updatedValues.users = currentUsers;
      }
    }
  }

  if (updatedValues?.users) {
    const filteredUsers = updatedValues.users.filter(
      (u) => u.userId !== thisUser?._id,
    );
    updatedValues.users = filteredUsers;
  }

  return updatedValues;
};

export default useRoomSettings;
