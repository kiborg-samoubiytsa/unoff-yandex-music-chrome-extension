import { FC, useEffect, useRef, useState, useLayoutEffect } from "react";
import {
  setIsPlaying,
  setIndex,
  trackUrl,
  trackArtists,
  trackCover,
  trackTitle,
  setTrackStatus,
  setCurrentTrackAlbum,
  setArtists,
  setTitle,
  setCover,
  setUrl,
} from "../../store/reducers/currentTrackSlice";
import { useSelector, useDispatch } from "react-redux";
import { IconContext } from "react-icons";
import { AiOutlinePause, AiOutlineUnorderedList } from "react-icons/ai";
import { BiPlay, BiSkipNext, BiSkipPrevious } from "react-icons/bi";
import { MdRepeat, MdRepeatOne, MdVolumeUp, MdVolumeOff } from "react-icons/md";
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
} from "../../types/types";
import {
  selectIsPlaying,
  selectIndex,
} from "../../store/reducers/currentTrackSlice";
import {
  setIsRadioMode,
  isPlayerVisible as isVisible,
} from "../../store/reducers/playerSlice";
import { AppDispatch, RootState } from "../../store/store";
import { startAudioRequest } from "../../requests/startAudioRequest";
import { endAudioRequest } from "../../requests/endAudioRequest";
import { generatePlayId } from "../../helpers/generatePlayId";
import {
  setCurrentTrackId,
  fetchTrackUrl,
} from "../../store/reducers/currentTrackSlice";
import {
  fetchRotorQueue,
  fetchRotorSettings,
  rotorQueueStatus,
  rotorSettings as _rotorSettings,
  setRotorLoadingStatus,
  setRotorQueue,
  setSettingsValues,
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
import { useCurrentTrack } from "../../hooks/useCurrentTrackInfo";

interface Props {
  setIsQueueDisplayed: React.Dispatch<React.SetStateAction<boolean>>;
  isQueueDisplayed: boolean;
}
const Player: FC<Props> = ({ setIsQueueDisplayed, isQueueDisplayed }) => {
  //useStates
  const {
    localTitle,
    localCover,
    localArtists,
    localCurrentTrackId,
    localSourceQueue,
    localQueueType,
    localMetadata,
    localIsRadioMode,
    localIndex,
    localIsPlaying,
    localRotorStatus,
    localRotorQueue,
    localMaxDuration,
    localSrc,
    localCurrentDuration,
  } = localStorage.getItem("lastPlayerState")
    ? JSON.parse(localStorage.getItem("lastPlayerState") || "")
    : {
        localTitle: "",
        localCover: "",
        localArtists: [],
        localCurrentTrackId: "",
        localSourceQueue: "",
        localQueueType: "",
        localMetadata: "",
        localIsRadioMode: false,
        localIndex: null,
        localRotorStatus: "idle",
        localRotorQueue: [],
        localMaxDuration: 0,
        localIsPlaying: false,
        localSrc: "",
        localCurrentDuration: 0,
      };

  const [maxDuration, setMaxDuration] = useState<number>(0); //this state is used to display the duration of track
  const [currentDuration, setCurrentDuration] = useState<number>(0); //this state is used to display time track has been playing
  const [volume, setVolume] = useState<number>(
    localStorage.getItem("user-volume")
      ? JSON.parse(localStorage.getItem("user-volume") || "1")
      : 1
  ); //actual volume level
  const [isTimeBeingChanged, setIsTimeBeingChanged] = useState<boolean>(false); //state that sets to true when user drags or clicks range with duration. used to prevent bug when displayed progress overwrites value, that is being input by user
  const [isReplayTrack, setIsReplayTrack] = useState<boolean>(false); //state that is used
  const [isReplayPlaylist, setIsReplayPlaylist] = useState<boolean>(false);
  const [displayTimeBar, setDisplayTimeBar] = useState<boolean>(false); //state that is used to control visibility of popup with time user will set track to when clicks
  const [cursorX, setCursorX] = useState<number>(0);
  const [displayRotorSettings, setDisplayRotorSettings] =
    useState<boolean>(false); //if true, displays user mood settings for reccoendations

  //useRefs

  const radioTrackEndReason = useRef<"trackFinished" | "skip">("trackFinished");
  const audioTimeRef = useRef<number>(0); //refers to time has been played
  const timeRangeRef = useRef<HTMLInputElement>(null);
  const volumeRangeRef = useRef<HTMLInputElement>(null); //value for sound, used for display
  const isQueuePresent = useRef<boolean>(false);
  const playIdRef = useRef<string>(generatePlayId());
  const isFirstRender = useRef<boolean>(true);

  //useSelectors

  const isPlayerVisible = useSelector(isVisible);
  const sourceQueue = useSelector(
    (state: RootState) => state.currentQueueSlice.currentQueue
  );

  const queueType = useSelector(type);

  const index = useSelector(selectIndex);

  const isPlaying = useSelector(selectIsPlaying);

  const tracksArray =
    queueType == "playlist"
      ? (sourceQueue as IPlaylist).tracks
      : queueType == "album"
      ? (sourceQueue as AlbumWithTracks).volumes?.flat()
      : queueType == "similar-tracks"
      ? (sourceQueue as SimilarTracks).similarTracks
      : queueType == "track"
      ? (sourceQueue as Track[])
      : [];

  const trackLoadingStatus = useSelector(
    (state: RootState) => state.currentTrack.status
  );
  const rotorQueue = useSelector(
    (state: RootState) => state.rotorSliceReducer.rotorQueue
  );
  const isRadioMode = useSelector(
    (state: RootState) => state.playerSlice.isInRadioMode
  );
  const metadata = useSelector(selectedItemMeta);

  const currentTrackId = useSelector(
    (state: RootState) => state.currentTrack.currentTrackId
  );

  const rotorStatus = useSelector(rotorQueueStatus);

  const src = useSelector(trackUrl);

  const title = useSelector(trackTitle);
  const cover = useSelector(trackCover);
  const artists = useSelector(trackArtists);

  const rotorSettings = useSelector(_rotorSettings);

  //others

  const radioIdArray = rotorQueue.map((track: any) => {
    return track.track.id;
  });
  const trackIdArray = tracksArray?.map((track) => {
    return track.id;
  });

  useLayoutEffect(() => {
    console.log(localCurrentDuration);
    if (
      localStorage.getItem("lastPlayerState") &&
      JSON.parse(localStorage.getItem("lastPlayerState") || "").hasOwnProperty(
        "localSourceQueue"
      )
    ) {
      console.log(localSrc);
      dispatch(setUrl(src));
      dispatch(setCurrentTrackId(localCurrentTrackId));
      dispatch(setCurrentQueue(localSourceQueue));
      dispatch(setQueueType(localQueueType));
      dispatch(setItemMetadata(localMetadata));
      dispatch(setIndex(localIndex));
      dispatch(setIsRadioMode(localIsRadioMode));
      dispatch(setRotorLoadingStatus(localRotorStatus));
      dispatch(setRotorQueue(localRotorQueue));
      dispatch(setIsPlaying(localIsPlaying));
      //1 достает из локального хранилища длительности и обновляет реф с данными для аналитики
      setCurrentDuration(localCurrentDuration);
      audioTimeRef.current = localCurrentDuration;
      //2 сетает стейт, который отображается на инпут рендже и в диве с текущей длительностью
      if (!maxDuration) {
        setMaxDuration(localMaxDuration);
      }
    }
    console.log("second");
    window.addEventListener("unload", () => {
      localStorage.setItem(
        "lastPlayerState",
        JSON.stringify({
          ...JSON.parse(localStorage.getItem("lastPlayerState") as string),
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

  useCurrentTrack();

  useEffect(() => {
    console.log(tracksArray);
  }, [queueType]);

  useEffect(() => {
    if (trackLoadingStatus == "succeeded") {
      handleStartPlaying();
    }
  }, [index, trackLoadingStatus]);

  useEffect(() => {
    if (trackLoadingStatus == "playing") {
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
          localRotorStatus: rotorStatus,
          localRotorQueue: rotorQueue,
          localMaxDuration: maxDuration,
          localSrc: src,
          localIsPlaying: isPlaying,
        })
      );
    }
    return () => {
      console.log(audioTimeRef.current);
    };
  }, [currentTrackId, maxDuration]);

  useEffect(() => {
    return () => {
      if (isQueuePresent.current) {
        if (!isRadioMode && queueType == "playlist" && tracksArray) {
          endAudioRequest(
            (tracksArray as PlaylistTrack[])[index || 0].track,
            audioTimeRef.current,
            playIdRef.current,
            metadata,
            (tracksArray as PlaylistTrack[])[index || 0].track.albums[0],
            sourceQueue as IPlaylist
          );
        }
        if (
          !isRadioMode &&
          (queueType == "album" || queueType == "similar-tracks") &&
          tracksArray
        ) {
          endAudioRequest(
            (tracksArray as Track[])[index || 0],
            audioTimeRef.current,
            playIdRef.current,
            metadata,
            sourceQueue as AlbumWithTracks
          );
        }
        if (!isRadioMode && queueType == "track" && tracksArray) {
          endAudioRequest(
            (tracksArray as Track[])[index || 0],
            audioTimeRef.current,
            playIdRef.current,
            metadata,
            sourceQueue as AlbumWithTracks
          );
        }
        if (isRadioMode && rotorQueue) {
          endAudioRequest(
            rotorQueue[index || 0].track,
            audioTimeRef.current,
            playIdRef.current,
            metadata,
            rotorQueue[index || 0].track.albums[0]
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
      timeRangeRef.current.valueAsNumber = currentDuration;
    }
  }, [currentDuration, isTimeBeingChanged]);

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
      const response = await chrome.runtime.sendMessage({
        state: "playing",
      });
      console.log("плеинг нажался");
    })();
  };
  const handleStartPlaying = async () => {
    isQueuePresent.current = true;
    dispatch(setTrackStatus("playing"));
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
          (tracksArray as PlaylistTrack[])[index || 0].track,
          playIdRef.current,
          metadata,
          sourceQueue as IPlaylist
        );
      }, 200);
    }
    if (queueType == "album" && !isRadioMode) {
      setTimeout(async () => {
        await startAudioRequest(
          (tracksArray as Track[])![index || 0],
          playIdRef.current,
          metadata
        );
      }, 200);
    }
    if (rotorQueue && isRadioMode) {
      setTimeout(async () => {
        await startAudioRequest(
          rotorQueue![index || 0].track,
          playIdRef.current,
          metadata
        );
      });
      dispatch(setCurrentTrackId(radioIdArray[index || 0]));
    }
    if (isRadioMode) {
      sendRotorFeedBack(
        "trackStarted",
        metadata,
        `${rotorQueue![index || 0].track.id}:${
          rotorQueue![index || 0].track.albums[0].id
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
      (maxDuration / timeRangeRef.current!.offsetWidth) *
        (cursorX -
          (window.innerWidth - timeRangeRef.current!.offsetWidth) / //divided by 2 because there's a padding at right and left
            2) >
      maxDuration
    ) {
      return durationToMinutes(maxDuration * 1000);
    }
    return durationToMinutes(
      (maxDuration / timeRangeRef.current!.offsetWidth) *
        (cursorX -
          (window.innerWidth - timeRangeRef.current!.offsetWidth) / //divided by 2 because there's a padding at right and left
            2) *
        1000 //
    );
  };

  const changeStorageVolumeValue = () => {
    localStorage.setItem(
      "user-volume",
      JSON.stringify(volumeRangeRef.current?.valueAsNumber || 0)
    );
  };

  chrome?.runtime.onMessage.addListener(async (msg) => {
    if (msg.duration) {
      setMaxDuration(msg.duration);
    }
    if (msg.currentTime || msg.currentTime == 0) {
      setCurrentDuration(msg.currentTime);
      audioTimeRef.current = msg.currentTime;
    }
    if (msg.trackEnded) {
      console.log("negro");
      if (index || index == 0) {
        if (!isReplayTrack && index < tracksArray!.length - 1 && !isRadioMode) {
          handleSkipNextPlaylist();
        } else if (isReplayTrack) {
          dispatch(setIndex(index || 0));
        }
        if (
          !isReplayPlaylist &&
          index >= tracksArray!.length - 1 &&
          !isReplayTrack
        ) {
          dispatch(setIsRadioMode(true));
          dispatch(setIndex(0));
          dispatch(fetchRotorSettings());
          sendRotorFeedBack("radioStarted", "web-radio-playlist-autoflow");
        }
        if (!isReplayTrack && index <= rotorQueue.length - 1 && isRadioMode) {
          handleSkipNextRadio("trackFinished");
        }
      }
    }
  });

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
      (trackLoadingStatus == "playing" || trackLoadingStatus == "succeeded") &&
      !isRadioMode
    ) {
      if (currentDuration) {
        if (currentDuration < 10) {
          //if track current time is less than 5 seconds, changes track index. If not, replays the track
          if (index || index == 0) {
            const newIndex = index - 1;
            if (newIndex > -1) {
              dispatch(setIndex(newIndex));
            }
          }
        } else {
          setCurrentDuration(0);
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
      tracksArray?.length &&
      (index || index == 0) &&
      index + 1 > tracksArray.length - 1 &&
      !isRadioMode
    ) {
      dispatch(fetchRotorQueue());
    }
  }, [sourceQueue, index, isRadioMode]);

  useEffect(() => {
    console.log(tracksArray);
    console.log(queueType);
  }, [sourceQueue]);
  useEffect(() => {
    //fetches new rotor array when previous ends
    if (
      isRadioMode &&
      (index || index == 0) &&
      index + 1 > radioIdArray.length - 1
    ) {
      dispatch(fetchRotorQueue());
    }
  }, [index, isRadioMode]);

  useEffect(() => {
    if (index != localIndex && sourceQueue != localSourceQueue) {
      console.log("я сосал(нажалась загрузка юрла)");
      if (!isRadioMode && (index || index == 0) && trackIdArray) {
        dispatch(fetchTrackUrl(trackIdArray[index]?.toString()));
        chrome.runtime.sendMessage({
          track_index: index,
          offscreen: true,
        });
      }
      if (isRadioMode && (index || index == 0) && radioIdArray) {
        dispatch(fetchTrackUrl(radioIdArray![index]));
        dispatch(fetchTrackUrl(trackIdArray[index]?.toString()));
        chrome.runtime.sendMessage({
          track_index: index,
        });
        console.log(currentTrackId, radioIdArray![index]);
      }
    }
    return () => {
      if (isRadioMode) {
        sendRotorFeedBack(
          radioTrackEndReason.current,
          metadata,
          `${rotorQueue![index || 0].track.id}:${
            rotorQueue![index || 0].track.albums[0].id
          }`,
          audioTimeRef.current
        );
      }
    };
  }, [index, isRadioMode, sourceQueue]);

  useEffect(() => {
    console.log(cursorX);
  }, [cursorX]);

  const handleSkipNextPlaylist = () => {
    if (
      trackLoadingStatus == "playing" ||
      trackLoadingStatus == "succeeded" ||
      trackLoadingStatus == "idle"
    ) {
      if (index || index == 0) {
        const newIndex = index + 1;
        if (newIndex <= tracksArray!.length - 1) {
          dispatch(setIndex(newIndex));
        }
      }
    }
  };

  const handleSkipNextRadio = (reason: "trackFinished" | "skip") => {
    if (
      (trackLoadingStatus == "playing" ||
        trackLoadingStatus == "succeeded" ||
        trackLoadingStatus == "idle") &&
      rotorStatus == "succeeded"
    ) {
      if (index || index == 0) {
        console.log(index);
        const newIndex = index + 1;
        radioTrackEndReason.current = reason;
        dispatch(setIndex(newIndex));
        if (newIndex > radioIdArray.length - 1) {
          dispatch(setIndex(0));
        }
      }
    }
  };
  const onTrackEnded = () => {};
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
      {isPlayerVisible ? (
        <div className={styles.playerContainer}>
          <div className={styles.playerActive}>
            <span className={styles.currentDuration}>
              {durationToMinutes(currentDuration * 1000) || "00:00"}
            </span>
            <input
              type="range"
              min={0}
              max={maxDuration}
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
              {durationToMinutes(maxDuration * 1000) || "00:00"}
            </span>
            {trackLoadingStatus != "loading" ? (
              <>
                <div className={styles.trackInfoContainer}>
                  <img
                    src={
                      (localCover != "" && trackLoadingStatus == "idle") ||
                      localCover == cover
                        ? localCover
                        : cover
                    }
                    alt={title}
                    className={styles.trackCover}
                  />
                  <div className={styles.trackInfo}>
                    <span className={styles.title}>
                      {localTitle && trackLoadingStatus == "idle"
                        ? localTitle
                        : title}
                    </span>
                    <span className={styles.artists}>
                      {(localArtists && trackLoadingStatus == "idle") ||
                      localArtists == artists
                        ? concatArtistNames(localArtists)
                        : concatArtistNames(artists)}
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
              <div className={styles.volumeIconContainer}>
                <IconContext.Provider value={{ size: "36" }}>
                  {/*                   {volume > 0 ? (
                    <MdVolumeUp
                      className={styles.controlButton}
                      onClick={() => setVolume(0)}
                    />
                  ) : (
                    <MdVolumeOff
                      className={styles.controlButton}
                      onClick={() =>
                        setVolume(
                          JSON.parse(localStorage.getItem("user-volume") || "1")
                        )
                      }
                    />
                  )} */}
                </IconContext.Provider>
              </div>
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
      ) : (
        <></>
      )}
    </div>
  );
};

export default Player;
