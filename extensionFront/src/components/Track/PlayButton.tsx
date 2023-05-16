import { FC, useEffect } from "react";
import { AiOutlinePause } from "react-icons/ai";
import { BiPlay } from "react-icons/bi";
import { IconContext } from "react-icons";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store/store";
import { setIsRadioMode } from "../../store/reducers/playerSlice";
import {
  setIsPlaying,
  setIndex,
  trackId,
  isTrackPlaying as isPlaying,
} from "../../store/reducers/currentTrackSlice";
import {
  AlbumWithTracks,
  IPlaylist,
  SimilarTracks,
  Track as ITrack,
} from "../../types/types";
import {
  currentQueue,
  queueType,
  setCurrentQueue,
  setQueueType,
} from "../../store/reducers/currentQueueSlice";
import { collectionType as selectedCollectionType } from "../../store/reducers/selectedItemSlice";

interface Props {
  collectionInfo?: IPlaylist | AlbumWithTracks | SimilarTracks | ITrack[];
  collectionType: "playlist" | "album" | "track" | "similar-tracks";
  index: number;
  styles: any;
  id: string | number;
}

const PlayButton: FC<Props> = ({
  index,
  styles,
  collectionInfo,
  id,
  collectionType,
}) => {
  //useDispatch
  const dispatch = useDispatch<AppDispatch>();
  //useSelectors
  const source = useSelector(currentQueue);
  const sourceType = useSelector(queueType);
  const currentTrackId = useSelector(trackId);

  const isTrackPlaying = useSelector(isPlaying);

  const handlePlay = async (e: React.MouseEvent<SVGElement, MouseEvent>) => {
    //если выбран альбом, а играет трек из плейлиста и нажимается кнопка в текущей очереди, то пиздец
    //TODO пофиксить это
    e.stopPropagation();
    const response = await chrome.runtime.sendMessage({
      state: "playing",
    });
    console.log("плеинг нажался");
    console.log(index);
    console.log("негр1");

    console.log(collectionInfo as AlbumWithTracks);
    if (currentTrackId != id) {
      dispatch(setIndex(index));
      dispatch(setIsRadioMode(false));
      dispatch(setIsPlaying(true));
    }
    if (
      sourceType != collectionType &&
      collectionType == "album" &&
      currentTrackId != id
    ) {
      dispatch(setCurrentQueue(collectionInfo as AlbumWithTracks));
      dispatch(setQueueType("album"));
      chrome?.runtime.sendMessage({
        currentQueue: collectionInfo,
        type: "album",
        offscreen: true,
      });
    }
    if (
      sourceType == collectionType &&
      collectionType == "album" &&
      (collectionInfo as AlbumWithTracks).id != (source as AlbumWithTracks).id
    ) {
      dispatch(setCurrentQueue(collectionInfo as AlbumWithTracks));
      dispatch(setQueueType("album"));
      chrome?.runtime.sendMessage({
        currentQueue: collectionInfo,
        type: "album",
        offscreen: true,
      });
    }
    if (
      sourceType == collectionType &&
      collectionType == "playlist" &&
      (collectionInfo as IPlaylist).playlistUuid !=
        (source as IPlaylist).playlistUuid
    ) {
      dispatch(setCurrentQueue(collectionInfo as IPlaylist));
      dispatch(setQueueType("playlist"));
      chrome?.runtime.sendMessage({
        currentQueue: collectionInfo,
        type: "playlist",
        offscreen: true,
      });
    }
    if (
      sourceType == collectionType &&
      collectionType == "playlist" &&
      (collectionInfo as IPlaylist).trackCount !=
        (source as IPlaylist).trackCount
    ) {
      dispatch(setCurrentQueue(collectionInfo as IPlaylist));
      dispatch(setQueueType("playlist"));
      chrome?.runtime.sendMessage({
        currentQueue: collectionInfo,
        type: "playlist",
        offscreen: true,
      });
    }
    if (
      sourceType != collectionType &&
      collectionType == "playlist" &&
      currentTrackId != id
    ) {
      dispatch(setCurrentQueue(collectionInfo as IPlaylist));
      dispatch(setQueueType("playlist"));
      chrome?.runtime.sendMessage({
        currentQueue: collectionInfo,
        type: "playlist",
        offscreen: true,
      });
    }
    if (sourceType != collectionType && collectionType == "similar-tracks") {
      dispatch(setCurrentQueue(collectionInfo as SimilarTracks));
      dispatch(setQueueType("similar-tracks"));
      chrome?.runtime.sendMessage({
        currentQueue: collectionInfo,
        type: "similar-tracks",
        offscreen: true,
      });
    }
    if (sourceType != "track" && collectionType == "track") {
      dispatch(setCurrentQueue(collectionInfo as ITrack[]));
      dispatch(setQueueType("track"));
      chrome?.runtime.sendMessage({
        currentQueue: collectionInfo,
        type: "track",
        offscreen: true,
      });
    }
    if (
      sourceType == "track" &&
      collectionType == "track" &&
      collectionInfo != source
    ) {
      console.log(collectionInfo);
      console.log(index);
      dispatch(setCurrentQueue(collectionInfo as ITrack[]));
      dispatch(setQueueType("track"));
    }
    if (
      collectionType == "playlist" &&
      (collectionInfo as IPlaylist)?.playlistUuid !=
        (source as IPlaylist).playlistUuid
    ) {
      dispatch(setCurrentQueue(collectionInfo as IPlaylist));
      dispatch(setQueueType("playlist"));
    } else {
      dispatch(setIsPlaying(true));
    }
  };
  const handlePause = async (e: React.MouseEvent<SVGElement, MouseEvent>) => {
    e.stopPropagation();
    dispatch(setIsPlaying(false));
    const response = await chrome.runtime.sendMessage({
      state: "paused",
    });
    console.log("плеинг нажался");
  };

  return (
    <div className={styles.controlButtonContainer}>
      <IconContext.Provider value={{ size: "24px" }}>
        {id != currentTrackId || (id == currentTrackId && !isTrackPlaying) ? (
          <BiPlay
            onClick={(e) => handlePlay(e)}
            className={styles.playButton}
          />
        ) : (
          <div>
            <AiOutlinePause
              onClick={(e) => handlePause(e)}
              className={styles.pauseButton}
            />
            <div className={styles.playingTrackAnimationContainer}>
              <div className={styles.playingTrackAnimation}></div>
            </div>
          </div>
        )}
      </IconContext.Provider>
    </div>
  );
};

export default PlayButton;
