import axios from "axios";
import { Album, IPlaylist, AlbumWithTracks } from "../types/types";
export const getQueueFromCollection = async (
  type: "album" | "playlist",
  collection: Album | IPlaylist
): Promise<AlbumWithTracks | IPlaylist> => {
  const userData = JSON.parse(localStorage.getItem("user-data") || "");
  const url =
    type == "album"
      ? `https://zvuk-ponosa.glitch.me/api/album/with-tracks/id=/${
          (collection as Album).id
        }/token=${userData.token}`
      : `https://zvuk-ponosa.glitch.me/api/playlists/info/user=${
          (collection as IPlaylist).owner.login
        }/kind=${(collection as IPlaylist).kind}/token=${userData.token}/`;

  const { data } = await axios.get(url);

  return data;
};
