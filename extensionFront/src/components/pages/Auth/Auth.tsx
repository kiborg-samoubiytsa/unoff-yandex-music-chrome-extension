import React, { useRef, useState } from "react";
import styles from "./Auth.module.scss";
import logo from "../../../img/logo.png";
import { validatePassword } from "../../../requests/validatePassword";
import { WhatIsTokenPopup } from "./popups/WhatIsTokenPopup";

export const Auth = () => {
  const tokenInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const [formStyle, setFormStyle] = useState({});
  const [isTokenInputActive, setIsTokenInputActive] = useState(false);
  const [popupStyles, setPopupStyles] = useState({ left: "", top: "" });

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    /* if (await validatePassword(tokenInputRef.current?.value)) {
      const data = await validatePassword(tokenInputRef.current?.value);
      console.log(data);
      localStorage.setItem(
        "user-data",
        JSON.stringify({
          uid: data.id,
          token: tokenInputRef.current?.value,
        })
      );
      window.location.reload();
    } else setFormStyle({ border: "1px solid red" });
    return false; */
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authForm}>
        <img src={logo} alt="logo" className={styles.authLogo} />
        <form onSubmit={(e) => validatePassword(e)}>
          {/* <span
            className={
              isUsernameInputActive
                ? styles["authFieldName-active"]
                : styles.authFieldName
            }
            onClick={() => {
              setIsUsernameInputActive(true);
              tokenInputRef.current?.focus();
            }}
          >
            Почта
          </span>
          <input
            onClick={(e) => {
              setIsUsernameInputActive(true);
            }}
            type="text"
            className={styles.authFormField}
            ref={tokenInputRef}
            style={formStyle}
          />
          <span
            onClick={() => {
              setIsPasswordInputActive(true);
              passwordInputRef.current?.focus();
            }}
            className={
              isPasswordInputActive
                ? styles["authFieldName-active"]
                : styles.authFieldName
            }
            style={{ width: 90 }}
          >
            Пароль
          </span>
          <input
            type="password"
            className={styles.authFormField}
            ref={passwordInputRef}
            style={formStyle}
            onClick={() => {
              setIsPasswordInputActive(true);
            }}
          />
          <button type="submit" className={styles.submitButton}>
            Войти
          </button> */}
          <button className={styles.submitButton}>Авторизоваться</button>
        </form>
      </div>
    </div>
  );
};
