import { FC } from "react";
import { useDispatch } from "react-redux";
import { setSelectedItemType } from "../../store/reducers/selectedItemSlice";
import { IconContext } from "react-icons";
import { AiOutlineClose } from "react-icons/ai";

interface Props {
  setIsQueueDisplayed: React.Dispatch<React.SetStateAction<boolean>>;
}

export const CloseButton: FC<Props> = ({ setIsQueueDisplayed }) => {
  const dispatch = useDispatch();
  const hideCurrentQueue = () => {
    dispatch(setSelectedItemType("not-selected"));
    setIsQueueDisplayed(false);
  };
  return (
    <div className="closeButton">
      <IconContext.Provider value={{ size: "23" }}>
        <AiOutlineClose onClick={hideCurrentQueue} />
      </IconContext.Provider>
    </div>
  );
};
