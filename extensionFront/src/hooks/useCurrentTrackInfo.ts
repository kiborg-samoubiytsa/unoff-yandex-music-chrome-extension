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
  Track,
  RotorTrack,
} from "../types/types";

export const useCurrentTrack = () => {};
