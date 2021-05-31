import React, { Component } from "react";
import styles from "./noUser.css";
import CSSModules from "react-css-modules";

class NoUser extends Component {
  render() {
    return (
      <div className={styles.mainBody}>
        <div className={styles.mainImg}></div>
        <span className={styles.mainText}>
          Выберите пользователя из списка слева для взаимодействия
        </span>
      </div>
    );
  }
}

export default CSSModules(NoUser, styles);
