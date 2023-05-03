import { FC, useEffect } from "react";
import { IPlaylist, PlaylistTrack } from "../../../types/types";
import Track from "../../Track/Track";
import "../Sidebar.scss";
import trackStyles from "../../Track/SidebarTrack.module.scss";
import CloseButton from "../CloseButton";
import { covers } from "../../../img/coverStocks/allDefaultCovers";

interface Props {
  playlist: IPlaylist;
}

export const PlaylistSidebar: FC<Props> = ({ playlist }) => {
  const artists =
    playlist.tracks?.map((track: PlaylistTrack) => {
      return track.track.artists;
    }) || [];
  const tracks = playlist.tracks;

  useEffect(() => {
    console.log(2);
  }, []);

  return (
    <div>
      <div className="playlist">
        <CloseButton />
        <div className="sidebar_collectionCover">
          {playlist?.cover.itemsUri?.length &&
          playlist.cover.type == "mosaic" ? (
            playlist?.cover.itemsUri?.length >= 4 ? (
              <div className="coverGrid">
                {playlist?.cover.itemsUri?.map((item, index) => (
                  <img
                    key={index}
                    src={`https://${item.replace("%%", "50x50")}`}
                    alt="cover"
                  />
                ))}
              </div>
            ) : (
              <img
                src={`https://${playlist?.cover.itemsUri[0].replace(
                  "%%",
                  "100x100"
                )}`}
                alt="cover"
              ></img>
            )
          ) : playlist?.cover.uri ? (
            <img
              src={`https://${playlist?.cover.uri.replace("%%", "100x100")}`}
              alt="cover"
            ></img>
          ) : (
            <img
              src={covers[Math.floor(Math.random() * covers.length)]}
              alt="cover"
            ></img>
          )}
        </div>
        <div className="sidebar_collectionInfo">
          <span className="sidebar_collectionTitle">
            {
              playlist.kind != 3
                ? playlist.title
                : "Мне нравится" /* kind 3 is user's favourites*/
            }
          </span>
          <div className="sidebar_collectionOwner">
            <span className="defaultText">Автор: </span>
            {playlist.owner.name}
          </div>
        </div>
      </div>
      <div className="sidebar_tracks">
        {tracks!.map(
          (
            track: PlaylistTrack,
            index: number //displays track only if its available
          ) => (
            <Track
              title={track.track.title}
              id={track.track.id}
              collection={playlist}
              index={index}
              key={index}
              artists={artists[index]}
              duration={track.track.durationMs}
              styles={trackStyles}
              albumId={
                track.track.albums.length > 0 ? track.track.albums[0].id : 0
              }
              collectionType="playlist"
            ></Track>
          )
        )}
      </div>
    </div>
  );
};
