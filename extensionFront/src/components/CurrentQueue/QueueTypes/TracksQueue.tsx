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
            showCover={true}
            index={index}
            key={index}
            track={track}
            styles={trackStyles}
            collectionType="track"
          ></Track>
        ) : (
          <div key={index}></div>
        )
      )}
    </div>
  );
};
