import { createSlice } from "@reduxjs/toolkit";
import {
  AlbumWithTracks,
  IPlaylist,
  RotorTrack,
  SimilarTracks,
  Track,
} from "../../types/types";
import { RootState } from "../store";
import { PayloadAction } from "@reduxjs/toolkit";

interface currentQueueState {
  currentQueue:
    | IPlaylist
    | AlbumWithTracks
    | SimilarTracks
    | Track[]
    | RotorTrack[];
  error: string | undefined;
  type:
    | "playlist"
    | "album"
    | "not-selected"
    | "similar-tracks"
    | "track"
    | "rotor-track";
}

const { localSourceQueue, localQueueType } = localStorage.getItem(
  //gets default values from localStorage
  "lastPlayerState"
)
  ? JSON.parse(localStorage.getItem("lastPlayerState") || "")
  : {
      localSourceQueue: {} as Required<IPlaylist> | AlbumWithTracks,
      localQueueType: "",
    };

console.log(localSourceQueue);

const initialState: currentQueueState = {
  currentQueue: localSourceQueue
    ? localSourceQueue
    : ({} as Required<IPlaylist> | AlbumWithTracks),
  error: undefined,
  type: localQueueType ? localQueueType : "not-selected",
};

const queueSlice = createSlice({
  name: "currentQueue",
  initialState,
  reducers: {
    setCurrentQueue(
      state,
      action: PayloadAction<
        IPlaylist | AlbumWithTracks | SimilarTracks | Track[]
      >
    ) {
      state.currentQueue = action.payload;
    },
    setQueueType(state, action: PayloadAction<currentQueueState["type"]>) {
      state.type = action.payload;
    },
  },
});
export const { setCurrentQueue, setQueueType } = queueSlice.actions;
export const currentQueue = (state: RootState) =>
  state.currentQueueSlice.currentQueue;
export const queueType = (state: RootState) => state.currentQueueSlice.type;
export const currentQueueSlice = queueSlice.reducer;
