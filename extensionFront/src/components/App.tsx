import { FC, useEffect, useState } from "react";
import "./App.scss";
import "../_global.scss";
import Player from "./YMPlayer/Player";
import { Provider } from "react-redux";
import { store } from "../store/store";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useParams,
} from "react-router-dom";
import { UserPlaylistsPage } from "./pages/UserPlaylistsPage";
import Header from "./Header/Header";
import CurrentQueuePage from "./CurrentQueue/CurrentQueue";
import { Auth } from "./pages/Auth/Auth";
import { UserAlbumsPage } from "./pages/UserAlbumsPage";
import { UserPodcastsPage } from "./pages/UserPodcastsPage";
import { ExitConfirm } from "./ExitConfirm/ExitConfirm";
const App: FC = () => {
  //TODO менять текущий плейлист только по нажатию на трек
  const [isQueueDisplayed, setIsQueueDisplayed] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  console.log(window.location);

  useEffect(() => {
    (async () => {
      await chrome.runtime.sendMessage({ app: "init" });
    })();
  }, []);
  return (
    <>
      <Provider store={store}>
        {localStorage.getItem("user-data") ? (
          <Router>
            {showExitConfirm ? (
              <ExitConfirm setShowExitConfirm={setShowExitConfirm} />
            ) : (
              <></>
            )}
            <Header setShowExitConfirm={setShowExitConfirm} />
            {isQueueDisplayed ? (
              <div>
                <CurrentQueuePage setIsQueueDisplayed={setIsQueueDisplayed} />
              </div>
            ) : (
              <div className="Content">
                <Routes>
                  <Route
                    path=":id/index.html"
                    element={<UserPlaylistsPage />}
                  ></Route>
                  <Route path="users/">
                    <Route
                      path=":userId/playlists"
                      element={<UserPlaylistsPage />}
                    />
                    <Route
                      path=":userId/albums"
                      element={<UserAlbumsPage />}
                    ></Route>
                    <Route
                      path=":userId/podcasts"
                      element={<UserPodcastsPage />}
                    ></Route>
                    <Route />
                  </Route>
                </Routes>
              </div>
            )}
            <div className="Player-Container">
              <Player
                isQueueDisplayed={isQueueDisplayed}
                setIsQueueDisplayed={setIsQueueDisplayed}
              />
            </div>
          </Router>
        ) : (
          <Auth />
        )}
      </Provider>
    </>
  );
};

export default App;
