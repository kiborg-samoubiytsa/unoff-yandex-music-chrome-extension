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

interface Props {
  id: number | string;
  styles: any;
  album: number;
}

export const LikeButton: FC<Props> = ({ id, album, styles }) => {
  const dispatch = useDispatch();
  const favoriteTracks = useSelector(favoriteTrackIds);

  const handleTrackLike = () => {
    addTracksToFavorite(id, album);
    dispatch(setFavoriteTrackIds([...favoriteTracks, id.toString()]));
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
