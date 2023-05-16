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
  const arrowRef = useRef<HTMLDivElement>(null);
  const [isListDisplayed, setIsListDisplayed] = useState<boolean>(false);
  useLayoutEffect(() => {
    console.log(itemListRef.current);
  }, []);
  const handleDropdownToggle = () => {
    if (isListDisplayed) {
      gsap.to(arrowRef.current, {
        transformBox: "fill-box",
        rotation: 180,
        transformOrigin: "50% 50%",
        y: "-2px",
        duration: 0.8,
      });
      gsap.to(itemListRef.current, { height: "140px", duration: 1.2 });
    } else {
      gsap.to(arrowRef.current, {
        transformBox: "fill-box",
        rotation: 0,
        transformOrigin: "50% 50%",
        y: "2px",
        duration: 0.8,
      });
      gsap.to(itemListRef.current, { height: "auto", duration: 1.2 });
    }
    setIsListDisplayed(!isListDisplayed);
  };

  return (
    <div className="search_results_item_type">
      <div className="search_results_item_text">
        <span className="defaultText" style={{ marginLeft: 15 }}>
          Треки
        </span>
        <div ref={arrowRef} className="expand_result_button">
          <IconContext.Provider value={{ size: "24px" }}>
            {trackArray.length > 3 ? (
              <MdKeyboardArrowDown
                onClick={handleDropdownToggle}
              ></MdKeyboardArrowDown>
            ) : (
              <></>
            )}
          </IconContext.Provider>
        </div>
      </div>
      <div className="search_results_items" ref={itemListRef}>
        {trackArray.map((track, index) => (
          <div className="search_results_item">
            <Track
              showCover={true}
              track={track}
              key={index}
              index={index}
              collectionType="track"
              styles={styles}
              collection={trackArray}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
