import { FC } from "react";
import { AlbumWithTracks, IPlaylist } from "../../types/types";
import { useSelector } from "react-redux";
import {
  status as loadingStatus,
  selectedCollection,
  isCollectionSelected,
  collectionType as type,
} from "../../store/reducers/selectedItemSlice";
import { favoriteTrackStatus } from "../../store/reducers/favoriteTracksSlice";
import "./Sidebar.scss";
import { PlaylistSidebar } from "./TrackQueueSidebar/PlaylistSidebar";
import { AlbumSidebar } from "./TrackQueueSidebar/AlbumSidebar";

export const TracksSidebar: FC = () => {
  const collectionLoadingStatus = useSelector(loadingStatus);
  const source = useSelector(selectedCollection);
  const collectionType = useSelector(type);
  const isPlaylistSelected = useSelector(isCollectionSelected);
  const favoriteLoadingStatus = useSelector(favoriteTrackStatus);

  return (
    <>
      {isPlaylistSelected ? (
        collectionLoadingStatus == "succeeded" &&
        favoriteLoadingStatus == "succeeded" ? (
          collectionType == "playlist" ? (
            <PlaylistSidebar playlist={source as IPlaylist} />
          ) : collectionType == "album" ? (
            <AlbumSidebar album={source as AlbumWithTracks} />
          ) : (
            <></>
          )
        ) : (
          <></>
        )
      ) : (
        <></>
      )}
    </>
  );
};
