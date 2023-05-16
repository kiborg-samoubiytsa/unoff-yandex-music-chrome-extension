import { FC, useEffect } from "react";
import { AlbumWithTracks } from "../../../types/types";
import "../Sidebar.scss";
import trackStyles from "../../Track/SidebarTrack.module.scss";
import Track from "../../Track/Track";
import { concatArtistNames } from "../../../helpers/concatArtistNames";
import CloseButton from "../CloseButton";

interface Props {
  album: AlbumWithTracks;
}

export const AlbumSidebar: FC<Props> = ({ album }) => {
  const volumes = album.volumes;

  useEffect(() => {
    console.log(1);
  }, []);

  return (
    <>
      <div>
        <div className="playlist">
          <CloseButton />
          <div className="sidebar_collectionCover">
            <img
              src={`https://${album?.coverUri.replace("%%", "100x100")}`}
              alt="cover"
            ></img>
          </div>
          <div className="sidebar_collectionInfo">
            <span className="sidebar_collectionTitle">{album.title}</span>
            <div className="sidebar_collectionOwner">
              <span className="defaultText">Автор: </span>
              {concatArtistNames(album.artists)}
            </div>
          </div>
        </div>
        <div className="sidebar_tracks">
          {volumes.map((volume, i) => (
            <div className="sidebar_tracks" key={i}>
              {volume.map((track, index) =>
                track.available ? ( //displays track only if its available
                  <Track
                    showCover={false}
                    index={index}
                    key={index}
                    styles={trackStyles}
                    collection={album}
                    track={track}
                    collectionType="album"
                  ></Track>
                ) : (
                  <div key={index}></div>
                )
              )}
            </div>
          ))}
        </div>
      </div>
      <>
        {/* <div>
      <div className="playlist">
        <span className="sidebar_collectionTitle">{album.title}</span>
        <div className="sidebar_collectionOwner">
          <span className="defaultText">Исполнитель: </span>
          {concatArtistNames(album.artists)}
        </div>
      </div>
      

      {volumes.map((volume, i) => (
        <div className="sidebar_tracks" key={i}>
          {volume.map((track, index) =>
            track.available ? ( //displays track only if its available
              <Track
                title={track.title}
                id={track.id}
                index={index}
                key={index}
                duration={track.durationMs}
                styles={trackStyles}
                collection={album}
                albumId={album.id}
                collectionType="album"
              ></Track>
            ) : (
              <div key={index}></div>
            )
          )}
        </div>
      ))}
      <CloseButton />
    </div> */}
      </>
    </>
  );
};
