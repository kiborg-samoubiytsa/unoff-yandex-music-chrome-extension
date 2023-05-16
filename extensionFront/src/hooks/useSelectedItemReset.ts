import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setSelectedItemType } from "../store/reducers/selectedItemSlice";
export const useSelectedItemReset = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setSelectedItemType("not-selected"));
  });
};
