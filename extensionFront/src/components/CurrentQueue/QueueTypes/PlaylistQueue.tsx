import { FC } from "react";
import { IPlaylist, PlaylistTrack } from "../../../types/types";
import Track from "../../Track/Track";
import trackStyles from "../../Track/PageTrack.module.scss";

interface Props {
  currentQueue: Required<IPlaylist>;
}

export const PlaylistQueue: FC<Props> = ({ currentQueue }) => {
  return (
    <div className="tracks">
      {currentQueue.tracks.map((track: PlaylistTrack, index: number) =>
        track.track.availableForPremiumUsers ? (
          <Track
            title={track.track.title}
            id={track.track.id}
            trackCover={`https://${track.track.ogImage!.replace(
              "%%",
              "50x50"
            )}`}
            collection={currentQueue}
            index={index}
            key={index}
            artists={track.track.artists}
            duration={track.track.durationMs}
            styles={trackStyles}
            albumId={track.track.albums[0].id}
            collectionType="playlist"
          ></Track>
        ) : (
          <div key={index}></div>
        )
      )}
    </div>
  );
};
