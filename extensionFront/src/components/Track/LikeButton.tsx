import { FC } from "react";
import { IconContext } from "react-icons";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { addTracksToFavorite } from "../../requests/addTracksToFavorite";
import { removeFromFavorite } from "../../requests/removeTrackFromFavorite";
import {
  favoriteTrackIds,
  setFavoriteTrackIds,
} from "../../store/reducers/favoriteTracksSlice";
import { IPlaylist, PlaylistTrack, Track } from "../../types/types";
import {
  currentQueue,
  queueType as _queueType,
} from "../../store/reducers/currentQueueSlice";
import { selectedCollection } from "../../store/reducers/selectedItemSlice";

interface Props {
  id: number | string;
  styles: any;
  album: number;
  track: Track | PlaylistTrack;
  trackRef: React.MutableRefObject<undefined>;
}

export const LikeButton: FC<Props> = ({
  id,
  album,
  styles,
  track,
  trackRef,
}) => {
  const dispatch = useDispatch();
  const favoriteTracks = useSelector(favoriteTrackIds);
  const sourceQueue = useSelector(currentQueue);
  const queueType = useSelector(_queueType);

  const handleTrackLike = () => {
    addTracksToFavorite(id, album);
    dispatch(setFavoriteTrackIds([...favoriteTracks, id.toString()]));
    console.log({
      ...sourceQueue,
      tracks: [track as PlaylistTrack, ...(sourceQueue as IPlaylist).tracks],
    });
    /*     if (queueType == "playlist" && (sourceQueue as IPlaylist).kind == 3) {
      dispatch(
        setCurrentQueue({
          ...sourceQueue,
          tracks: [
            track as PlaylistTrack,
            ...(sourceQueue as IPlaylist).tracks,
          ],
        })
      );
    } */
  };
  const handleTrackDislike = () => {
    removeFromFavorite(id);
    dispatch(
      setFavoriteTrackIds(
        favoriteTracks.filter((trackId) => trackId != id.toString())
      )
    );
  };
  return (
    <IconContext.Provider value={{ size: "20px" }}>
      {favoriteTracks.includes(id.toString()) ? (
        <AiFillHeart
          onClick={handleTrackDislike}
          className={styles.likeButton_active}
        />
      ) : (
        <AiOutlineHeart
          onClick={handleTrackLike}
          className={styles.likeButton}
        />
      )}
    </IconContext.Provider>
  );
};
