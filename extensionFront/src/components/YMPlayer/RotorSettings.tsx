import { FC, useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { rotorSettingsChange } from "../../requests/rotorSettingsChange";
import {
  currentStation as station,
  rotorSettings as settings,
  settingsStyles,
  setSettingsStyles,
  selectorTitles as titles,
  setSettingsValues,
  setSelectorTitles,
  fetchRotorQueue,
} from "../../store/reducers/rotorSlice";
import styles from "./RotorSettings.module.scss";
import classnames from "classnames";
import { RotorSettings2 } from "../../types/types";
import { AppDispatch } from "../../store/store";

interface Props {
  styles: {
    moodSelector: React.CSSProperties;
    diversitySelector: React.CSSProperties;
    languageSelector: React.CSSProperties;
  };
}

export const RotorSettings: FC = () => {
  const rotorSettings = useSelector(settings);
  const isInitialRender = useRef<boolean>(true);
  const dispatch = useDispatch<AppDispatch>();
  const selectorStyles = useSelector(settingsStyles);
  const selectorTitles = useSelector(titles);
  const currentStation = useSelector(station);

  //Mood selection
  //Language selection
  const handleMoodChange = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    dispatch(
      setSettingsValues({
        ...rotorSettings,
        moodEnergy:
          e.currentTarget.attributes.getNamedItem("data-value")!.value,
      })
    );
    dispatch(
      setSelectorTitles({
        ...selectorTitles,
        moodSelector: e.currentTarget.textContent,
      })
    );
    dispatch(fetchRotorQueue());
    isInitialRender.current = false;
  };

  const handleDiversityChange = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    dispatch(
      setSettingsValues({
        ...rotorSettings,
        diversity: e.currentTarget.attributes.getNamedItem("data-value")!.value,
      })
    );
    dispatch(
      setSelectorTitles({
        ...selectorTitles,
        diversitySelector: e.currentTarget.textContent,
      })
    );
    dispatch(fetchRotorQueue());
    isInitialRender.current = false;
  };

  const handleLanguageChange = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    dispatch(
      setSettingsValues({
        ...rotorSettings,
        language: e.currentTarget.attributes.getNamedItem("data-value")!.value,
      })
    );
    dispatch(
      setSelectorTitles({
        ...selectorTitles,
        languageSelector: e.currentTarget.textContent,
      })
    );
    dispatch(fetchRotorQueue());
    isInitialRender.current = false;
  };

  useEffect(() => {
    if (
      rotorSettings.moodEnergy &&
      rotorSettings.language &&
      rotorSettings.diversity &&
      !isInitialRender.current
    ) {
      rotorSettingsChange(
        {
          diversity: rotorSettings.diversity,
          moodEnergy: rotorSettings.moodEnergy,
          language: rotorSettings.language,
        },
        currentStation
      );
    }
  }, [rotorSettings]);

  return (
    <div className={styles.rotorSettingsContainer}>
      <div className={styles.stationName}>Моя волна</div>
      <span className={styles.settingsTitle}>Под настроение</span>
      <div className={classnames(styles.settings, styles.mood)}>
        <div
          data-value="active"
          className={styles.radioButton}
          onClick={(e) => {
            handleMoodChange(e);
            dispatch(
              setSettingsStyles({
                ...selectorStyles,
                moodSelector: {
                  width: "100px",
                  transition: "transform 0.3s ease-out 0s",
                },
              })
            );
          }}
        >
          Бодрое
        </div>
        <div
          data-value="fun"
          className={styles.radioButton}
          onClick={(e) => {
            handleMoodChange(e);
            dispatch(
              setSettingsStyles({
                ...selectorStyles,
                moodSelector: {
                  width: "100px",
                  transform: "translateX(100%)",
                  transition: "transform 0.3s ease-out 0s",
                },
              })
            );
          }}
        >
          Весёлое
        </div>
        <div
          data-value="calm"
          className={styles.radioButton}
          onClick={(e) => {
            handleMoodChange(e);
            dispatch(
              setSettingsStyles({
                ...selectorStyles,
                moodSelector: {
                  width: "100px",
                  transform: "translateX(200%)",
                  transition: "transform 0.3s ease-out 0s",
                },
              })
            );
          }}
        >
          Спокойное
        </div>
        <div
          data-value="sad"
          className={styles.radioButton}
          onClick={(e) => {
            handleMoodChange(e);
            dispatch(
              setSettingsStyles({
                ...selectorStyles,
                moodSelector: {
                  width: "100px",
                  transform: "translateX(300%)",
                  transition: "transform 0.3s ease-out 0s",
                },
              })
            );
          }}
        >
          Грустное
        </div>
        <div
          data-value="all"
          className={styles.radioButton}
          onClick={(e) => {
            handleMoodChange(e);
            dispatch(
              setSettingsStyles({
                ...selectorStyles,
                moodSelector: {
                  width: "100px",
                  transform: "translateX(400%)",
                  transition: "transform 0.3s ease-out 0s",
                },
              })
            );
          }}
        >
          Любое
        </div>
        <div className={styles.selector} style={selectorStyles.moodSelector}>
          {selectorTitles.moodSelector}
        </div>
      </div>
      {currentStation == "user:onyourwave" ? (
        <div>
          <span className={styles.settingsTitle}>По характеру</span>
          <div className={classnames(styles.settings, styles.diversity)}>
            <div
              data-value="favorite"
              className={styles.radioButton}
              onClick={(e) => {
                handleDiversityChange(e);
                dispatch(
                  setSettingsStyles({
                    ...selectorStyles,
                    diversitySelector: {
                      width: "125px",
                      transition: "transform 0.3s ease-out 0s",
                    },
                  })
                );
              }}
            >
              Любимое
            </div>
            <div
              data-value="discover"
              className={styles.radioButton}
              onClick={(e) => {
                handleDiversityChange(e);
                dispatch(
                  setSettingsStyles({
                    ...selectorStyles,
                    diversitySelector: {
                      width: "125px",
                      transform: "translateX(100%)",
                      transition: "transform 0.3s ease-out 0s",
                    },
                  })
                );
              }}
            >
              Незнакомое
            </div>
            <div
              data-value="popular"
              className={styles.radioButton}
              onClick={(e) => {
                handleDiversityChange(e);
                dispatch(
                  setSettingsStyles({
                    ...selectorStyles,
                    diversitySelector: {
                      width: "125px",
                      transform: "translateX(200%)",
                      transition: "transform 0.3s ease-out 0s",
                    },
                  })
                );
              }}
            >
              Популярное
            </div>
            <div
              data-value="default"
              className={styles.radioButton}
              onClick={(e) => {
                handleDiversityChange(e);
                dispatch(
                  setSettingsStyles({
                    ...selectorStyles,
                    diversitySelector: {
                      width: "125px",
                      transform: "translateX(300%)",
                      transition: "transform 0.3s ease-out 0s",
                    },
                  })
                );
              }}
            >
              Любое
            </div>
            <div
              className={styles.selector}
              style={selectorStyles.diversitySelector}
            >
              {selectorTitles.diversitySelector}
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
      <span className={styles.settingsTitle}>По языку</span>
      <div className={classnames(styles.settings, styles.language)}>
        <div
          data-value="russian"
          className={styles.radioButton}
          onClick={(e) => {
            handleLanguageChange(e);
            dispatch(
              setSettingsStyles({
                ...selectorStyles,
                languageSelector: {
                  width: "150px",
                  transition: "transform 0.3s ease-out 0s",
                },
              })
            );
          }}
        >
          Русский
        </div>
        <div
          data-value="not-russian"
          className={styles.radioButton}
          onClick={(e) => {
            handleLanguageChange(e);
            dispatch(
              setSettingsStyles({
                ...selectorStyles,
                languageSelector: {
                  width: "150px",
                  transform: "translateX(100%)",
                  transition: "transform 0.3s ease-out 0s",
                },
              })
            );
          }}
        >
          Иностранный
        </div>
        <div
          data-value="any"
          className={styles.radioButton}
          onClick={(e) => {
            handleLanguageChange(e);
            dispatch(
              setSettingsStyles({
                ...selectorStyles,
                languageSelector: {
                  width: "150px",
                  transform: "translateX(200%)",
                  transition: "transform 0.3s ease-out 0s",
                },
              })
            );
          }}
        >
          Любой
        </div>
        <div
          className={styles.selector}
          style={selectorStyles.languageSelector}
        >
          {selectorTitles.languageSelector}
        </div>
      </div>
    </div>
  );
};
