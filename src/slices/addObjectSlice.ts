import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type AddObjectState = {
  objects: Array<{ name: string; image?: string }>;
};

const initialState: AddObjectState = {
  objects: [],
};

const addObjectSlice = createSlice({
  name: "addObject",
  initialState,
  reducers: {
    addObject: (
      state,
      action: PayloadAction<{ name: string; image?: string }>,
    ) => {
      state.objects.push(action.payload);
    },
    deleteObject: (state, action: PayloadAction<number>) => {
      state.objects.splice(action.payload, 1);
    },
    clearAddObjectState: (state) => {
      state.objects = [];
    },
  },
  selectors: {
    selectObjects: (state) => state.objects,
  },
});

export const { addObject, deleteObject, clearAddObjectState } =
  addObjectSlice.actions;

export const { selectObjects } = addObjectSlice.selectors;

export default addObjectSlice;
