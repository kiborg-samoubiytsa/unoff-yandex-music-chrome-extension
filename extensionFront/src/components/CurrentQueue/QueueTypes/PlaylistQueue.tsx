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
      {currentQueue.tracks.map((track: PlaylistTrack, index: number) => (
        <Track
          showCover={true}
          collection={currentQueue}
          index={index}
          styles={trackStyles}
          track={track}
          collectionType="playlist"
        ></Track>
      ))}
    </div>
  );
};
