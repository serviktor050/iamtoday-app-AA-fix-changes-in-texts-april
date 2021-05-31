import React from 'react';
import styles from './style.css';
import classNames from "classnames/bind";
import { startPrivateChat } from "../../../../../../utils"

const cx = classNames.bind(styles);

export const UserContactButtons = ({flag, id}) => (
  <div className={styles.UserContactButtonsContainer}>
    
    <div className={styles.iconsBlock}>
      <button className={cx(styles.iconButton, {'background-color-white': flag === 'background-color-white'})}>
        <svg height="24px" width="24px">
          <use xlinkHref="#ico-phone" />
        </svg>
      </button>

      <button className={cx(styles.iconButton, {'background-color-white': flag === 'background-color-white'})}>
        <svg height="24px" width="24px">
          <use xlinkHref="#ico-email" />
        </svg>
      </button>

      <button onClick={() => startPrivateChat(id)} className={cx(styles.iconButton, {'background-color-white': flag === 'background-color-white'})}>
        <svg height="24px" width="24px">
          <use xlinkHref="#ico-message" />
        </svg>
        <span className={styles.chatText} >Начать чат</span>
      </button>

    </div> 
  </div>
);

