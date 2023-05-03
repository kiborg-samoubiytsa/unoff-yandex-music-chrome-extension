import { FC, useEffect } from "react";
import { addTracksToFavorite } from "../../requests/addTracksToFavorite";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { IconContext } from "react-icons";
import { useDispatch, useSelector } from "react-redux";
import { trackAlbum, trackId } from "../../store/reducers/currentTrackSlice";
import {
  favoriteTrackIds,
  setFavoriteTrackIds,
} from "../../store/reducers/favoriteTracksSlice";
import { removeFromFavorite } from "../../requests/removeTrackFromFavorite";
import styles from "./PlayerLikeButton.module.scss";
import { sendRotorFeedBack } from "../../requests/rotorFeedback";

interface Props {
  isRadioMode: boolean;
  from: string;
}

export const PlayerLikeButton: FC<Props> = ({ isRadioMode, from }) => {
  const dispatch = useDispatch();
  const currentTrackId = useSelector(trackId);
  const currentTrackAlbum = useSelector(trackAlbum);
  const favoriteTracks = useSelector(favoriteTrackIds);

  const handleTrackLike = () => {
    addTracksToFavorite(currentTrackId, currentTrackAlbum);
    dispatch(
      setFavoriteTrackIds([...favoriteTracks, currentTrackId.toString()])
    );
    if (isRadioMode) {
      sendRotorFeedBack("like", from, `${currentTrackId}:${currentTrackAlbum}`);
    }
  };
  const handleTrackDislike = () => {
    removeFromFavorite(currentTrackId);
    dispatch(
      setFavoriteTrackIds(
        favoriteTracks.filter((id) => id != currentTrackId.toString())
      )
    );
  };

  return (
    <div>
      <IconContext.Provider value={{ size: "24px" }}>
        {favoriteTracks.includes(currentTrackId.toString()) ? (
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
    </div>
  );
};
