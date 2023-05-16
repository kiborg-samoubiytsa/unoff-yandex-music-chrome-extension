import { FC } from "react";
import { Link } from "react-router-dom";
import { MdArrowBackIos } from "react-icons/md";
import { setNavigationStyle } from "../../../store/reducers/navigationSlice";
import { useDispatch } from "react-redux";

interface Props {
  page: string;
  description: string;
}

export const NavigationBack: FC<Props> = ({ description, page }) => {
  const dispatch = useDispatch();
  const userData = JSON.parse(localStorage.getItem("user-data") || "");

  return (
    <div
      onClick={() => {
        dispatch(setNavigationStyle("back"));
      }}
    >
      <Link
        to={`/users/${userData.uid}/${page}/`}
        className="navigationButton"
        onClick={() => {
          setNavigationStyle("back");
        }}
      >
        <MdArrowBackIos />
        <div className="navigationDescription">{description}</div>
      </Link>
    </div>
  );
};
