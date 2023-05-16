import { useState } from "react";
import { useSelector } from "react-redux";
import { concatArtistNames } from "../../helpers/concatArtistNames";
import {
  selectedCollection,
  status,
} from "../../store/reducers/selectedItemSlice";
import { FullTrackInfo } from "../../types/types";
import "./Sidebar.scss";
import Track from "../Track/Track";
import trackStyles from "../Track/SidebarTrack.module.scss";
import CloseButton from "./CloseButton";

export const SingleTrackSidebar = () => {
  const trackLoadingStatus = useSelector(status);
  const trackInfo = useSelector(selectedCollection) as FullTrackInfo;
  const [displayFullLyrics, setDisplayFullLyrics] = useState<boolean>(false);

  //web-own_playlists-playlist-similar_track-fridge
  return (
    <>
      {trackLoadingStatus == "succeeded" ? (
        <div className="playlist">
          <span className="defaultText">ТРЕК</span>
          <div className="sidebar_collectionTitle">
            {trackInfo.similar.track.title}
          </div>
          <div className="sidebar_collectionOwner">
            {concatArtistNames(trackInfo.similar.track.artists)}
          </div>
          {trackInfo.supplement.lyrics?.lyrics ? (
            <>
              {displayFullLyrics ? (
                <div className="sidebar_trackLyrics">
                  {trackInfo.supplement.lyrics.fullLyrics}
                  <div className="sidebar_trackLyricsOverlay-hidden"></div>
                </div>
              ) : (
                <>
                  <div className="sidebar_trackLyrics">
                    {trackInfo.supplement.lyrics.lyrics}
                    <div className="sidebar_trackLyricsOverlay"></div>
                    <span
                      className="sidebar_showtextButton defaultText interactive"
                      onClick={() => {
                        setDisplayFullLyrics(true);
                      }}
                    >
                      Показать текст
                    </span>
                  </div>
                </>
              )}
            </>
          ) : (
            <></>
          )}
          {trackInfo.similar.similarTracks.length > 0 ? (
            <div className="sidebar_tracks">
              <span className="defaultText">ПОХОЖИЕ ТРЕКИ</span>
              {trackInfo.similar.similarTracks.map((track, index) => (
                <Track
                  showCover={false}
                  index={index}
                  key={index}
                  styles={trackStyles}
                  track={track}
                  collection={trackInfo.similar}
                  collectionType="similar-tracks"
                ></Track>
              ))}
            </div>
          ) : (
            <></>
          )}
          <CloseButton />
        </div>
      ) : (
        <></>
      )}
    </>
  );
};
