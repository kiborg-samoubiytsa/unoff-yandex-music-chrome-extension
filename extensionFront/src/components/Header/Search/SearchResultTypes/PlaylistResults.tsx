import { FC, useLayoutEffect, useRef, useState } from "react";
import { Track as ITrack } from "../../../../types/types";
import Track from "../../../Track/Track";
import styles from "../../../Track/PageTrack.module.scss";
import { MdKeyboardArrowDown } from "react-icons/md";
import { IconContext } from "react-icons";
import { gsap } from "gsap";
import "./SearchTypeResult.scss";

interface Props {
  trackArray: ITrack[];
}

export const TrackResults: FC<Props> = ({ trackArray }) => {
  const itemListRef = useRef<HTMLDivElement>(null);
  const [isListDisplayed, setIsListDisplayed] = useState<boolean>(false);
  useLayoutEffect(() => {
    console.log(itemListRef.current);
  }, []);
  const handleDropdownToggle = () => {
    isListDisplayed
      ? gsap.to(itemListRef.current, { height: "140px", duration: 0.8 })
      : gsap.to(itemListRef.current, { height: "auto", duration: 0.8 });
    setIsListDisplayed(!isListDisplayed);
  };

  return (
    <div className="search_results_item_type">
      <div className="search_results_item_text">
        <span className="defaultText" style={{ marginLeft: 15 }}>
          Треки
        </span>
        <IconContext.Provider value={{ size: "24px" }}>
          {trackArray.length > 3 ? (
            <MdKeyboardArrowDown
              className="expand_result_button"
              onClick={handleDropdownToggle}
            ></MdKeyboardArrowDown>
          ) : (
            <></>
          )}
        </IconContext.Provider>
      </div>
      <div className="search_results_item" ref={itemListRef}>
        {trackArray.map((track, index) => (
          <Track
            showCover={true}
            key={index}
            index={index}
            track={track}
            collectionType="track"
            styles={styles}
            collection={trackArray}
          />
        ))}
      </div>
    </div>
  );
};
