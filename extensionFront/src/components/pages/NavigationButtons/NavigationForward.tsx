import { FC } from "react";
import { Link } from "react-router-dom";
import { MdArrowForwardIos } from "react-icons/md";
import { IconContext } from "react-icons";
import { setNavigationStyle } from "../../../store/reducers/navigationSlice";
import { useDispatch } from "react-redux";

interface Props {
  page: string;
  description: string;
}

export const NavigationForward: FC<Props> = ({ description, page }) => {
  const dispatch = useDispatch();
  const userData = JSON.parse(localStorage.getItem("user-data") || "");
  return (
    <div onClick={() => dispatch(setNavigationStyle("forward"))}>
      <Link to={`/users/${userData.uid}/${page}/`} className="navigationButton">
        <div className="navigationDescription">{description}</div>
        <MdArrowForwardIos />
      </Link>
    </div>
  );
};
