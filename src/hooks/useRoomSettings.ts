import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../provider/authProvider";
import { GetRoomResponse, UpdateRoomBody } from "../types/Room";
import { User } from "../types/User";
import { callAPI } from "../utils/apiService";

type UserRoomSettingsReturn = {
  updateSettings: () => void;
  deleteSettings: () => void;
  fields: UpdateRoomBody;
  setName: (name: string) => void;
  updatedValues: UpdatedRoomValues | null;
};

type UpdatedUser = {
  userId: string;
  name: { content: string; isUpdated: boolean };
  role: { content: string; isUpdated: boolean };
};

export type UpdatedRoomValues = {
  name?: { content: string; isUpdated: boolean };
  users?: UpdatedUser[];
};

const useRoomSettings = (
  room: GetRoomResponse | undefined,
): UserRoomSettingsReturn => {
  const navigate = useNavigate();
  const { user: thisUser } = useAuth();

  const [fields, setFields] = useState<UpdateRoomBody>({
    name: "",
    users: [],
  });
  const [updatedValues, setUpdatedValues] = useState<UpdatedRoomValues | null>(
    null,
  );

  // Set the fields to the room data when the room is loaded
  useEffect(() => {
    if (room) {
      setFields({
        name: room.name,
        users: room.users.map((user) => ({
          userId: user.userId,
          privilages: user.privilages,
          role: user.role,
        })),
      });
    }
  }, [room]);

  const setName = (name: string) => {
    setFields((prev) => ({ ...prev, name }));
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

  const deleteSettingsMutation = useMutation({
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
    updateSettingsMutation.mutate(fields);
  };

  const deleteSettings = () => {
    deleteSettingsMutation.mutate();
  };

  return { updateSettings, deleteSettings, fields, setName, updatedValues };
};

const checkValues = (
  body: UpdateRoomBody,
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
      name: { content: user.username, isUpdated: false },
      role: { content: user.role, isUpdated: false },
    }));

    body.users.forEach((user) => {
      const currentUser = currentUsers.find(
        (current) => current.userId === user.userId,
      );

      if (currentUser) {
        if (currentUser.role.content !== user.role) {
          currentUser.role = { content: user.role, isUpdated: true };
          updatedCount++;
        }
      } else {
        currentUsers.push({
          userId: user.userId,
          name: {
            content:
              room.users.find((u) => user.userId === u.userId)?.username || "",
            isUpdated: false,
          },
          role: { content: user.role, isUpdated: true },
        });
        updatedCount++;
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
