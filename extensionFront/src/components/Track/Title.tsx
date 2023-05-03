import { FC } from "react";
interface Props {
  styles: {
    name: string;
    title: string;
  };
  title: string;
}

const Title: FC<Props> = ({ styles, title }) => {
  return (
    <div className={styles.title}>
      <span>{title}</span>
    </div>
  );
};

export default Title;
