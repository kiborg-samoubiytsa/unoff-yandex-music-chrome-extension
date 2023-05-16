import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import axios from "axios";
interface playerState {
  currentTrackProgress: number;
  isPlaying: boolean;
  playId: string;
  index: number | null;
  currentTrackId: number | string;
  currentTrackAlbumId: number | string;
  currentTrackCover: string;
  currentTrackTitle: string;
  currentTrackArtists: [];
  currentTrackUrl: string;
  currentTrackDuration: number;
  metadata: string;
  status:
    | "idle"
    | "loading"
    | "succeeded"
    | "failed"
    | "playing"
    | "loaded-from-localStorage";
}

const {
  localCurrentDuration,
  localTitle,
  localCover,
  localArtists,
  localCurrentTrackId,
  localMetadata,
  localIndex,
  localIsPlaying,
  localCurrentTrackAlbumId,
  localSrc,
  localPlayId,
  localMaxDuration,
} = localStorage.getItem("lastPlayerState")
  ? JSON.parse(localStorage.getItem("lastPlayerState") || "")
  : {
      localCurrentDuration: 0,
      localTitle: "",
      localCover: "",
      localArtists: [],
      localCurrentTrackId: "",
      localMetadata: "",
      localIndex: null,
      localIsPlaying: false,
      localSrc: "",
      localMaxDuration: 0,
      localCurrentTrackAlbumId: 0,
      localPlayId: "",
    };

console.log(localIndex);
console.log(localCurrentTrackId);

const initialState: playerState = {
  currentTrackProgress: localCurrentDuration,
  isPlaying: localIsPlaying,
  playId: localPlayId,
  metadata: localMetadata,
  index: localIndex,
  currentTrackDuration: localMaxDuration,
  currentTrackId: localCurrentTrackId,
  currentTrackAlbumId: localCurrentTrackAlbumId,
  currentTrackCover: localCover,
  currentTrackTitle: localTitle,
  currentTrackArtists: localArtists,
  currentTrackUrl: localSrc,
  status: localStorage.getItem("lastPlayerState")
    ? "loaded-from-localStorage"
    : "idle",
};

console.log(localCurrentDuration);

export const fetchTrackUrl = createAsyncThunk(
  "track/current",
  async (id: string) => {
    console.log(id);

    const { data } = await axios.get(
      `https://zvuk-ponosa.glitch.me/api/get-mp3-link/id=${id}`
    );
    await chrome.runtime.sendMessage({
      track_url: data.url,
      track_id: id,
      offscreen: true,
    });
    console.log("трек начался");
    return { url: data.url, info: data.info[0] };
  }
);

const currentTrack = createSlice({
  name: "setPlayerTime",
  initialState,
  reducers: {
    setIsPlaying(state, action: PayloadAction<boolean>) {
      state.isPlaying = action.payload;
    },
    setIndex(state, action: PayloadAction<number>) {
      state.index = action.payload;
    },
    setCurrentTrackId(state, action: PayloadAction<number | string>) {
      state.currentTrackId = action.payload;
    },
    setCurrentTrackAlbum(state, action: PayloadAction<number | string>) {
      state.currentTrackAlbumId = action.payload;
    },
    setTrackStatus(state, action: PayloadAction<playerState["status"]>) {
      state.status = action.payload;
    },
    setTrackMetadata(state, action: PayloadAction<string>) {
      state.metadata = action.payload;
    },
    setPlayId(state, action: PayloadAction<string>) {
      state.playId = action.payload;
    },
    setTitle(state, action: PayloadAction<string>) {
      state.currentTrackTitle = action.payload;
    },
    setCover(state, action: PayloadAction<string>) {
      state.currentTrackCover = action.payload;
    },
    setArtists(state, action: PayloadAction<[]>) {
      state.currentTrackArtists = action.payload;
    },
    setCurrentTrackDuration(state, action: PayloadAction<number>) {
      state.currentTrackDuration = action.payload;
    },
    setCurrentTrackProgress(state, action: PayloadAction<number>) {
      state.currentTrackProgress = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchTrackUrl.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTrackUrl.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.currentTrackUrl = action.payload.url;
        state.currentTrackArtists = action.payload.info.artists;
        state.currentTrackId = action.payload.info.id;
        state.currentTrackAlbumId = action.payload.info.albums[0].id;
        console.log(action.payload.info);
        state.currentTrackCover =
          `https://${action.payload.info.coverUri?.replace("%%", "50x50")}` ||
          "";
        state.currentTrackTitle = action.payload.info.title;
      })
      .addCase(fetchTrackUrl.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export const selectIndex = (state: RootState) => state.currentTrack.index;
export const selectIsPlaying = (state: RootState) =>
  state.currentTrack.isPlaying;
export const trackId = (state: RootState) => state.currentTrack.currentTrackId;
export const trackUrl = (state: RootState) =>
  state.currentTrack.currentTrackUrl;
export const trackStatus = (state: RootState) => state.currentTrack.status;
export const trackCover = (state: RootState) =>
  state.currentTrack.currentTrackCover;
export const trackTitle = (state: RootState) =>
  state.currentTrack.currentTrackTitle;
export const trackArtists = (state: RootState) =>
  state.currentTrack.currentTrackArtists;
export const isTrackPlaying = (state: RootState) =>
  state.currentTrack.isPlaying;
export const trackAlbum = (state: RootState) =>
  state.currentTrack.currentTrackAlbumId;
export const _trackDuration = (state: RootState) =>
  state.currentTrack.currentTrackDuration;
export const _trackCurrentDuration = (state: RootState) =>
  state.currentTrack.currentTrackProgress;
export const {
  setCover,
  setArtists,
  setTitle,
  setIsPlaying,
  setIndex,
  setCurrentTrackId,
  setTrackStatus,
  setCurrentTrackAlbum,
  setCurrentTrackDuration,
  setCurrentTrackProgress,
} = currentTrack.actions;
export default currentTrack.reducer;
