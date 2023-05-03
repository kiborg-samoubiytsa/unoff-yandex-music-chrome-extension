import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  setIsCollectionSelected,
  setIsTrackSelected,
  setSelectedItemType,
} from "../store/reducers/selectedItemSlice";
export const useSelectedItemReset = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setSelectedItemType("not-selected"));
    dispatch(setIsCollectionSelected(false));
    dispatch(setIsTrackSelected(false));
  });
};
