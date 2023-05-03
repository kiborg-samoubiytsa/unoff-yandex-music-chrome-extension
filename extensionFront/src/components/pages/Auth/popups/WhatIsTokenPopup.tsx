import React, { useState, FC } from "react";
import styles from "../Auth.module.scss";

interface Props {
  popupStyles: {
    left: string;
    top: string;
  };
}

export const WhatIsTokenPopup: FC<Props> = ({ popupStyles }) => {
  return (
    <div className={styles.popupContainer} style={popupStyles}>
      Токен используется для авторизации запросов с аккаунта. Для правильно
    </div>
  );
};
