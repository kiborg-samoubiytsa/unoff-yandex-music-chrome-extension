import React, { useState, useRef, useEffect, FC } from "react";
import "./Search.scss";
import { SearchResults } from "./SearchResults";
import { AiOutlineClose, AiOutlineSearch } from "react-icons/ai";
import { IconContext } from "react-icons";

interface Props {
  isSearchEnabled: boolean;
  setIsSearchEnabled: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Search: FC<Props> = ({ isSearchEnabled, setIsSearchEnabled }) => {
  const [isSearchFocused, setIsSearchFocused] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>("");

  const debounceTimeoutRef = useRef<NodeJS.Timeout>(null);

  const toggleInputFocus = () => {
    setIsSearchFocused(true);
  };

  const changeTextDebounced = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    const timeout = setTimeout(() => setSearchText(e.target.value), 1000);
    debounceTimeoutRef.current = timeout;
  };

  useEffect(() => {
    console.log(searchText);
  }, [searchText]);

  return (
    <div className="search_container">
      <div className="search">
        <IconContext.Provider value={{ size: "24px" }}>
          <div className="enable_search-button">
            <AiOutlineSearch className="enable_search-button" />
          </div>
          <input
            type="text"
            placeholder="Поиск"
            className={isSearchFocused ? "search_input-active" : "search_input"}
            onFocus={toggleInputFocus}
            onChange={(e) => changeTextDebounced(e)}
          />
          <div>
            <AiOutlineClose
              onClick={() => setIsSearchEnabled(false)}
              className="disable_search-button"
            />
          </div>
        </IconContext.Provider>
      </div>
      <SearchResults searchText={searchText} showResults={isSearchFocused} />
    </div>
  );
};
