import { FC } from "react";
import "./ExitConfirm.scss";

interface Props {
  setShowExitConfirm: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ExitConfirm: FC<Props> = ({ setShowExitConfirm }) => {
  const handleAccountExit = async () => {
    localStorage.removeItem("user-data");
    localStorage.removeItem("user-playlists");
    localStorage.removeItem("user-albums");
    localStorage.removeItem("user-podcasts");
    await chrome.runtime.sendMessage({
      state: "paused",
    });
    window.location.reload();
  };
  return (
    <>
      <div className="exit_confirm_container">
        <div className="exit_confirm">
          <span className="exit_confirm_text">Точно выйти?</span>
          <div className="exit_confirm_buttons">
            <button
              className="exit_confirm_button-confirm"
              onClick={handleAccountExit}
            >
              Да
            </button>
            <button
              className="exit_confirm_button-cancel"
              onClick={() => setShowExitConfirm(false)}
            >
              Нет
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
