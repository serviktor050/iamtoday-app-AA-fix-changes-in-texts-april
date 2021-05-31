import React from "react";
import styles from "./styles.css";

export const EmptyTable = ({ message }) => {
  return (
    <div className={styles.emptyTable}>
      <p className={styles.emptyTable__message}>{message.toUpperCase()}</p>
    </div>
  );
};
