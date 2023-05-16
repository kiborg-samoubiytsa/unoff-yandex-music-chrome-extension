import { useEffect, FC } from "react";
import { useDispatch, useSelector } from "react-redux";
import useFetch from "../../hooks/useFetch";
import { AppDispatch } from "../../store/store";
import { favoriteTrackIds } from "../../store/reducers/favoriteTracksSlice";
import { Album } from "../../types/types";
import { fetchFavoriteTracks } from "../../store/reducers/favoriteTracksSlice";
import { NavigationButtons } from "../pages/NavigationButtons/NavigationButtons";
import "./Collection.scss";
import { _navigationStyles } from "../../store/reducers/navigationSlice";
import { AlbumCover } from "../CollectionCovers/AlbumCover";

export const UserPodcasts: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const favoriteTracks = useSelector(favoriteTrackIds);
  const navigationStyles = useSelector(_navigationStyles);
  const userData = JSON.parse(localStorage.getItem("user-data") || "");
  const localStoragePodcasts = localStorage.getItem("user-podcasts")
    ? JSON.parse(localStorage.getItem("user-podcasts") || "")
    : [];
  const { data, error } = useFetch<Album[]>(
    `https://zvuk-ponosa.glitch.me/api/user-albums/podcasts/uid=${userData.uid}/token=${userData.token}`
  );
  useEffect(() => {
    if (favoriteTracks.length == 0) {
      dispatch(fetchFavoriteTracks());
    }
  }, []);
  useEffect(() => {
    if (data != localStoragePodcasts && data) {
      localStorage.setItem("user-podcasts", JSON.stringify(data));
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
        back={{ page: "albums", description: "Альбомы" }}
        forward={{ page: "playlists", description: "Плейлисты" }}
      />
      <span
        className="collectionInfo"
        style={{ fontSize: 20, marginBottom: 14 }}
      >
        Аудиокниги и Подкасты
      </span>
      <div className="userCollection">
        {!error ? (
          (localStoragePodcasts.length > 0 && data == localStoragePodcasts) ||
          !data ? (
            localStoragePodcasts.map((album: Album, index: number) =>
              album ? (
                <AlbumCover
                  index={index}
                  key={index}
                  albumInfo={album}
                  metadata="web-own_podcasts-album-track-fridge"
                />
              ) : (
                <></>
              )
            )
          ) : (
            data?.map((album: Album, index: number) =>
              album ? (
                <AlbumCover
                  index={index}
                  key={index}
                  albumInfo={album}
                  metadata="web-own_podcasts-album-track-fridge"
                />
              ) : (
                <></>
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
