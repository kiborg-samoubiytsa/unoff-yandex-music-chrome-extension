import { FC } from "react";
import { concatArtistNames } from "../../helpers/concatArtistNames";
import { IArtist } from "../../types/types";

interface Props {
  artists: IArtist[];
  styles: {
    artist: string;
  };
}

const Artist: FC<Props> = ({ artists, styles }) => {
  return (
    <div className={styles.artist}>
      <span>{concatArtistNames(artists)}</span>
    </div>
  );
};

export default Artist;
