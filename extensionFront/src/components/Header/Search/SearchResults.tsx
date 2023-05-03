import { FC, useEffect, useState } from "react";
import axios from "axios";
import { SearchResponse } from "../../../types/types";
import "./SearchResults.scss";
import { TrackResults } from "./SearchResultTypes/TrackResults";

interface Props {
  searchText: string;
  showResults: boolean;
}

export const SearchResults: FC<Props> = ({ searchText, showResults }) => {
  const userData = JSON.parse(localStorage.getItem("user-data") || "");
  const [data, setData] = useState<SearchResponse>({} as SearchResponse);

  useEffect(() => {
    (async () => {
      if (searchText.length > 0) {
        const { data: searchData } = await axios.get(
          `https://zvuk-ponosa.glitch.me/api/search/text=${searchText}/token=${userData.token}`
        );
        setData(searchData as SearchResponse);
      }
    })();
  }, [searchText]);

  return (
    <>
      {showResults && Object.keys(data).length > 0 ? (
        <div className="search_results">
          {data.tracks ? (
            <TrackResults trackArray={data?.tracks.results} />
          ) : (
            <></>
          )}
        </div>
      ) : (
        <></>
      )}
    </>
  );
};
