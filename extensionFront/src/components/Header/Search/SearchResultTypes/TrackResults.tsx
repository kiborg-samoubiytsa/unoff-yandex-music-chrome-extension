import { FC } from "react";
import { Track as ITrack } from "../../../../types/types";
import Track from "../../../Track/Track";
import styles from "../../../Track/SidebarTrack.module.scss";

interface Props {
  trackArray: ITrack[];
}

export const TrackResults: FC<Props> = ({ trackArray }) => {
  return (
    <div className="search_results_tracks">
      <div className="search_results_tracks_text">
        <span className="defaultText">Треки</span>
      </div>
      {trackArray.map((track, index) => (
        <Track
          key={index}
          id={track.id}
          albumId={track.albums[0].id}
          title={track.title}
          index={index}
          duration={track.durationMs}
          collectionType="track"
          styles={styles}
          artists={track.artists}
          collection={trackArray}
        />
      ))}
    </div>
  );
};
