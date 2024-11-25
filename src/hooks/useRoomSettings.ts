import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GetRoomResponse, UpdateRoomBody } from "../types/Room";
import { callAPI } from "../utils/apiService";

type UserRoomSettingsReturn = {
  updateSettings: (data: UpdateRoomBody) => void;
  deleteSettings: () => void;
  fields: UpdateRoomBody;
  setName: (name: string) => void;
};

const useRoomSettings = (
  room: GetRoomResponse | undefined,
): UserRoomSettingsReturn => {
  const navigate = useNavigate();

  const [fields, setFields] = useState<UpdateRoomBody>({
    name: "",
    users: [],
  });

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

  const updateSettings = (data: UpdateRoomBody) => {
    updateSettingsMutation.mutate(data);
  };

  const deleteSettings = () => {
    deleteSettingsMutation.mutate();
  };

  return { updateSettings, deleteSettings, fields, setName };
};

export default useRoomSettings;
