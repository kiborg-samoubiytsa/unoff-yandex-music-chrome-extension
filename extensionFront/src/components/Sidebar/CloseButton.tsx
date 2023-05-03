import { FC } from "react";
import { IconContext } from "react-icons";
import { AiOutlineClose } from "react-icons/ai";
import { useDispatch } from "react-redux";
import {
  setIsCollectionSelected,
  setIsTrackSelected,
  setSelectedItemType,
} from "../../store/reducers/selectedItemSlice";
import "./Sidebar.scss";

const CloseButton: FC = () => {
  const dispatch = useDispatch();
  return (
    <div>
      <IconContext.Provider value={{ size: "32" }}>
        <AiOutlineClose
          className="sidebar_closeButton"
          onClick={() => {
            dispatch(setIsCollectionSelected(false));
            dispatch(setIsTrackSelected(false));
            dispatch(setSelectedItemType("not-selected"));
          }}
        />
      </IconContext.Provider>
    </div>
  );
};

export default CloseButton;
