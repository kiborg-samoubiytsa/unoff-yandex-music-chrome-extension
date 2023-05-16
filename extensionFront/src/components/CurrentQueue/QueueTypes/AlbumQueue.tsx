import { FC } from "react";
import { AlbumWithTracks } from "../../../types/types";
import Track from "../../Track/Track";
import { Track as ITrack } from "../../../types/types";
import trackStyles from "../../Track/PageTrack.module.scss";

interface Props {
  currentQueue: AlbumWithTracks;
}

export const AlbumQueue: FC<Props> = ({ currentQueue }) => {
  return (
    <div className="tracks">
      {currentQueue.volumes
        .flat()
        .map((track: ITrack, index: number) =>
          track.availableForPremiumUsers ? (
            <Track
              showCover={true}
              track={track}
              collection={currentQueue}
              index={index}
              key={index}
              styles={trackStyles}
              collectionType="album"
            ></Track>
          ) : (
            <div key={index}></div>
          )
        )}
    </div>
  );
};
