import { FC } from "react";
import { useSelector } from "react-redux";
import { currentQueue } from "../../../store/reducers/currentQueueSlice";
import { Track as ITrack } from "../../../types/types";
import Track from "../../Track/Track";
import trackStyles from "../../Track/PageTrack.module.scss";

interface Props {
  currentQueue: ITrack[];
}

export const TracksQueue: FC<Props> = ({ currentQueue }) => {
  return (
    <div className="tracks">
      {currentQueue.map((track, index: number) =>
        track.availableForPremiumUsers ? (
          <Track
            title={track.title}
            id={track.id}
            trackCover={`https://${track.ogImage!.replace("%%", "50x50")}`}
            index={index}
            key={index}
            artists={track.artists}
            duration={track.durationMs}
            styles={trackStyles}
            albumId={track.albums[0].id}
            collectionType="track"
          ></Track>
        ) : (
          <div key={index}></div>
        )
      )}
    </div>
  );
};
