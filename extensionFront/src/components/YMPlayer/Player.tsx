import { FC, useEffect, useRef, useState, useLayoutEffect } from "react";
import {
  setIsPlaying,
  setIndex,
  trackUrl,
  trackArtists,
  trackCover,
  trackTitle,
  setTrackStatus,
  _trackCurrentDuration,
  setCurrentTrackProgress,
} from "../../store/reducers/currentTrackSlice";
import { useSelector, useDispatch } from "react-redux";
import { IconContext } from "react-icons";
import { AiOutlinePause, AiOutlineUnorderedList } from "react-icons/ai";
import { BiPlay, BiSkipNext, BiSkipPrevious } from "react-icons/bi";
import { FaTheaterMasks } from "react-icons/fa";
import styles from "./Player.module.scss";
import { durationToMinutes } from "../../helpers/durationToMinutes";
import { concatArtistNames } from "../../helpers/concatArtistNames";
import {
  PlaylistTrack,
  IPlaylist,
  AlbumWithTracks,
  Track,
  SimilarTracks,
  RotorTrack,
} from "../../types/types";
import {
  selectIsPlaying,
  selectIndex,
} from "../../store/reducers/currentTrackSlice";
import { setIsRadioMode } from "../../store/reducers/playerSlice";
import { AppDispatch, RootState } from "../../store/store";
import { startAudioRequest } from "../../requests/startAudioRequest";
import { endAudioRequest } from "../../requests/endAudioRequest";
import { generatePlayId } from "../../helpers/generatePlayId";
import {
  setCurrentTrackId,
  fetchTrackUrl,
  _trackDuration,
  setCurrentTrackDuration,
} from "../../store/reducers/currentTrackSlice";
import {
  fetchRotorQueue,
  fetchRotorSettings,
  rotorQueueStatus,
  rotorSettings as _rotorSettings,
} from "../../store/reducers/rotorSlice";
import { sendRotorFeedBack } from "../../requests/rotorFeedback";
import { RotorSettings } from "./RotorSettings";
import { PlayerLikeButton } from "./PlayerLikeButton";
import {
  queueType as type,
  setCurrentQueue,
  setQueueType,
} from "../../store/reducers/currentQueueSlice";
import {
  selectedItemMeta,
  setItemMetadata,
  setSelectedItemType,
} from "../../store/reducers/selectedItemSlice";

