import { FC } from "react";
import {
  Album,
  AlbumWithTracks,
  IPlaylist,
  SimilarTracks,
  Track as ITrack,
  RotorTrack,
} from "../../types/types";
import { useSelector } from "react-redux";
import { queueType as type } from "../../store/reducers/currentQueueSlice";
import { CloseButton } from "./QueueCloseButton";
interface Props {
  queueInfo:
    | AlbumWithTracks
    | IPlaylist
    | SimilarTracks
    | ITrack[]
    | RotorTrack[];
  setIsQueueDisplayed: React.Dispatch<React.SetStateAction<boolean>>;
}
export const QueueInfo: FC<Props> = ({ queueInfo, setIsQueueDisplayed }) => {
  const queueType = useSelector(type);
  return (
    <div className="infoContainer">
      <CloseButton setIsQueueDisplayed={setIsQueueDisplayed} />
      <span className="currentQueueInfo">
        <>
          <span className="defaultText">
            {queueType != "similar-tracks"
              ? "Сейчас играет: "
              : "Сейчас играет: Треки, похожие на "}
          </span>
          <span className="interactive">
            {queueType == "playlist" ? (
              (queueInfo as IPlaylist).kind == 3 ? (
                "Мне нравится"
              ) : (
                (queueInfo as IPlaylist).title
              )
            ) : queueType == "album" ? (
              (queueInfo as Album).title
            ) : queueType == "similar-tracks" ? (
              (queueInfo as SimilarTracks).track.title
            ) : (
              <></>
            )}
          </span>
        </>
      </span>
    </div>
  );
};
