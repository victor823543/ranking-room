import { useMutation } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../app/store";
import {
  addCreateObject,
  addCreateUser,
  clearCreateRoomState,
  deleteCreateObject,
  deleteCreateUser,
  nextCreateStep,
  previousCreateStep,
  selectBody,
  selectStep,
  setCreateName,
  setCreateRankingSystem,
} from "../slices/createRoomSlice";
import { CreateRoomBody, RankingSystem, RoomUser } from "../types/Room";
import { callAPI } from "../utils/apiService";

type UseCreateRoomReturn = {
  step: number;
  body: CreateRoomBody;
  nextStep: () => void;
  previousStep: () => void;
  setName: (name: string) => void;
  setRankingSystem: (rankingSystem: RankingSystem) => void;
  addObject: (object: { name: string; image?: string }) => void;
  deleteObject: (index: number) => void;
  addUser: (user: RoomUser) => void;
  deleteUser: (index: number) => void;
  createRoom: () => void;
  clearState: () => void;
};

const useCreateRoom = (): UseCreateRoomReturn => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const currentStep = useSelector((state: RootState) => selectStep(state));
  const currentBody = useSelector((state: RootState) => selectBody(state));

  const nextStep = () => {
    dispatch(nextCreateStep());
  };

  const previousStep = () => {
    dispatch(previousCreateStep());
  };

  const setName = (name: string) => {
    dispatch(setCreateName(name));
  };

  const setRankingSystem = (rankingSystem: RankingSystem) => {
    dispatch(setCreateRankingSystem(rankingSystem));
  };

  const addObject = (object: { name: string; image?: string }) => {
    dispatch(addCreateObject(object));
  };

  const deleteObject = (index: number) => {
    dispatch(deleteCreateObject(index));
  };

  const addUser = (user: RoomUser) => {
    dispatch(addCreateUser(user));
  };

  const deleteUser = (index: number) => {
    dispatch(deleteCreateUser(index));
  };

  const clearState = () => {
    dispatch(clearCreateRoomState());
  };

  const mutation = useMutation({
    mutationFn: (body: CreateRoomBody) =>
      callAPI<{ roomId: string }>(`/rooms/create`, "POST", body),
    onSuccess: (data) => {
      clearState();
      navigate(`/rooms/${data.roomId}`);
    },
    onError: (err) => {
      console.log(err);
    },
  });

  const createRoom = () => {
    if (!currentBody.name) {
      console.error("Name cannot be empty");
      return;
    }
    if (!currentBody.objects) {
      console.error("Objects cannot be empty");
      return;
    }
    if (!currentBody.rankingSystem) {
      console.error("Ranking system cannot be empty");
      return;
    }
    mutation.mutate(currentBody);
  };

  return {
    step: currentStep,
    body: currentBody,
    nextStep,
    previousStep,
    setName,
    setRankingSystem,
    addObject,
    deleteObject,
    addUser,
    deleteUser,
    createRoom,
    clearState,
  };
};

export default useCreateRoom;
