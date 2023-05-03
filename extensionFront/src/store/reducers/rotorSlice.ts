import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getYourWaveSequence } from "../../requests/getYourWaveSequence";
import { getRotorSettings } from "../../requests/getRotorSettings";
import { IRotorTrack, RotorSettings2 } from "../../types/types";
import { RootState } from "../store";

interface IRotor {
  rotorQueue: IRotorTrack[];
  queueStatus: "idle" | "loading" | "succeeded" | "failed";
  currentStation: string;
  rotorSettings: RotorSettings2;
  settingsStatus: "idle" | "loading" | "succeeded" | "failed";
  settingsStyles: {
    moodSelector: React.CSSProperties;
    diversitySelector: React.CSSProperties;
    languageSelector: React.CSSProperties;
  };
  selectorTitles: {
    moodSelector: string | null;
    diversitySelector: string | null;
    languageSelector: string | null;
  };
}
const initialState: IRotor = {
  rotorQueue: [],
  queueStatus: "idle",
  currentStation: "user:onyourwave",
  rotorSettings: {
    diversity: "default",
    moodEnergy: "all",
    language: "any",
  },
  settingsStyles: {
    moodSelector: { width: "100px", transform: "translateX(400%)" },
    diversitySelector: { width: "125px", transform: "translateX(300%)" },
    languageSelector: { width: "150px", transform: "translateX(200%)" },
  },
  selectorTitles: {
    moodSelector: "Любое",
    diversitySelector: "Любое",
    languageSelector: "Любой",
  },
  settingsStatus: "idle",
};
export const fetchRotorQueue = createAsyncThunk(
  "fetch/rotorQueue",
  async () => {
    const data = await getYourWaveSequence();
    console.log(data);
    return data;
  }
);

export const fetchRotorSettings = createAsyncThunk(
  "fetch/rotorSettings",
  async (): Promise<RotorSettings2> => {
    const data = getRotorSettings();
    return data;
  }
);

