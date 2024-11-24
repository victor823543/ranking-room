import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CreateRoomBody, RankingSystem, RoomUser } from "../types/Room";

type CreateRoomState = {
  step: number;
  body: CreateRoomBody;
};

const initialState: CreateRoomState = {
  step: 0,
  body: {
    name: "",
    rankingSystem: RankingSystem.RANK,
    objects: [],
  },
};

const createRoomSlice = createSlice({
  name: "createRoom",
  initialState,
  reducers: {
    nextCreateStep: (state) => {
      state.step += 1;
    },
    previousCreateStep: (state) => {
      state.step -= 1;
    },
    setCreateStep: (state, action: PayloadAction<number>) => {
      state.step = action.payload;
    },
    setCreateName: (state, action: PayloadAction<string>) => {
      state.body = { ...state.body, name: action.payload };
    },
    setCreateRankingSystem: (state, action: PayloadAction<RankingSystem>) => {
      state.body = { ...state.body, rankingSystem: action.payload };
    },
    addCreateObject: (
      state,
      action: PayloadAction<{ name: string; image?: string }>,
    ) => {
      state.body = {
        ...state.body,
        objects: [...state.body.objects, action.payload],
      };
    },
    deleteCreateObject: (state, action: PayloadAction<number>) => {
      state.body = {
        ...state.body,
        objects: state.body.objects.filter(
          (_, index) => index !== action.payload,
        ),
      };
    },
    addCreateUser: (state, action: PayloadAction<RoomUser>) => {
      state.body = {
        ...state.body,
        users: [...(state.body.users || []), action.payload],
      };
    },
    deleteCreateUser: (state, action: PayloadAction<number>) => {
      state.body = {
        ...state.body,
        users: state.body.users?.filter((_, index) => index !== action.payload),
      };
    },
    clearCreateRoomState: (state) => {
      state.step = initialState.step;
      state.body = { ...initialState.body };
    },
  },
  selectors: {
    selectStep: (state) => state.step,
    selectBody: (state) => state.body,
  },
});

export const {
  clearCreateRoomState,
  nextCreateStep,
  previousCreateStep,
  setCreateStep,
  setCreateName,
  addCreateObject,
  deleteCreateObject,
  addCreateUser,
  deleteCreateUser,
  setCreateRankingSystem,
} = createRoomSlice.actions;

export const { selectStep, selectBody } = createRoomSlice.selectors;

export default createRoomSlice;
