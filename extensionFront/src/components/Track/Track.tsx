import { FC } from "react";
import PlayButton from "./PlayButton";
import Title from "./Title";
import {
  AlbumWithTracks,
  IArtist,
  IPlaylist,
  SimilarTracks,
  Track as ITrack,
} from "../../types/types";
import Artist from "./Artist";
import Duration from "./Duration";
import { TrackCover } from "./TrackCover";
import { LikeButton } from "./LikeButton";
import { useSelector } from "react-redux";
import {
  isTrackPlaying as isPlaying,
  trackId,
} from "../../store/reducers/currentTrackSlice";

interface Props {
  id: number | string;
  albumId: number;
  title: string;
  index: number;
  artists?: IArtist[];
  duration: number;
  collectionType: "playlist" | "album" | "track" | "similar-tracks";
  styles: any;
  collection?: IPlaylist | AlbumWithTracks | SimilarTracks | ITrack[];
  trackCover?: string;
}

const Track: FC<Props> = ({
  title,
  index,
  artists,
  albumId,
  duration,
  styles,
  collection,
  id,
  trackCover,
  collectionType,
}) => {
  const isTrackPlaying = useSelector(isPlaying);
  const currentTrackId = useSelector(trackId);
  return (
    <>
      <div className={styles.track}>
        <PlayButton
          index={index}
          styles={styles}
          collectionInfo={collection}
          id={id}
          collectionType={collectionType}
        />
        {isTrackPlaying && id == currentTrackId ? (
          <> </>
        ) : (
          <span className={styles.index}>{index + 1}</span>
        )}
        {trackCover ? (
          <TrackCover imageUrl={trackCover} styles={styles} />
        ) : (
          <></>
        )}
        <div className={styles.trackInfo}>
          <Title title={title} styles={styles}></Title>
          {artists ? (
            <Artist artists={artists} styles={styles}></Artist>
          ) : (
            <></>
          )}
        </div>
        <LikeButton id={id} styles={styles} album={albumId} />
        <Duration duration={duration} styles={styles}></Duration>
      </div>
    </>
  );
};

export default Track;