export const rotorSlice = createSlice({
  name: "rotorSlice",
  initialState: initialState,
  reducers: {
    setSettingsStyles(state, action: PayloadAction<IRotor["settingsStyles"]>) {
      state.settingsStyles = action.payload;
    },
    setSelectorTitles(state, action: PayloadAction<IRotor["selectorTitles"]>) {
      state.selectorTitles = action.payload;
    },
    setSettingsValues(state, action: PayloadAction<IRotor["rotorSettings"]>) {
      state.rotorSettings = action.payload;
    },
    setRotorLoadingStatus(state, action: PayloadAction<IRotor["queueStatus"]>) {
      state.queueStatus = action.payload;
    },
    setRotorQueue(state, action: PayloadAction<IRotor["rotorQueue"]>) {
      state.rotorQueue = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchRotorQueue.pending, (state, action) => {
        state.queueStatus = "loading";
      })
      .addCase(fetchRotorQueue.fulfilled, (state, action) => {
        state.queueStatus = "succeeded";
        state.rotorQueue = action.payload;
      })
      .addCase(fetchRotorQueue.rejected, (state, action) => {
        state.queueStatus = "failed";
      })
      .addCase(fetchRotorSettings.pending, (state, action) => {
        state.settingsStatus = "loading";
      })
      .addCase(fetchRotorSettings.fulfilled, (state, action) => {
        state.settingsStatus = "succeeded";
        state.rotorSettings = action.payload;
        switch (state.rotorSettings.moodEnergy) {
          case "active": {
            state.selectorTitles.moodSelector = "Бодрое";
            state.settingsStyles.moodSelector = {
              ...state.settingsStyles.moodSelector,
              transform: "0",
              transition: "transform 0.3s ease-out 0s",
            };
            break;
          }
          case "fun": {
            state.selectorTitles.moodSelector = "Весёлое";
            state.settingsStyles.moodSelector = {
              ...state.settingsStyles.moodSelector,
              transform: "translateX(100%)",
              transition: "transform 0.3s ease-out 0s",
            };
            break;
          }
          case "calm": {
            state.selectorTitles.moodSelector = "Спокойное";
            state.settingsStyles.moodSelector = {
              ...state.settingsStyles.moodSelector,
              transform: "translateX(200%)",
              transition: "transform 0.3s ease-out 0s",
            };
            break;
          }
          case "sad": {
            state.selectorTitles.moodSelector = "Грустное";
            state.settingsStyles.moodSelector = {
              ...state.settingsStyles.moodSelector,
              transform: "translateX(300%)",
              transition: "transform 0.3s ease-out 0s",
            };
            break;
          }
          case "all": {
            state.selectorTitles.moodSelector = "Любое";
            state.settingsStyles.moodSelector = {
              ...state.settingsStyles.moodSelector,
              transform: "translateX(400%)",
              transition: "transform 0.3s ease-out 0s",
            };
          }
        }
        switch (state.rotorSettings.diversity) {
          case "favorite": {
            state.selectorTitles.diversitySelector = "Любимое";
            state.settingsStyles.diversitySelector = {
              ...state.settingsStyles.diversitySelector,
              transform: "translateX(0%)",
              transition: "transform 0.3s ease-out 0s",
            };
            break;
          }
          case "discover": {
            state.selectorTitles.diversitySelector = "Незнакомое";
            state.settingsStyles.diversitySelector = {
              ...state.settingsStyles.diversitySelector,
              transform: "translateX(100%)",
              transition: "transform 0.3s ease-out 0s",
            };
            break;
          }
          case "popular": {
            state.selectorTitles.diversitySelector = "Популярное";
            state.settingsStyles.diversitySelector = {
              ...state.settingsStyles.diversitySelector,
              transform: "translateX(200%)",
              transition: "transform 0.3s ease-out 0s",
            };
            break;
          }
          case "default": {
            state.selectorTitles.diversitySelector = "Любое";
            state.settingsStyles.diversitySelector = {
              ...state.settingsStyles.diversitySelector,
              transform: "translateX(300%)",
              transition: "transform 0.3s ease-out 0s",
            };
            break;
          }
        }
        switch (
          state.rotorSettings.language //"russian" | "not-russian" | "any";
        ) {
          case "russian": {
            state.selectorTitles.languageSelector = "Русский";
            state.settingsStyles.languageSelector = {
              ...state.settingsStyles.languageSelector,
              transform: "translateX(0%)",
              transition: "transform 0.3s ease-out 0s",
            };
            break;
          }
          case "not-russian": {
            state.selectorTitles.languageSelector = "Иностранный";
            state.settingsStyles.languageSelector = {
              ...state.settingsStyles.languageSelector,
              transition: "transform 0.3s ease-out 0s",
              transform: "translateX(100%)",
            };
            break;
          }
          case "any": {
            state.selectorTitles.languageSelector = "Любой";
            state.settingsStyles.languageSelector = {
              ...state.settingsStyles.languageSelector,
              transition: "transform 0.3s ease-out 0s",
              transform: "translateX(200%)",
            };
          }
        }
      })
      .addCase(fetchRotorSettings.rejected, (state, action) => {
        state.settingsStatus = "failed";
      });
  },
});
export const {
  setSettingsStyles,
  setSelectorTitles,
  setSettingsValues,
  setRotorLoadingStatus,
  setRotorQueue,
} = rotorSlice.actions;
export const rotorQueue = (state: RootState) =>
  state.rotorSliceReducer.rotorQueue;
export const currentStation = (state: RootState) =>
  state.rotorSliceReducer.currentStation;
export const rotorSettings = (state: RootState) =>
  state.rotorSliceReducer.rotorSettings;
export const settingsStyles = (state: RootState) =>
  state.rotorSliceReducer.settingsStyles;
export const selectorTitles = (state: RootState) =>
  state.rotorSliceReducer.selectorTitles;
export const rotorQueueStatus = (state: RootState) =>
  state.rotorSliceReducer.queueStatus;
export const rotorSliceReducer = rotorSlice.reducer;
