import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  AlbumWithTracks,
  FullTrackInfo,
  IPlaylist,
  SimilarTracks,
  Track,
  TrackSupplement,
} from "../../types/types";
import axios from "axios";
import { RootState } from "../store";

interface CollectionState {
  selectedItemInfo: IPlaylist | AlbumWithTracks | FullTrackInfo;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | undefined;
  selectedItemMetadata: string;
  type: "not-selected" | "playlist" | "album" | "track" | string;
}

const initialState: CollectionState = {
  selectedItemInfo: {} as IPlaylist | AlbumWithTracks,
  status: "idle",
  error: undefined,
  selectedItemMetadata: "",
  type: "not-selected",
};

export const fetchPlaylist = createAsyncThunk(
  "collection/fetchPlaylist",
  async ({ user, kind }: any): Promise<IPlaylist> => {
    console.log(user, kind);
    const userData = JSON.parse(localStorage.getItem("user-data") || "");
    const { data } = await axios.get(
      `https://zvuk-ponosa.glitch.me/api/playlists/info/user=${user}/kind=${kind}/token=${userData.token}`
    );
    console.log(data);
    return data;
  }
);
export const fetchAlbum = createAsyncThunk(
  "collection/fetchAlbum",
  async ({ albumId }: any): Promise<AlbumWithTracks> => {
    const userData = JSON.parse(localStorage.getItem("user-data") || "");
    const { data } = await axios.get(
      `https://zvuk-ponosa.glitch.me/api/album/with-tracks/id=${albumId}/token=${userData.token}`
    );
    return data;
  }
);
export const fetchTrackInfo = createAsyncThunk(
  "collection/fetchTrackInfo",
  async ({
    trackId,
  }: {
    trackId: string | number;
  }): Promise<{
    supplement: TrackSupplement;
    similar: SimilarTracks;
  }> => {
    const userData = JSON.parse(localStorage.getItem("user-data") || "");
    const { data: trackSupplement } = await axios.get(
      `https://zvuk-ponosa.glitch.me/api/track/supplement/id=${trackId}/token=${userData.token}`
    );
    const { data: similarTracks } = await axios.get(
      `https://zvuk-ponosa.glitch.me/api/track/similar/id=${trackId}/token=${userData.token}`
    );
    console.log(trackSupplement.lyrics, similarTracks);
    return { supplement: trackSupplement, similar: similarTracks };
  }
);

export const currentPlaylistSlice = createSlice({
  name: "tracks",
  initialState,
  reducers: {
    setSelectedItemType(state, action: PayloadAction<CollectionState["type"]>) {
      state.type = action.payload; //method is needed to reset collection type
    },

    setItemMetadata(state, action: PayloadAction<string>) {
      state.selectedItemMetadata = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchPlaylist.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchPlaylist.fulfilled, (state, action) => {
        state.selectedItemInfo = action.payload;
        state.status = "succeeded";
        state.type = "playlist";
      })
      .addCase(fetchPlaylist.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchAlbum.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchAlbum.fulfilled, (state, action) => {
        state.selectedItemInfo = action.payload;
        state.status = "succeeded";
        state.type = "album";
      })
      .addCase(fetchAlbum.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchTrackInfo.fulfilled, (state, action) => {
        state.selectedItemInfo = action.payload;
        state.status = "succeeded";
        state.type = "track";
      })
      .addCase(fetchTrackInfo.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchTrackInfo.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});
export const selectedCollection = (state: RootState) =>
  state.playlistSlice.selectedItemInfo;
export const status = (state: RootState) => state.playlistSlice.status;
export const collectionType = (state: RootState) => state.playlistSlice.type;
export const selectedItemMeta = (state: RootState) =>
  state.playlistSlice.selectedItemMetadata;
export const { setSelectedItemType, setItemMetadata } =
  currentPlaylistSlice.actions;
export const playlistSlice = currentPlaylistSlice.reducer;
