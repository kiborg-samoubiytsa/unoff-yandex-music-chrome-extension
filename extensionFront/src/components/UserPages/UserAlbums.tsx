import { AlbumCover } from "../CollectionCovers/AlbumCover";
import useFetch from "../../hooks/useFetch";
import { FC, useEffect } from "react";
import { Album } from "../../types/types";
import { useDispatch, useSelector } from "react-redux";
import "./Collection.scss";
import {
  favoriteTrackIds,
  fetchFavoriteTracks,
} from "../../store/reducers/favoriteTracksSlice";
import { AppDispatch } from "../../store/store";
import { NavigationButtons } from "../pages/NavigationButtons/NavigationButtons";
import { _navigationStyles } from "../../store/reducers/navigationSlice";

export const UserAlbums: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const favoriteTracks = useSelector(favoriteTrackIds);
  const navigationStyles = useSelector(_navigationStyles);
  const userData = JSON.parse(localStorage.getItem("user-data") || "");
  const localStorageAlbums = localStorage.getItem("user-albums")
    ? JSON.parse(localStorage.getItem("user-albums") || "")
    : [];
  const { data, error } = useFetch<Album[]>(
    `https://zvuk-ponosa.glitch.me/api/user-albums/uid=${userData.uid}/token=${userData.token}`
  );
  useEffect(() => {
    if (favoriteTracks.length == 0) {
      dispatch(fetchFavoriteTracks());
    }
  }, []);
  useEffect(() => {
    if (data != localStorageAlbums && data) {
      localStorage.setItem("user-albums", JSON.stringify(data));
      console.log(data);
    }
  }, [data]);

  useEffect(() => {
    console.log(navigationStyles);
  }, [navigationStyles]);
  return (
    <div
      className={
        navigationStyles == "back"
          ? "userCollectionContainer-back"
          : "userCollectionContainer-forward"
      }
    >
      <NavigationButtons
        back={{ page: "playlists", description: "Плейлисты" }}
        forward={{ page: "podcasts", description: "Подкасты" }}
      />
      <span className="collectionInfo">Альбомы</span>
      <div className="userCollection">
        {!error ? (
          (localStorageAlbums.length != 0 && data == localStorageAlbums) ||
          !data ? (
            localStorageAlbums.map((album: Album, index: number) =>
              album ? (
                <AlbumCover
                  key={index}
                  albumInfo={album}
                  index={index}
                  metadata="web-own_albums-album-track-fridge"
                />
              ) : (
                <div key={index}></div>
              )
            )
          ) : (
            data?.map((album: Album, index) =>
              album ? (
                <AlbumCover
                  index={index}
                  key={index}
                  albumInfo={album}
                  metadata="web-own_albums-album-track-fridge"
                />
              ) : (
                <div key={index}></div>
              )
            )
          )
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};
