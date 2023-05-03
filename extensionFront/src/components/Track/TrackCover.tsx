import { FC } from "react";

interface Props {
  imageUrl: string;
  styles: any;
}

export const TrackCover: FC<Props> = ({ imageUrl, styles }) => {
  return <img className={styles.cover} src={imageUrl} alt="" />;
};
