import { FC } from "react";
import { Album } from "../../types/types";
import styles from "./CollectionCover.module.scss";
import { useDispatch, useSelector } from "react-redux";
import {
  status as loadingStatus,
  selectedCollection,
  fetchAlbum,
  setItemMetadata,
  collectionType as _collectionType,
} from "../../store/reducers/selectedItemSlice";
import { AppDispatch } from "../../store/store";
import { CoverPlayButton } from "./CoverPlayButton";

interface Props {
  albumInfo: Album;
  metadata: string;
  index: number;
}

export const AlbumCover: FC<Props> = ({ albumInfo, metadata, index }) => {
  const dispatch = useDispatch<AppDispatch>();
  const collectionStatus = useSelector(loadingStatus);
  const selectedAlbum = useSelector(selectedCollection);
  const collectionType = useSelector(_collectionType);
  const selectAlbum = () => {
    if (
      ((selectedAlbum as Album).id != albumInfo.id &&
        collectionStatus == "succeeded") ||
      collectionStatus == "idle" ||
      collectionType == "not-selected"
    ) {
      dispatch(fetchAlbum({ albumId: albumInfo.id }));
      dispatch(setItemMetadata(metadata));
    }
  };

  return (
    <div
      className={
        index % 2 == 0
          ? styles.coverContainer_even
          : styles.coverContainer_uneven
      }
      onClick={() => {
        selectAlbum();
      }}
    >
      {
        <div className={styles.cover}>
          <CoverPlayButton styles={styles} albumInfo={albumInfo} />
          <img
            src={`https://${albumInfo.coverUri.replace("%%", "100x100")}`}
            alt="cover"
          />
        </div>
      }
      <div className={styles.title}>{albumInfo?.title}</div>
    </div>
  );
};
