import { FC } from "react";
import "./CurrentQueue.scss";
import { useSelector } from "react-redux";
import {
  currentQueue as queue,
  queueType as type,
} from "../../store/reducers/currentQueueSlice";
import { AlbumWithTracks, IPlaylist, SimilarTracks } from "../../types/types";
import { QueueInfo } from "./QueueInfo";
import { PlaylistQueue } from "./QueueTypes/PlaylistQueue";
import { AlbumQueue } from "./QueueTypes/AlbumQueue";
import { TracksQueue } from "./QueueTypes/TracksQueue";

interface Props {
  setIsQueueDisplayed: React.Dispatch<React.SetStateAction<boolean>>;
}

const CurrentQueuePage: FC<Props> = ({ setIsQueueDisplayed }) => {
  const currentQueue = useSelector(queue);
  const queueType = useSelector(type);
  return (
    <div className="currentQueueContainer">
      <div className="currentQueue">
        <QueueInfo
          queueInfo={currentQueue}
          setIsQueueDisplayed={setIsQueueDisplayed}
        />
        <div className="playlist">
          {queueType == "playlist" ? (
            <PlaylistQueue currentQueue={currentQueue as Required<IPlaylist>} />
          ) : queueType == "album" ? (
            <AlbumQueue currentQueue={currentQueue as AlbumWithTracks} />
          ) : queueType == "track" || queueType == "similar-tracks" ? (
            <TracksQueue
              currentQueue={(currentQueue as SimilarTracks).similarTracks}
            />
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
};

export default CurrentQueuePage;
