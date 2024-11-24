import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../app/store";
import {
  clearAddObjectState,
  addObject as dispAddObject,
  deleteObject as dispDeleteObject,
  selectObjects,
} from "../slices/addObjectSlice";
import { callAPI } from "../utils/apiService";

type ObjectProps = { name: string; image?: string };

type UseAddObjectReturn = {
  addedObjects: ObjectProps[];
  addObject: (object: ObjectProps) => void;
  deleteObject: (index: number) => void;
  clearState: () => void;
  submit: (roomId: string) => void;
};

const useAddObject = (): UseAddObjectReturn => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const addedObjects = useSelector((state: RootState) => selectObjects(state));

  const addObject = (object: { name: string; image?: string }) => {
    dispatch(dispAddObject(object));
  };

  const deleteObject = (index: number) => {
    dispatch(dispDeleteObject(index));
  };

  const clearState = () => {
    dispatch(clearAddObjectState());
  };

  const mutation = useMutation({
    mutationFn: ({
      objects,
      roomId,
    }: {
      objects: ObjectProps[];
      roomId: string;
    }) =>
      callAPI<{ roomId: string }>(`/objects/add/${roomId}`, "PUT", {
        objects: objects,
      }),
    onSuccess: (data) => {
      clearState();
      queryClient.invalidateQueries({ queryKey: ["room", data.roomId] });
    },
    onError: (err) => {
      console.log(err);
    },
  });

  const submit = (roomId: string) => {
    if (addedObjects.length === 0) {
      console.error("Objects cannot be empty");
      return;
    }
    mutation.mutate({ objects: addedObjects, roomId });
  };

  return {
    addedObjects,
    addObject,
    deleteObject,
    submit,
    clearState,
  };
};

export default useAddObject;
