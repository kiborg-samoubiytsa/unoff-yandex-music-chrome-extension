import { IPlaylist, Track } from "../types/types";
import { playAudio } from "./playAudio";

export const startAudioRequest = async (
  track: Track,
  playId: string,
  metadata: string,
  playlist?: IPlaylist
) => {
  const totalSeconds = track.durationMs / 1000 || 0;
  if (playlist) {
    await playAudio({
      from: metadata || "web-own_playlists-playlist-track-fridge",
      "track-id": track.id || 0,
      "album-id": track.albums[0].id,
      "play-id": playId,
      "track-length-seconds": totalSeconds,
      "total-played-seconds": 0,
      "end-position-seconds": 0,
      "playlist-id": `${playlist.owner.uid}:${playlist.kind}`,
    });
  } else
    await playAudio({
      from: metadata || "web-own_playlists-playlist-track-fridge",
      "track-id": track.id || 0,
      "album-id": track.albums[0].id,
      "play-id": playId,
      "track-length-seconds": totalSeconds,
      "total-played-seconds": 0,
      "end-position-seconds": 0,
    });
};
