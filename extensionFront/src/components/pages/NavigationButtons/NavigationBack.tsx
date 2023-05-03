import { FC } from "react";
import { Link } from "react-router-dom";
import { MdArrowBackIos } from "react-icons/md";
import { IconContext } from "react-icons";

interface Props {
  page: string;
  description: string;
}

export const NavigationBack: FC<Props> = ({ description, page }) => {
  const userData = JSON.parse(localStorage.getItem("user-data") || "");
  return (
    <Link to={`/users/${userData.uid}/${page}/`} className="navigationButton">
      <MdArrowBackIos />
      <div className="navigationDescription">{description}</div>
    </Link>
  );
};
