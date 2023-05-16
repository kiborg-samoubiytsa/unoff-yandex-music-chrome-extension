import "./Sidebar.scss";
import { useSelector } from "react-redux";
import { collectionType as _collectionType } from "../../store/reducers/selectedItemSlice";
import { TracksSidebar } from "./TracksSidebar";
import { SingleTrackSidebar } from "./SingleTrackSidebar";

export const Sidebar = () => {
  const collectionType = useSelector(_collectionType);
  return (
    <>
      {collectionType != "not-selected" ? (
        <div className="sidebar">
          {collectionType != "track" ? (
            <TracksSidebar />
          ) : (
            <SingleTrackSidebar />
          )}
          {/* <div className="sidebar_padding"></div> */}
        </div>
      ) : (
        <></>
      )}
    </>
  );
};
