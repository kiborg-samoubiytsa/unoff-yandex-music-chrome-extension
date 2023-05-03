/* chrome.cookies.get(
  { name: "uid", url: "https://zvuk-ponosa.glitch.me/" },
  (cookie) => {
    console.log(cookie);
  }
  ); */

const authorize = async () => {
  let isAccessTokenSent = false;
  let createdTabId;

  let access_token = await chrome.cookies.get({
    name: "token",
    url: "https://zvuk-ponosa.glitch.me/",
  });
  let uid = await chrome.cookies.get({
    name: "uid",
    url: "https://zvuk-ponosa.glitch.me/",
  });

  chrome.tabs.create(
    {
      url: "https://oauth.yandex.ru/authorize?response_type=token&client_id=23cabbbdc6cd418abb4b39c32c41195d",
    },
    (tab) => {
      createdTabId = tab.id;
    }
  );

  chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    if (tabId !== createdTabId) {
      return false;
    }

    if (
      await tab.url.match(
        /https:\/\/music\.yandex\.ru\/#access_token=(.+)&token_type=bearer&expires_in=(.+)/
      )
    ) {
      const token_url = tab.url;

      access_token = token_url.split("#access_token=")[1].split("&")[0];

      const uidData = await fetch(
        `https://zvuk-ponosa.glitch.me/account/token=${access_token}`
      );

      const uidDataJson = await uidData.json();

      uid = uidDataJson.id;

      const now = new Date();

      chrome.cookies.set({
        expirationDate: Math.floor(now.getTime() / 1000) + 315360000,
        name: "token",
        value: access_token,
        url: "https://zvuk-ponosa.glitch.me/",
      });
      chrome.cookies.set({
        expirationDate: Math.floor(now.getTime() / 1000) + 315360000,
        name: "uid",
        value: uid,
        url: "https://zvuk-ponosa.glitch.me/",
      });
      chrome.storage.local.set({ ["yandex-music-token"]: access_token });
      chrome.storage.local.set({ ["yandex-music-uid"]: uid });
      chrome.tabs.remove(createdTabId);
      chrome.tabs.onUpdated.removeListener();
    }
  });
};

const createOffscreen = async () => {
  if (await chrome.offscreen.hasDocument()) {
    console.log("пенис");
    return;
  }

  await chrome.offscreen.createDocument({
    url: "offscreen.html",
    reasons: ["DISPLAY_MEDIA"],
    justification: "testing",
  });
  console.log("234325");
};

chrome.runtime.onMessage.addListener((message) => {
  if (message.code == "request_token") {
    console.log(2);
    authorize();
  }
});

chrome.runtime.onMessage.addListener(async (message) => {
  //message comes first here to make sure that offscreen document is created.
  //for url sending method visit ./extensionFront/src/store/reducers/currentTrackSlice

  if (message.offscreen) {
    return;
  }

  if (message.app == "init") {
    await createOffscreen();
  }
  if (message.state == "paused") {
    await createOffscreen();
    await chrome.runtime.sendMessage({ state: "paused", offscreen: true });
  }
  if (message.state == "playing") {
    await createOffscreen();
    await chrome.runtime.sendMessage({ state: "playing", offscreen: true });
  }
});
//match pattern: https://music.yandex.ru/#access_token=y0_AgAAAABYS36WAAG8XgAAAADcXOdBKvVtr0fNTVOxEB6oR9YR0pbkV8k&token_type=bearer&expires_in=30381156
