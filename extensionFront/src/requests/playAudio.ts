import axios from "axios";

interface playAudioParams {
  "track-id": string | number | undefined;
  from: string;
  "album-id": string | number | undefined;
  "play-id": string;
  "track-length-seconds": number;
  "total-played-seconds": number;
  "end-position-seconds": number | undefined;
  "playlist-id"?: string;
}

export const playAudio = async (request: playAudioParams) => {
  const userData = JSON.parse(localStorage.getItem("user-data") || "");
  await axios.post(
    `https://zvuk-ponosa.glitch.me/api/play-audio/uid=${userData.uid}/token=${userData.token}`,
    request
  );
};
