import React, { Component } from "react";
import CSSModules from "react-css-modules";
import styles from "./chatTabItem.css";
import { PUBLIC_CHAT_ID, PRIVATE_CHAT_ID, TEAM_CHAT_ID } from "../../actions";
import classnames from "classnames";

class ChatTabItem extends Component {
  render() {
    const {
      role,
      active,
      tabName,
      isPaid,
      chatAvatar,
      lastMessageDate,
      lastMessageAuthor,
      lastMessage,
      unreadMessages,
      isPinned,
    } = this.props;
    let isActiveClass =
      active === tabName ? styles.chatTabActive : styles.chatTab;
    if (active === tabName && tabName === TEAM_CHAT_ID) {
      isActiveClass = styles.chatTabActiveVipPaid;
    }
    if (active === tabName && tabName === TEAM_CHAT_ID && !isPaid) {
      isActiveClass = styles.chatTabActiveVip;
    }
    const isAdminClass =
      role === 2 ? isActiveClass + " " + styles.chatTabAdmin : isActiveClass;

    return (
      <li
        onClick={this.props.onClickTabs.bind(this, this.props.tabName)}
        className={isAdminClass}
      >
        <img className={styles.chatAvatar} src={chatAvatar} />

        <div className={styles.chatTabBody}>
          <span
            className={classnames(styles.chatTabTitle, {
              [styles.vip]: tabName === TEAM_CHAT_ID && !isPaid,
            })}
          >
            {this.props.children}

            {isPinned ? (
              <svg className={styles.icon}>
                <use xlinkHref="#ico-pin" />
              </svg>
            ) : (
              ""
            )}
          </span>

          <p className={styles.lastMessage}>
            <span className={styles.lastMessageAuthor}>{`${lastMessageAuthor}${
              lastMessageAuthor ? ":" : ""
            } `}</span>
            {lastMessage}
          </p>
        </div>
        <div className={styles.rightSide}>
          <p className={styles.lastMessageDate}>{lastMessageDate}</p>
          <button className={styles.messagesBadge}>
            {unreadMessages > 0 ? unreadMessages : null}
          </button>
        </div>
      </li>
    );
  }
}

export default CSSModules(ChatTabItem, styles);
