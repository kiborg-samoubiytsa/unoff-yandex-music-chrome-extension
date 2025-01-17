let isPlaying = false;
/* let volume = localStorage.getItem("volume")
  ? +JSON.parse(localStorage.getItem("volume"))
  : 0.2; */

const lastPlayerState = localStorage.getItem("lastPlayerState")
  ? JSON.parse(localStorage.getItem("lastPlayerState"))
  : {};

let volume = JSON.parse(localStorage.getItem("user-volume") || "0");

let index = localStorage.getItem("lastPlayerState")
  ? JSON.parse(localStorage.getItem("lastPlayerState")).localIndex
  : {};

let isRadioMode = localStorage.getItem("lastPlayerState")
  ? JSON.parse(localStorage.getItem("lastPlayerState")).localIsRadioMode
  : {};

let id = localStorage.getItem("lastPlayerState")
  ? JSON.parse(localStorage.getItem("lastPlayerState")).localCurrentTrackId
  : {};
//last track id p.s. have to save it in local storage because of offscreen page lifetime cycle https://developer.chrome.com/docs/extensions/reference/offscreen/

let src = localStorage.getItem("lastPlayerState")
  ? JSON.parse(localStorage.getItem("lastPlayerState")).localSrc
  : {}; //default src for audio. Takes value from last track played

let queueType = localStorage.getItem("lastPlayerState")
  ? JSON.parse(localStorage.getItem("lastPlayerState")).localQueueType
  : {};

let currentQueue = localStorage.getItem("lastPlayerState")
  ? queueType == "playlist"
    ? localStorage.getItem("lastPlayerState").localSourceQueue?.tracks
    : queueType == "album"
    ? localStorage.getItem("lastPlayerState").localSourceQueue?.volumes?.flat()
    : queueType == "similar-tracks"
    ? localStorage.getItem("lastPlayerState").localSourceQueue?.similarTracks
    : queueType == "track"
    ? localStorage.getItem("lastPlayerState")?.localSourceQueue
    : []
  : [];

const audio = document.querySelector("audio");

if (src) {
  audio.src = src;
}

chrome.runtime.onMessage.addListener(async (msg, sender, sendResponse) => {
  /* volume = 0.2; */ /* await chrome.storage.local.get(["volume"]); */
  if (!(await msg.offscreen)) {
    return;
  }
  if ((await msg.volume) || (await msg.volume) == 0) {
    console.log(+msg.volume);
    audio.volume = +msg.volume;
  }
  if ((await msg.time) || (await msg.time) == 0) {
    audio.currentTime = msg.time;
  }
  if ((await msg.track_url) && (await msg.track_id)) {
    console.log(msg.track_url);
    if ((await msg.track_id) != id) {
      audio.src = await msg.track_url;
      id = await msg.track_id;
      console.log("айди не одинаковое");
      localStorage.setItem(
        "lastPlayerState",
        JSON.stringify({
          ...lastPlayerState,
          localCurrentTrackId: id,
          localSrc: src,
        })
      );
      await playAudio();
      await chrome.runtime.sendMessage({ duration: audio.duration });
      return;
    }
  }
  if (msg.userData) {
    console.log(msg.userData);
    localStorage.setItem("user-data", JSON.stringify(msg.userData));
  }
  if (msg.state == "playing") {
    if (audio.src) {
      console.log("пенис");
      playAudio();
    } else console.log("no src");
  }
  if (msg.state == "paused") {
    console.log("негрик");
    if (audio.src) {
      pauseAudio();
    }
  }

  if (msg.track_index || msg.track_index == 0) {
    console.log(msg.track_index);
    index = msg.track_index;
    localStorage.setItem(
      "lastPlayerState",
      JSON.stringify({
        ...lastPlayerState,
        localIndex: msg.track_index,
      })
    );
  }

  if (msg.currentQueue && msg.type) {
    console.log(msg.type);
    currentQueue =
      msg.type == "playlist"
        ? msg.currentQueue.tracks
        : msg.type == "album"
        ? msg.currentQueue.volumes?.flat()
        : msg.type == "similar-tracks"
        ? msg.currentQueue.similarTracks
        : msg.type == "track"
        ? msg.currentQueue
        : [];
    queueType = msg.type;
    console.log(currentQueue);
  }
  /*   if (msg.track_id) {
    //fetches track info and url and sends back info
    if ((await msg.track_id) != id) {
      /*           audio.src = await msg.track_url;
      id = await msg.track_id;
      console.log("айди не одинаковое");
      await playAudio();
      chrome.runtime.sendMessage({ duration: audio.duration });
      return;
      const response = await fetch(
        `https://zvuk-ponosa.glitch.me/api/get-mp3-link/id=${
          msg.track_id
        }/uid=${1481342614}/token=y0_AgAAAABYS36WAAG8XgAAAADdi3wZsl4lb98zTqKXtJAmN0azIDZljUE`,
        { method: "GET", mode: "no-cors" }
      );
      const data = await response.json();
      console.log(JSON.parse(localStorage.getItem("user-data")));
      audio.src = data.url;
      sendResponse({ info: data.info[0] });
      localStorage.setItem("last_track_src", JSON.stringify(data.url));
    }
  } */
});

