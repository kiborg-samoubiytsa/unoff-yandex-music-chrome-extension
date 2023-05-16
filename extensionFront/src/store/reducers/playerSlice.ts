import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

const { localIsRadioMode } = localStorage.getItem("lastPlayerState")
  ? JSON.parse(localStorage.getItem("lastPlayerState") || "")
  : {
      localIsRadioMode: false,
    };

interface IPlayer {
  isInRadioMode: boolean;
}

const initialState: IPlayer = { isInRadioMode: localIsRadioMode };

const togglePlayer = createSlice({
  name: "togglePlayer",
  initialState,
  reducers: {
    setIsRadioMode(state, action: PayloadAction<boolean>) {
      state.isInRadioMode = action.payload;
    },
  },
});

export const isInRadioMode = (state: RootState) =>
  state.playerSlice.isInRadioMode;
export const { setIsRadioMode } = togglePlayer.actions;
export default togglePlayer.reducer;
