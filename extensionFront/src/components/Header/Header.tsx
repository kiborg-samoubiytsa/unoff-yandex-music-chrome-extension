import { Link } from "react-router-dom";
import { FC, useState } from "react";
import "./Header.scss";
import { MdOutlineExitToApp } from "react-icons/md";
import { AiOutlineSearch } from "react-icons/ai";
import { IconContext } from "react-icons";
import { Search } from "./Search/Search";

interface Props {
  setShowExitConfirm: React.Dispatch<React.SetStateAction<boolean>>;
}

const Header: FC<Props> = ({ setShowExitConfirm }) => {
  const toggleShowExitConfirm = () => {
    setShowExitConfirm(true);
  };

  const [isSearchEnabled, setIsSearchEnabled] = useState<boolean>(false);

  return (
    <nav className="header">
      <div className="contentContainer">
        {isSearchEnabled ? (
          <>
            <div
              onClick={() => setIsSearchEnabled(true)}
              className="enable_search"
            >
              <AiOutlineSearch className="enable_search-button" />
            </div>
            <Search setIsSearchEnabled={setIsSearchEnabled} />
          </>
        ) : (
          <>
            <div
              onClick={() => setIsSearchEnabled(true)}
              className="enable_search"
            >
              <AiOutlineSearch className="enable_search-button" />
            </div>
            <div className="exitButtonContainer">
              <IconContext.Provider value={{ size: "24" }}>
                <MdOutlineExitToApp
                  onClick={toggleShowExitConfirm}
                  className="exitButton"
                />
              </IconContext.Provider>
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default Header;
