import { FC, useRef } from "react";
import PlayButton from "./PlayButton";
import Title from "./Title";
import {
  AlbumWithTracks,
  IPlaylist,
  SimilarTracks,
  Track as ITrack,
  PlaylistTrack,
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
  showCover: boolean;
  track: ITrack | PlaylistTrack;
  index: number;
  collectionType: "playlist" | "album" | "track" | "similar-tracks";
  styles: any;
  collection?: IPlaylist | AlbumWithTracks | SimilarTracks | ITrack[];
}

const Track: FC<Props> = ({
  track,
  index,
  styles,
  collection,
  collectionType,
  showCover,
}) => {
  const trackRef = useRef();
  const isTrackPlaying = useSelector(isPlaying);
  const currentTrackId = useSelector(trackId);

  const {
    title,
    artists,
    durationMs,
    albums,
    coverUri: trackCover,
    id,
    available,
  } = collectionType == "playlist"
    ? (track as PlaylistTrack).track
    : (track as ITrack);

  return (
    <>
      {available ? (
        <div className={styles.track} ref={trackRef}>
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
          {showCover ? (
            <TrackCover
              imageUrl={`https://${trackCover!.replace("%%", "50x50")}`}
              styles={styles}
            />
          ) : (
            <></>
          )}
          <div className={styles.trackInfo}>
            <Title title={title} styles={styles}></Title>
            <Artist artists={artists} styles={styles}></Artist>
          </div>
          <LikeButton
            track={track}
            id={id}
            styles={styles}
            album={
              albums[0].id
            } /* gets first album's id its needed for addToFavoriteRequest */
            trackRef={trackRef.current}
          />
          <Duration duration={durationMs} styles={styles}></Duration>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default Track;
