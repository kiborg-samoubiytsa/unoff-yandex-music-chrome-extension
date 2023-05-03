import { FC } from "react";
import { durationToMinutes } from "../../helpers/durationToMinutes";
interface Props {
  duration: number;
  styles: {
    duration: string;
  };
}

const Duration: FC<Props> = ({ duration, styles }) => {
  return <div className={styles.duration}>{durationToMinutes(duration)}</div>;
};

export default Duration;
