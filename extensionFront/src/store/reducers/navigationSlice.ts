import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface Navigation {
  animationDirection: "back" | "forward" | "none";
}

const initialState: Navigation = { animationDirection: "none" };

const navigationStyles = createSlice({
  name: "navigationStyles",
  initialState,
  reducers: {
    setNavigationStyle(
      state,
      action: PayloadAction<Navigation["animationDirection"]>
    ) {
      state.animationDirection = action.payload;
    },
  },
});

export const _navigationStyles = (state: RootState) =>
  state.navigationSlice.animationDirection;
export const { setNavigationStyle } = navigationStyles.actions;
export default navigationStyles.reducer;
