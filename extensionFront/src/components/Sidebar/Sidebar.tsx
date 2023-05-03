import "./Sidebar.scss";
import { useSelector } from "react-redux";
import {
  collectionType as _collectionType,
  isCollectionSelected,
  isTrackSelected,
} from "../../store/reducers/selectedItemSlice";
import { TracksSidebar } from "./TracksSidebar";
import { SingleTrackSidebar } from "./SingleTrackSidebar";

export const Sidebar = () => {
  const isCollection = useSelector(isCollectionSelected);
  const isTrack = useSelector(isTrackSelected);
  const collectionType = useSelector(_collectionType);
  console.log(isTrack);
  return (
    <>
      {collectionType != "not-selected" ? (
        <div className="sidebar">
          {isCollection ? (
            <TracksSidebar />
          ) : isTrack ? (
            <SingleTrackSidebar />
          ) : (
            <></>
          )}
          {/* <div className="sidebar_padding"></div> */}
        </div>
      ) : (
        <></>
      )}
    </>
  );
};