interface Props {
  setIsQueueDisplayed: React.Dispatch<React.SetStateAction<boolean>>;
  isQueueDisplayed: boolean;
}
const Player: FC<Props> = ({ setIsQueueDisplayed, isQueueDisplayed }) => {
  //useStates

  const [volume, setVolume] = useState<number>(
    localStorage.getItem("user-volume")
      ? JSON.parse(localStorage.getItem("user-volume") || "1")
      : 1
  ); //actual volume level
  const [isTimeBeingChanged, setIsTimeBeingChanged] = useState<boolean>(false); //state that sets to true when user drags or clicks range with duration. used to prevent bug when change of progress overwrites value, that is being input by user
  const [isReplayTrack, setIsReplayTrack] = useState<boolean>(false); //state that is used
  const [isReplayPlaylist, setIsReplayPlaylist] = useState<boolean>(false);
  const [displayTimeBar, setDisplayTimeBar] = useState<boolean>(false); //state that is used to control visibility of popup with time user will set track to when clicks
  const [cursorX, setCursorX] = useState<number>(0);
  const [displayRotorSettings, setDisplayRotorSettings] =
    useState<boolean>(false); //if true, displays user mood settings for reccoendations
  const [imageLoadingStatus, setImageLoadingStatus] = useState<
    "idle" | "loading" | "succeeded" | "error"
  >("idle");
  //useRefs

  const radioTrackEndReason = useRef<"trackFinished" | "skip">("trackFinished");
  const audioTimeRef = useRef<number>(
    localStorage.getItem("lastPlayerState")
      ? JSON.parse(localStorage.getItem("lastPlayerState")).localCurrentDuration
      : 0
  ); //refers to time has been played
  const timeRangeRef = useRef<HTMLInputElement>(null);
  const volumeRangeRef = useRef<HTMLInputElement>(null); //value for sound, used for display
  const isQueuePresent = useRef<boolean>(false);
  const playIdRef = useRef<string>(generatePlayId());
  const isFirstTrackRender = useRef<boolean>(true);

  //useSelectors

  const sourceQueue = useSelector(
    (state: RootState) => state.currentQueueSlice.currentQueue
  );

  const queueType = useSelector(type);

  const index = useSelector(selectIndex);

  const isPlaying = useSelector(selectIsPlaying);

  const tracksArrayRef = useRef(
    queueType == "playlist"
      ? (sourceQueue as IPlaylist).tracks
      : queueType == "album"
      ? (sourceQueue as AlbumWithTracks).volumes.flat()
      : queueType == "similar-tracks"
      ? (sourceQueue as SimilarTracks).similarTracks
      : queueType == "track"
      ? (sourceQueue as Track[])
      : queueType == "rotor-track"
      ? (sourceQueue as RotorTrack[])
      : []
  );

  const trackLoadingStatus = useSelector(
    (state: RootState) => state.currentTrack.status
  );
  const isRadioMode = useSelector(
    (state: RootState) => state.playerSlice.isInRadioMode
  );
  const metadata = useSelector(selectedItemMeta);

  const trackProgress = useSelector(_trackCurrentDuration);

  const trackDuration = useSelector(_trackDuration);

  const currentTrackId = useSelector(
    (state: RootState) => state.currentTrack.currentTrackId
  );

  const currentTrackAlbumId = useSelector(
    (state: RootState) => state.currentTrack.currentTrackAlbumId
  );

  const rotorStatus = useSelector(rotorQueueStatus);

  const src = useSelector(trackUrl);

  const title = useSelector(trackTitle);
  const cover = useSelector(trackCover);
  const artists = useSelector(trackArtists);

  const rotorSettings = useSelector(_rotorSettings);

  useLayoutEffect(() => {
    chrome?.runtime.onMessage.addListener((msg) => {
      if (msg.duration) {
        dispatch(setCurrentTrackDuration(msg.duration));
        dispatch(setTrackStatus("playing"));
      }
      /* if (msg.index || msg.index == 0) {
        dispatch(setIndex(msg.index));
      } */
      if (msg.currentTime || msg.currentTime == 0) {
        dispatch(setCurrentTrackProgress(msg.currentTime));
        audioTimeRef.current = msg.currentTime;
      }
      if (msg.track_ended) {
        console.log("член");
        if (index || index == 0) {
          console.log(index);
          if (
            !isReplayTrack &&
            index < tracksArrayRef.current!.length - 1 &&
            !isRadioMode
          ) {
            console.log("негрик");
            handleSkipNextPlaylist();
          } else if (isReplayTrack) {
            dispatch(setIndex(index || 0));
          }
          if (
            !isReplayPlaylist &&
            index >= tracksArrayRef.current!.length - 1 &&
            !isReplayTrack
          ) {
            /* dispatch(setIsRadioMode(true));
            dispatch(setIndex(0));
            dispatch(fetchRotorSettings());
            sendRotorFeedBack("radioStarted", "web-radio-playlist-autoflow"); */
          }
          if (
            !isReplayTrack &&
            index <= tracksArrayRef.current.length - 1 &&
            isRadioMode
          ) {
            handleSkipNextRadio("trackFinished");
          }
        } else {
          console.log(index);
        }
      }
      if (msg.rotorMode) {
        console.log("негры");
        const { localSourceQueue } = localStorage.getItem("lastPlayerState")
          ? JSON.parse(localStorage.getItem("lastPlayerState"))
          : [];
        dispatch(setIndex(0));
        tracksArrayRef.current = localSourceQueue;
        dispatch(setCurrentQueue(localSourceQueue));
        dispatch(setIsRadioMode(true));
        dispatch(setQueueType("rotor-track"));
      }
    });

    window.addEventListener("unload", () => {
      localStorage.setItem(
        "lastPlayerState",
        JSON.stringify({
          ...JSON.parse(localStorage.getItem("lastPlayerState") as string), //sets
          localCurrentDuration: audioTimeRef.current,
        })
      );
    });

    return () => {
      window.addEventListener("unload", () => {
        localStorage.setItem(
          "lastPlayerState",
          JSON.stringify({
            ...JSON.parse(localStorage.getItem("lastPlayerState") as string),
            localCurrentDuration: audioTimeRef.current,
          })
        );
      });
    };
  }, []);

  useEffect(() => {
    console.log(trackLoadingStatus);
  }, [trackLoadingStatus]);

  useEffect(() => {
    console.log(tracksArrayRef.current);
  }, []);
  useEffect(() => {
    tracksArrayRef.current =
      queueType == "playlist"
        ? (sourceQueue as IPlaylist).tracks
        : queueType == "album"
        ? (sourceQueue as AlbumWithTracks).volumes.flat()
        : queueType == "similar-tracks"
        ? (sourceQueue as SimilarTracks).similarTracks
        : queueType == "track"
        ? (sourceQueue as Track[])
        : queueType == "rotor-track"
        ? (sourceQueue as RotorTrack[])
        : [];
    console.log(sourceQueue);
  }, [sourceQueue]);
  useEffect(() => {
    console.log(index);
  }, [index]);
  useEffect(() => {
    if (trackLoadingStatus == "succeeded") {
      handleStartPlaying();
    }
  }, [index, trackLoadingStatus]);

  useEffect(() => {
    console.log(trackLoadingStatus);
    if (trackLoadingStatus == "playing") {
      console.log("негрик");
      localStorage.setItem(
        "lastPlayerState",
        JSON.stringify({
          localTitle: title,
          localCover: cover,
          localArtists: artists,
          localCurrentTrackId: currentTrackId,
          localSourceQueue: sourceQueue,
          localQueueType: queueType,
          localMetadata: metadata,
          localIsRadioMode: isRadioMode,
          localIndex: index,
          localCurrentTrackAlbumId: currentTrackAlbumId,
          localRotorStatus: rotorStatus,
          localMaxDuration: trackDuration,
          localSrc: src,
          localIsPlaying: isPlaying,
          localPlayId: playIdRef.current,
        })
      );
    }
    return () => {
      console.log(audioTimeRef.current);
    };
  }, [trackDuration, currentTrackId, trackLoadingStatus]);

  useEffect(() => {
    return () => {
      if (isQueuePresent.current) {
        if (!isRadioMode && queueType == "playlist" && tracksArrayRef.current) {
          endAudioRequest(
            (tracksArrayRef.current as PlaylistTrack[])[index || 0].track,
            audioTimeRef.current,
            playIdRef.current,
            metadata,
            (tracksArrayRef.current as PlaylistTrack[])[index || 0].track
              .albums[0],
            sourceQueue as IPlaylist
          );
        }
        if (
          !isRadioMode &&
          (queueType == "album" || queueType == "similar-tracks") &&
          tracksArrayRef.current
        ) {
          endAudioRequest(
            (tracksArrayRef.current as Track[])[index || 0],
            audioTimeRef.current,
            playIdRef.current,
            metadata,
            sourceQueue as AlbumWithTracks
          );
        }
        if (!isRadioMode && queueType == "track" && tracksArrayRef.current) {
          endAudioRequest(
            (tracksArrayRef.current as Track[])[index || 0],
            audioTimeRef.current,
            playIdRef.current,
            metadata,
            sourceQueue as AlbumWithTracks
          );
        }
        if (isRadioMode) {
          endAudioRequest(
            (tracksArrayRef.current[index] as RotorTrack).track,
            audioTimeRef.current,
            playIdRef.current,
            metadata,
            (tracksArrayRef.current[index] as RotorTrack).track.albums[0]
          );
        }
      }
    };
  }, [index]);

  useEffect(() => {
    if (
      (timeRangeRef.current?.valueAsNumber ||
        timeRangeRef.current?.valueAsNumber == 0) &&
      !isTimeBeingChanged
    ) {
      timeRangeRef.current.valueAsNumber = trackProgress;
    }
  }, [trackProgress, isTimeBeingChanged]);

  const dispatch = useDispatch<AppDispatch>();

  const handleResumePlaying = async () => {
    dispatch(setIsPlaying(true));
    if (localStorage.getItem("lastPlayerState")) {
      localStorage.setItem(
        "lastPlayerState",
        JSON.stringify({
          ...JSON.parse(localStorage.getItem("lastPlayerState") as string),
          localIsPlaying: true,
        })
      );
    }
    (async () => {
      await chrome.runtime.sendMessage({
        state: "playing",
      });
      console.log("плеинг нажался");
    })();
  };
  const handleStartPlaying = async () => {
    isQueuePresent.current = true;
    dispatch(setIsPlaying(true));
    if (localStorage.getItem("lastPlayerState")) {
      localStorage.setItem(
        "lastPlayerState",
        JSON.stringify({
          ...JSON.parse(localStorage.getItem("lastPlayerState") as string),
          localIsPlaying: true,
        })
      );
    }
    if (queueType == "playlist" && !isRadioMode) {
      setTimeout(async () => {
        await startAudioRequest(
          (tracksArrayRef.current as PlaylistTrack[])[index || 0].track,
          playIdRef.current,
          metadata,
          sourceQueue as IPlaylist
        );
      }, 200);
    }
    if (queueType == "album" && !isRadioMode) {
      setTimeout(async () => {
        await startAudioRequest(
          (tracksArrayRef.current as Track[])![index || 0],
          playIdRef.current,
          metadata
        );
      }, 200);
    }
    if (tracksArrayRef.current && isRadioMode) {
      setTimeout(async () => {
        await startAudioRequest(
          (tracksArrayRef.current[index] as RotorTrack).track,
          playIdRef.current,
          metadata
        );
      });
    }
    if (isRadioMode) {
      sendRotorFeedBack(
        "trackStarted",
        metadata,
        `${(tracksArrayRef.current[index] as RotorTrack).track.id}:${
          (tracksArrayRef.current[index] as RotorTrack).track.albums[0].id
        }`,
        0
      );
    }
  };
  const handlePause = async () => {
    dispatch(setIsPlaying(false));
    if (localStorage.getItem("lastPlayerState")) {
      localStorage.setItem(
        "lastPlayerState",
        JSON.stringify({
          ...JSON.parse(localStorage.getItem("lastPlayerState") as string),
          localIsPlaying: false,
        })
      );
    }
    const response = await chrome.runtime.sendMessage({
      state: "paused",
    });
    console.log(response);
  };

  const displayPopUpTimeBar = () => {
    if (
      (trackDuration / timeRangeRef.current!.offsetWidth) *
        (cursorX -
          (window.innerWidth - timeRangeRef.current!.offsetWidth) / //divided by 2 because there's a padding at right and left
            2) >
      trackDuration
    ) {
      return durationToMinutes(trackDuration * 1000);
    }
    return durationToMinutes(
      (trackDuration / timeRangeRef.current!.offsetWidth) *
        (cursorX -
          (window.innerWidth - timeRangeRef.current!.offsetWidth) / //divided by 2 because there's a padding at right and left
            2) *
        1000 //
    );
  };
  //
  useEffect(() => {
    console.log(index);
  }, [index]);

  const changeStorageVolumeValue = () => {
    localStorage.setItem(
      "user-volume",
      JSON.stringify(volumeRangeRef.current?.valueAsNumber || 0)
    );
  };

  useEffect(() => {
    console.log(trackDuration);
  }, [trackDuration]);

  const handleVolumeChange = () => {
    setVolume(volumeRangeRef.current?.valueAsNumber || 0);
    chrome?.runtime.sendMessage({
      volume: volumeRangeRef.current?.valueAsNumber || 0,
      offscreen: true,
    });
    console.log(volumeRangeRef.current?.valueAsNumber);
  };

  /*   setTimeout(() => {
    setCurrentDuration(audioRef.current?.currentTime || 0);
    audioTimeRef.current = audioRef.current?.currentTime || 0;
  }, 50); */

  const handleTimeChange = () => {
    setTimeout(() => {
      setIsTimeBeingChanged(false);
    }, 100);
    chrome?.runtime.sendMessage({
      time: timeRangeRef.current?.valueAsNumber || 0,
      offscreen: true,
    });
  };
  const handleSkipPrevious = () => {
    if (
      (trackLoadingStatus == "playing" ||
        trackLoadingStatus == "succeeded" ||
        trackLoadingStatus == "loaded-from-localStorage") &&
      !isRadioMode
    ) {
      if (trackProgress) {
        if (trackProgress < 10) {
          //if track current time is less than 5 seconds, changes track index. If not, replays the track
          if (index || index == 0) {
            const newIndex = index - 1;
            if (newIndex > -1) {
              dispatch(setIndex(newIndex));
            }
          }
        } else {
          dispatch(setCurrentTrackProgress(0));
          chrome?.runtime.sendMessage({
            time: 0,
            offscreen: true,
          });
          audioTimeRef.current = 0;
        }
      }
    }
    if (isRadioMode) {
      return;
    }
  };
  useEffect(() => {
    //fetches rotor array if track playing is the last in playlist
    if (
      tracksArrayRef.current?.length &&
      (index || index == 0) &&
      index + 1 > tracksArrayRef.current?.length - 1 &&
      !isRadioMode
    ) {
      dispatch(fetchRotorQueue());
    }
  }, [sourceQueue, index, isRadioMode]);

  useEffect(() => {
    console.log(tracksArrayRef.current);
    console.log(queueType);
  }, [sourceQueue]);
  useEffect(() => {
    //fetches new rotor array when previous ends
    if (
      isRadioMode &&
      (index || index == 0) &&
      index + 1 > tracksArrayRef.current.length
    ) {
      dispatch(fetchRotorQueue());
    }
  }, [index, isRadioMode]);

  useEffect(() => {
    console.log(index);
    console.log(tracksArrayRef.current[index], tracksArrayRef.current[0]);
    console.log(tracksArrayRef.current, sourceQueue);
    console.log(
      currentTrackId,
      (tracksArrayRef.current[index] as RotorTrack).track.id
    );
    if (
      (queueType != "rotor-track" &&
        currentTrackId != (tracksArrayRef.current as Track[])[index].id) ||
      (queueType == "rotor-track" &&
        currentTrackId !=
          (tracksArrayRef.current as RotorTrack[])[index].track.id)
    ) {
      // (tracksArrayRef.current[index] as RotorTrack).track,
      console.log("я сосал(нажалась загрузка юрла)");
      if (!isRadioMode && (index || index == 0) && tracksArrayRef.current) {
        dispatch(
          fetchTrackUrl(
            (tracksArrayRef.current as Track[])[index]?.id?.toString()
          )
        );
        chrome.runtime.sendMessage({
          track_index: index,
          offscreen: true,
        });
      }
      if (isRadioMode && (index || index == 0)) {
        dispatch(
          fetchTrackUrl(
            (tracksArrayRef.current[index] as RotorTrack)?.track.id.toString()
          )
        );
        chrome.runtime.sendMessage({
          track_index: index,
        });
        console.log(currentTrackId);
      }
    }
    return () => {
      if (isRadioMode) {
        sendRotorFeedBack(
          radioTrackEndReason.current,
          metadata,
          `${(tracksArrayRef.current[index] as RotorTrack)?.track.id}:${
            (tracksArrayRef.current[index] as RotorTrack)?.track.albums[0].id
          }`,
          audioTimeRef.current
        );
      }
    };
  }, [index, isRadioMode, sourceQueue]);

  const handleSkipNextPlaylist = () => {
    if (
      trackLoadingStatus == "playing" ||
      trackLoadingStatus == "succeeded" ||
      trackLoadingStatus == "loaded-from-localStorage"
    ) {
      console.log("хуй");
      const newIndex = index + 1;
      if (newIndex <= tracksArrayRef.current!.length - 1) {
        console.log(newIndex, index);
        dispatch(setIndex(newIndex));
      }
    }
  };

  const handleSkipNextRadio = (reason?: "trackFinished" | "skip") => {
    if (
      (trackLoadingStatus == "playing" ||
        trackLoadingStatus == "succeeded" ||
        trackLoadingStatus == "loaded-from-localStorage") &&
      rotorStatus == "succeeded"
    ) {
      console.log("траходром");
      if (index || index == 0) {
        console.log(index);
        const newIndex = index + 1;
        radioTrackEndReason.current = reason;
        dispatch(setIndex(newIndex));
      }
    }
  };
  return (
    <div
      onKeyDown={(e) => {
        if (isPlaying) {
          if (e.key == " ") {
            handlePause();
          }
        } else if (e.key == " ") {
          handleResumePlaying();
        }
      }}
      tabIndex={0}
    >
      {
        <div className={styles.playerContainer}>
          <div className={styles.playerActive}>
            <span className={styles.currentDuration}>
              {durationToMinutes(trackProgress * 1000) || "00:00"}
            </span>
            <input
              type="range"
              min={0}
              max={trackDuration}
              step="any"
              onMouseMove={(e) => {
                setDisplayTimeBar(true);
                setCursorX(e.clientX);
              }}
              onMouseLeave={(e) => {
                setDisplayTimeBar(false);
                if (isTimeBeingChanged) {
                  handleTimeChange();
                }
              }}
              ref={timeRangeRef}
              className={styles.playerTime}
              onClickCapture={(e) => {
                if (e.button == 2) {
                  handleTimeChange();
                }
              }}
              onMouseDown={() => {
                setIsTimeBeingChanged(true);
              }}
            />
            <span className={styles.maxDuration}>
              {durationToMinutes(trackDuration * 1000) || "00:00"}
            </span>
            {trackLoadingStatus != "loading" &&
            imageLoadingStatus != "loading" ? (
              <>
                <div className={styles.trackInfoContainer}>
                  {imageLoadingStatus != "error" ? (
                    <div className={styles.trackCover}>
                      <img
                        src={cover}
                        alt={title}
                        onLoadStart={() => setImageLoadingStatus("loading")}
                        onLoad={() => setImageLoadingStatus("succeeded")}
                        onError={() => setImageLoadingStatus("error")}
                      />
                    </div>
                  ) : (
                    <div className={styles.trackCover}>
                      Тут должна была быть картинка, но злой сервер решил ее не
                      отдавать
                    </div>
                  )}
                  <div className={styles.trackInfo}>
                    <span className={styles.title}>{title}</span>
                    <span className={styles.artists}>
                      {concatArtistNames(artists)}
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <div className={styles.trackInfoContainer}></div>
            )}

            <div className={styles.controlButtons}>
              <PlayerLikeButton isRadioMode={isRadioMode} from={metadata} />
              <IconContext.Provider value={{ size: "36px" }}>
                {isRadioMode ? (
                  <IconContext.Provider value={{ size: "24px" }}>
                    <FaTheaterMasks
                      className={styles.controlButton}
                      onClick={() =>
                        displayRotorSettings
                          ? setDisplayRotorSettings(false)
                          : setDisplayRotorSettings(true)
                      }
                    />
                  </IconContext.Provider>
                ) : (
                  <BiSkipPrevious
                    onClick={handleSkipPrevious}
                    className={styles.controlButton}
                  />
                )}
                {isPlaying ? (
                  <AiOutlinePause
                    onClick={handlePause}
                    className={styles.controlButton}
                  />
                ) : (
                  <BiPlay
                    onClick={handleResumePlaying}
                    className={styles.controlButton}
                  />
                )}
                <BiSkipNext
                  onClick={() => {
                    isRadioMode
                      ? handleSkipNextRadio("skip")
                      : handleSkipNextPlaylist();
                  }}
                  className={styles.controlButton}
                />
                <AiOutlineUnorderedList
                  className={styles.controlButton}
                  onClick={() =>
                    isQueueDisplayed
                      ? (dispatch(setSelectedItemType("not-selected")),
                        setIsQueueDisplayed(false))
                      : (dispatch(setSelectedItemType(queueType)),
                        setIsQueueDisplayed(true))
                  }
                />
              </IconContext.Provider>
            </div>
            <div className={styles.volumeControlsContainer}>
              <div className={styles.volumeValueContainer}>
                <input
                  type="range"
                  min={0}
                  max={1}
                  value={volume}
                  step={0.01}
                  onChange={handleVolumeChange}
                  ref={volumeRangeRef}
                  onClick={() => changeStorageVolumeValue()}
                  className={styles.volumeValue}
                />
              </div>
            </div>
            <>
              {/* <div className={styles.extraButtons}>
              <IconContext.Provider value={{ size: "36px" }}>
                {isReplayPlaylist ? (
                  <MdRepeatOne
                    onClick={() => setIsReplayTrack(false)}
                    className={styles.controlButton}
                  />
                ) : isReplayTrack ? (
                  <MdRepeat
                    onClick={() => setIsReplayTrack(false)}
                    className={styles.controlButton_replayOn}
                  />
                ) : (
                  <MdRepeat
                    onClick={() => setIsReplayTrack(true)}
                    className={styles.controlButton}
                  />
                )}
              </IconContext.Provider>
            </div> */}
            </>
            {displayTimeBar ? (
              <div
                className={styles.popupBar}
                style={{
                  left:
                    cursorX <= 299
                      ? cursorX > 21
                        ? cursorX -
                          (window.innerWidth -
                            timeRangeRef.current!.offsetWidth) /
                            2
                        : 21 -
                          (window.innerWidth -
                            timeRangeRef.current!.offsetWidth) /
                            2
                      : 299 -
                        (window.innerWidth -
                          timeRangeRef.current!.offsetWidth) /
                          2,
                  top: -35,
                }}
              >
                <div className={styles.setTimeBar}>{displayPopUpTimeBar()}</div>
                <div className={styles.popupBar_stair}></div>
              </div>
            ) : (
              <></>
            )}
            {displayRotorSettings ? <RotorSettings /> : <></>}
          </div>
        </div>
      }
    </div>
  );
};

export default Player;
