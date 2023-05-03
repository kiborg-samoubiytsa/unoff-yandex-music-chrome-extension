import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface IPlayer {
  isVisible: boolean;
  isInRadioMode: boolean;
}

const initialState: IPlayer = { isVisible: true, isInRadioMode: false };

const togglePlayer = createSlice({
  name: "togglePlayer",
  initialState,
  reducers: {
    setPlayerVisible(state, action: PayloadAction<boolean>) {
      state.isVisible = true;
    },
    setIsRadioMode(state, action: PayloadAction<boolean>) {
      state.isInRadioMode = action.payload;
    },
  },
});

export const isPlayerVisible = (state: RootState) =>
  state.playerSlice.isVisible;
export const isInRadioMode = (state: RootState) =>
  state.playerSlice.isInRadioMode;
export const { setPlayerVisible, setIsRadioMode } = togglePlayer.actions;
export default togglePlayer.reducer;