const getYourWaveSequence = async () => {
  const userData = JSON.parse(localStorage.getItem("user-data") || "");
  const sequence = await fetch(
    `https://zvuk-ponosa.glitch.me/api/rotor/station=user:onyourwave/uid=${userData.uid}/token=${userData.token}`,
    { method: "GET", mode: "no-cors" }
  );
  const data = await sequence.json();
  return data.result.sequence;
};

const onTrackEnded = async () => {
  /* await chrome?.runtime.sendMessage({
    trackEnded: true,
  }); */
  console.log(currentQueue, index);

  console.log(lastPlayerState);
  if (index < currentQueue.length - 1) {
    const response = isRadioMode
      ? await fetch(
          `https://zvuk-ponosa.glitch.me/api/get-mp3-link/id=${
            currentQueue[index + 1].track.id
          }`,
          { method: "GET", mode: "no-cors" }
        )
      : await fetch(
          `https://zvuk-ponosa.glitch.me/api/get-mp3-link/id=${
            currentQueue[index + 1].id
          }`,
          { method: "GET", mode: "no-cors" }
        );
    const data = await response.json();
    console.log(JSON.parse(localStorage.getItem("user-data")));
    id = currentQueue[index + 1].id;
    audio.src = data.url;

    const trackInfo = data.info[0];

    localStorage.setItem(
      "lastPlayerState",
      JSON.stringify({
        ...(localStorage.getItem("lastPlayerState")
          ? JSON.parse(localStorage.getItem("lastPlayerState"))
          : {}),
        localTitle: trackInfo.title,
        localCover:
          `https://${trackInfo.coverUri?.replace("%%", "50x50")}` || "",
        localArtists: trackInfo.artists,
        localCurrentTrackId: trackInfo.id,
        localIndex: index + 1,
        localSrc: src,
        localMaxDuration: trackInfo.durationMs / 1000,
      })
    );
    console.log(index);
    index += 1;
    await chrome.runtime.sendMessage({ duration: audio.duration });
    await chrome.runtime.sendMessage({
      track_ended: true,
    });
  } else {
    index = 0;

    currentQueue = await getYourWaveSequence();

    console.log(currentQueue[index]);
    const response = await fetch(
      `https://zvuk-ponosa.glitch.me/api/get-mp3-link/id=${currentQueue[index].track.id}`,
      { method: "GET", mode: "no-cors" }
    );
    const data = await response.json();
    console.log(JSON.parse(localStorage.getItem("user-data")));
    id = currentQueue[index].id;
    audio.src = data.url;

    console.log(currentQueue);
    console.log(index, audio.src);

    const trackInfo = data.info[0];

    localStorage.setItem(
      "lastPlayerState",
      JSON.stringify({
        ...(localStorage.getItem("lastPlayerState")
          ? JSON.parse(localStorage.getItem("lastPlayerState"))
          : {}),
        localTitle: trackInfo.title,
        localCover:
          `https://${trackInfo.coverUri?.replace("%%", "50x50")}` || "",
        localArtists: trackInfo.artists,
        localCurrentTrackId: trackInfo.id,
        localIndex: index,
        localSrc: src,
        localMaxDuration: trackInfo.durationMs / 1000,
        localIsRadioMode: true,
        localSourceQueue: currentQueue,
        localQueueType: "rotor-track",
        localRotorStatus: "succeeded",
      })
    );
    await chrome.runtime.sendMessage({ rotorMode: true, track_ended: true });
  }
  console.log(currentQueue);
  await playAudio();
};

audio.addEventListener("ended", onTrackEnded);

/* const startPlayingAudio = async () => {
  console.log("el biba");
  const response = await fetch(
    `https://zvuk-ponosa.glitch.me/api/get-mp3-link/id=${333254}`,
    { method: "GET", mode: "no-cors" }
  );
  console.log(JSON.parse(localStorage.getItem("user-data")));
  console.log(await response.json());
}; */

const playAudio = async () => {
  if (!audio.src) {
    console.log("нет срц лол");
    return;
  }
  await audio.play();
  isPlaying = true;
  console.log(audio.src);
};
setInterval(async () => {
  if (isPlaying) {
    await chrome.runtime.sendMessage({ currentTime: audio.currentTime });
  }
}, 50);

const pauseAudio = async () => {
  audio.pause();
  isPlaying = false;
};
