import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  currentQueue,
  queueType as currentQueueType,
} from "../store/reducers/currentQueueSlice";
import {
  setCurrentTrackId,
  setCurrentTrackAlbum,
  trackStatus,
  selectIndex,
} from "../store/reducers/currentTrackSlice";
import { isInRadioMode } from "../store/reducers/playerSlice";
import { rotorQueue as radioQueue } from "../store/reducers/rotorSlice";
import { setItemMetadata } from "../store/reducers/selectedItemSlice";
import {
  IPlaylist,
  AlbumWithTracks,
  SimilarTracks,
  PlaylistTrack,
} from "../types/types";

export const useCurrentTrack = () => {
  const dispatch = useDispatch();
  const sourceQueue = useSelector(currentQueue);
  const isRadioMode = useSelector(isInRadioMode);
  const rotorQueue = useSelector(radioQueue);
  const trackLoadingStatus = useSelector(trackStatus);
  const queueType = useSelector(currentQueueType);
  const index = useSelector(selectIndex);

  const tracksArray =
    queueType == "playlist"
      ? (sourceQueue as IPlaylist).tracks
      : queueType == "album"
      ? (sourceQueue as AlbumWithTracks).volumes?.flat()
      : queueType == "similar-tracks"
      ? (sourceQueue as SimilarTracks).similarTracks
      : [];

  const radioIdArray = rotorQueue.map((track: any) => {
    return track.track.id;
  });

  useEffect(() => {
    //starts playing track if its index is different
    if (isRadioMode && rotorQueue) {
      dispatch(setItemMetadata("web-radio-playlist-autoflow"));
    }
    if (trackLoadingStatus == "succeeded") {
      if (!isRadioMode && queueType == "playlist" && tracksArray) {
        dispatch(setCurrentTrackId(tracksArray[index || 0].id));
        dispatch(
          setCurrentTrackAlbum(
            (tracksArray as PlaylistTrack[])![index || 0].track.albums[0].id
          )
        );
      } else if (
        !isRadioMode &&
        (queueType == "album" || queueType == "similar-tracks") &&
        tracksArray
      ) {
        dispatch(setCurrentTrackId(tracksArray![index || 0].id));
        dispatch(setCurrentTrackAlbum((sourceQueue as AlbumWithTracks).id));
      } else if (radioIdArray && isRadioMode) {
        dispatch(setCurrentTrackId(radioIdArray[index || 0]));
        dispatch(
          setCurrentTrackAlbum(rotorQueue![index || 0].track.albums[0].id)
        );
      }
    }
  }, [index, trackLoadingStatus, queueType]);
};
