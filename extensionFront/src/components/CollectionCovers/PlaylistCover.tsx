import { FC } from "react";
import { IPlaylist } from "../../types/types";
import styles from "./CollectionCover.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store/store";
import {
  fetchPlaylist,
  status as playlistStatus,
  selectedCollection as source,
  setItemMetadata,
  collectionType as _collectionType,
} from "../../store/reducers/selectedItemSlice";
import { CoverPlayButton } from "./CoverPlayButton";
import { Link } from "react-router-dom";
import { covers } from "../../img/coverStocks/allDefaultCovers";

interface Props {
  playlistInfo: IPlaylist | undefined;
  metadata: string;
  index: number;
}

export const PlaylistCover: FC<Props> = ({ playlistInfo, metadata, index }) => {
  const dispatch = useDispatch<AppDispatch>();
  const collectionStatus = useSelector(playlistStatus);
  const selectedPlaylist = useSelector(source);
  const collectionType = useSelector(_collectionType);
  const handlePlaylistSelect = () => {
    if (
      (collectionStatus == "succeeded" &&
        playlistInfo!.playlistUuid !=
          (selectedPlaylist as IPlaylist).playlistUuid) ||
      collectionStatus == "idle" ||
      collectionType == "not-selected"
    ) {
      dispatch(
        fetchPlaylist({
          user: playlistInfo?.owner.login,
          kind: playlistInfo?.kind,
        })
      );
      dispatch(setItemMetadata(metadata));
    }
    return;
  };

  return (
    <div
      className={
        index % 2 == 0
          ? styles.coverContainer_even
          : styles.coverContainer_uneven
      }
      onClick={handlePlaylistSelect}
    >
      <div className={styles.cover}>
        <>
          <CoverPlayButton playlistInfo={playlistInfo} styles={styles} />
          {playlistInfo?.cover.itemsUri?.length &&
          playlistInfo.cover.type == "mosaic" ? (
            playlistInfo?.cover.itemsUri?.length >= 4 ? (
              <div className={styles.coverGrid}>
                {playlistInfo?.cover.itemsUri?.map((item, index) => (
                  <img
                    key={index}
                    src={`https://${item.replace("%%", "50x50")}`}
                    alt="cover"
                  />
                ))}
              </div>
            ) : (
              <img
                src={`https://${playlistInfo?.cover.itemsUri[0].replace(
                  "%%",
                  "100x100"
                )}`}
                alt="cover"
              ></img>
            )
          ) : playlistInfo?.cover.uri ? (
            <img
              src={`https://${playlistInfo?.cover.uri.replace(
                "%%",
                "100x100"
              )}`}
              alt="cover"
            ></img>
          ) : (
            <img
              src={covers[Math.floor(Math.random() * covers.length)]}
              alt="cover"
            ></img>
          )}
        </>
      </div>
      {/* <Link
        className={styles.title}
        to={`/users/${playlistInfo?.owner.uid}/playlists/${playlistInfo?.kind}`}
      >
        {playlistInfo?.title}
      </Link> */}
      <div className={styles.title}>{playlistInfo?.title}</div>
    </div>
  );
};
