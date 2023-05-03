export const validatePassword = async (e: React.FormEvent<HTMLFormElement>) => {
  try {
    const token = await chrome.storage.local.get(["yandex-music-token"]);
    const uid = await chrome.storage.local.get(["yandex-music-uid"]);
    console.log(uid["yandex-music-uid"], token["yandex-music-uid"]);
    localStorage.setItem(
      "user-data",
      JSON.stringify({
        uid: uid["yandex-music-uid"],
        token: token["yandex-music-token"],
      })
    );
    if (Object.keys(token).length > 0 && Object.keys(uid).length > 0) {
      return true;
    }
    await chrome.runtime.sendMessage({ code: "request_token" });
  } catch (error) {
    return false;
  }
};
