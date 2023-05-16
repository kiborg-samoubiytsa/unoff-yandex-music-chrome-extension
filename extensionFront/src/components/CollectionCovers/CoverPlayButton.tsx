import { useEffect, FC } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  isTrackPlaying,
  setIndex,
  setIsPlaying,
} from "../../store/reducers/currentTrackSlice";
import {
  currentQueue as queue,
  queueType as type,
  setCurrentQueue,
  setQueueType,
} from "../../store/reducers/currentQueueSlice";
import { Album, AlbumWithTracks, IPlaylist } from "../../types/types";
import { getQueueFromCollection } from "../../requests/getTrackFromCollection";
import { BiPause, BiPlay } from "react-icons/bi";
import { IconContext } from "react-icons";
import { setIsRadioMode } from "../../store/reducers/playerSlice";

interface Props {
  playlistInfo?: IPlaylist;
  albumInfo?: Album;
  styles: any;
}

export const CoverPlayButton: FC<Props> = ({
  playlistInfo,
  albumInfo,
  styles,
}) => {
  const dispatch = useDispatch();

  const currentQueue = useSelector(queue);

  const isPlaying = useSelector(isTrackPlaying);

  const queueType = useSelector(type);

  const handlePlaylistPlayStart = async () => {
    if (playlistInfo) {
      if (playlistInfo.kind == (currentQueue as IPlaylist).kind) {
        await chrome.runtime.sendMessage({
          state: "playing",
        });
        console.log("плеинг нажался");
        dispatch(setIsPlaying(true));
      } else {
        const trackQueue = await getQueueFromCollection(
          "playlist",
          playlistInfo
        );
        console.log(trackQueue);
        dispatch(setIsRadioMode(false));
        dispatch(setQueueType("playlist"));
        dispatch(setCurrentQueue(trackQueue));
        dispatch(setIndex(0));
        dispatch(setIsPlaying(true));
        await chrome.runtime.sendMessage({
          state: "playing",
        });
        console.log("плеинг нажался");
      }
    }
    if (albumInfo) {
      if (albumInfo.id == (currentQueue as AlbumWithTracks).id) {
        dispatch(setIsPlaying(true));
        await chrome.runtime.sendMessage({
          state: "playing",
        });
        console.log("плеинг нажался");
      } else {
        const trackQueue = await getQueueFromCollection("album", albumInfo);
        dispatch(setQueueType("album"));
        dispatch(setCurrentQueue(trackQueue));
        dispatch(setIndex(0));
        dispatch(setIsPlaying(true));
        dispatch(setIsRadioMode(false));
        (async () => {
          await chrome.runtime.sendMessage({
            state: "playing",
          });
          console.log("плеинг нажался");
        })();
      }
    }
  };
  const handlePlaylistPause = () => {
    (async () => {
      await chrome.runtime.sendMessage({
        state: "paused",
      });
      console.log("плеинг нажался");
    })();
    dispatch(setIsPlaying(false));
  };
  return (
    <div className={styles.coverPlayButtonContainer}>
      <IconContext.Provider value={{ size: "24px" }}>
        {isPlaying &&
        ((albumInfo?.id &&
          (currentQueue as AlbumWithTracks)?.id == albumInfo?.id) ||
          (playlistInfo?.kind &&
            (currentQueue as IPlaylist)?.kind == playlistInfo?.kind)) ? (
          <BiPause
            onClick={handlePlaylistPause}
            className={styles.coverPlayButton}
          />
        ) : (
          <BiPlay
            onClick={handlePlaylistPlayStart}
            className={styles.coverPlayButton}
          />
        )}
      </IconContext.Provider>
    </div>
  );
};
