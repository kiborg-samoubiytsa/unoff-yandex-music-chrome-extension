import { FC, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import useFetch from "../../hooks/useFetch";
import {
  fetchFavoriteTracks,
  favoriteTrackIds,
} from "../../store/reducers/favoriteTracksSlice";
import { AppDispatch } from "../../store/store";
import { IPlaylist } from "../../types/types";
import { PlaylistCover } from "../CollectionCovers/PlaylistCover";
import { NavigationButtons } from "../pages/NavigationButtons/NavigationButtons";
import "./Collection.scss";

export const UserPlaylists: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const favoriteTracks = useSelector(favoriteTrackIds);
  const localStoragePlaylists = localStorage.getItem("user-playlists")
    ? JSON.parse(localStorage.getItem("user-playlists") || "")
    : [];
  const userData = JSON.parse(localStorage.getItem("user-data") || "");
  const { data, error } = useFetch<IPlaylist[]>(
    `https://zvuk-ponosa.glitch.me/api/user-playlists/uid=${userData.uid}/token=${userData.token}`
  );
  useEffect(() => {
    if (data != localStoragePlaylists && data) {
      localStorage.setItem("user-playlists", JSON.stringify(data));
      console.log(data);
    }
  }, [data]);
  useEffect(() => {
    if (favoriteTracks.length == 0) {
      dispatch(fetchFavoriteTracks());
    }
  }, []);

  return (
    <>
      <div className="userCollectionContainer">
        <NavigationButtons
          back={{ page: "podcasts", description: "Подкасты" }}
          forward={{ page: "albums", description: "Альбомы" }}
        />
        <span className="collectionInfo">Плейлисты</span>
        <div className="userCollection">
          {!error ? (
            (localStoragePlaylists.length > 0 &&
              data == localStoragePlaylists) ||
            !data ? (
              localStoragePlaylists?.map(
                (playlist: IPlaylist, index: number) => (
                  <PlaylistCover
                    index={index}
                    key={index}
                    playlistInfo={playlist}
                    metadata="web-own_playlists-playlist-track-fridge"
                  />
                )
              )
            ) : (
              data?.map((playlist, index) => (
                <PlaylistCover
                  index={index}
                  key={index}
                  playlistInfo={playlist}
                  metadata="web-own_playlists-playlist-track-fridge"
                />
              ))
            )
          ) : (
            <></>
          )}
        </div>
      </div>
    </>
  );
};
