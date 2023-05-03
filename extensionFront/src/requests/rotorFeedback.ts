import axios from "axios";
import { IPlaylist, IRotorTrack } from "../types/types";
export const sendRotorFeedBack = async (
  type: "trackStarted" | "skip" | "like" | "trackFinished" | "radioStarted",
  from: string,
  track?: string,
  playedSeconds?: number
) => {
  const now = new Date();
  const userData = JSON.parse(localStorage.getItem("user-data") || "");
  if ((type == "trackStarted" || type == "like") && track) {
    await axios.post(
      `https://zvuk-ponosa.glitch.me/api/rotor/feedback/token=${userData.token}`,
      {
        trackId: track,
        type: type,
        timestamp: now.toISOString(),
      }
    );
  }
  if ((type == "skip" || type == "trackFinished") && track) {
    await axios.post(
      `https://zvuk-ponosa.glitch.me/api/rotor/feedback/token=${userData.token}`,
      {
        trackId: track,
        type: type,
        totalPlayedSeconds: playedSeconds,
        timestamp: now.toISOString(),
      }
    );
  }
  if (type == "radioStarted") {
    await axios.post(
      `https://zvuk-ponosa.glitch.me/api/rotor/feedback/token=${userData.token}`,
      {
        type: type,
        from: from,
        timestamp: now.toISOString(),
      }
    );
  }
};
