import PropTypes from 'prop-types';
import React, { Component } from "react";
import { connect } from "react-redux";
import { browserHistory, Link } from "react-router";
import Loader from "../components/componentKit/Loader";
import { EmojiPicker as Emodji } from "../components/profile/emodji/index";
import { dict } from "dict";
import classnames from "classnames";
const signalR = require("@aspnet/signalr");
import cookie from "react-cookie";
import CSSModules from "react-css-modules";
import styles from "./chatScreen.css";

import moment from "moment";

export class ChatScreen extends Component {
  state = {
    isForwarding: false,
    miniChatOpen: false,
    miniChatSmall: true,
    unReadMessages: 0,
    showEmojiPopup: false,
    selectChat: 0,
    quote: null,
    ////chatType:2
  };

  toggleEmojiPopup() {
    this.setState({ showEmojiPopup: !this.state.showEmojiPopup });
  }

  getEmoji(unicode) {
    const point = Number("0x" + unicode);
    const offset = point - 0x10000;
    const lead = 0xd800 + (offset >> 10);
    const trail = 0xdc00 + (offset & 0x3ff);
    const arr = [lead.toString(16), trail.toString(16)];

    return arr
      .map((el) => parseInt(el, 16))
      .map((el) => String.fromCharCode(el))
      .join("");
  }

  appendEmoji(unicode) {
    this.refs.message.value += this.getEmoji(unicode);
  }
  /*componentDidUpdate(prevProps) {
    const { dispatch, singleChat, fetchSingleChat } = this.props;
    if (singleChat.comments !== prevProps.singleChat.comments) {
      this.setState({ isLoaded: true });
    }
  }*/
  checkMessageLength(e) {
    this.setState({
      isMessageValid: e.target && e.target.value.length,
    });
  }

  backToChats = () => {
    browserHistory.goBack();
  };

  render() {
    const { userInfo, lang, singleChat } = this.props;
    return (
      <div>
        {singleChat.comments ? this.renderChatHeader() : <Loader />}
        {singleChat.comments && this.renderMessagesList()}
        {singleChat.comments && this.renderMessageSend()}
      </div>
    );
  }

  renderChatHeader = () => {
    const { singleChat, lang } = this.props;
    const i18n = dict[lang];
    return (
      <div>
        {Boolean(singleChat.comments.length) && (
          <div>
            <div className={styles.chatNavbar}>
              <div>
                <button className={styles.backBtn} onClick={this.backToChats}>
                  Назад
                </button>
              </div>
              <div className={styles.navTitle}>
                <div>
                  <p className={styles.chatName}>{singleChat.name}</p>
                  <p className={styles.chatMembers}>
                    {`${singleChat.userCount} ${i18n["chatHeader.members"]}`}
                  </p>
                </div>
                <div>
                  <svg className={styles.icon}>
                    <use xlinkHref="#ico-pin" />
                  </svg>
                </div>
              </div>
              <button className={styles.menuBtn}>
                <svg className={styles.icon}>
                  <use xlinkHref="#ico-list" />
                </svg>
              </button>
            </div>
            <hr />
          </div>
        )}
      </div>
    );
  };

  renderMessagesList = () => {
    const { singleChat, lang } = this.props;

    return (
      <div>
        {Boolean(singleChat.comments.length) &&
          singleChat.comments.map((item) => {
            return <div>{item.text}</div>;
          })}
      </div>
    );
  };

  renderMessageSend = () => {
    const { lang } = this.props;
    const miniChat = false;
    const { showEmojiPopup } = this.state;

    let categories = {
      people: {
        title: "Люди",
        emoji: "smile",
      },
      nature: {
        title: "Природа",
        emoji: "mouse",
      },
      food: {
        title: "Еда",
        emoji: "pizza",
      },
      activity: {
        title: "Развлечения",
        emoji: "soccer",
      },
      travel: {
        title: "Путешествия",
        emoji: "earth_americas",
      },
    };
    return (
      <div>
        <div className={miniChat ? styles.chatFormMini : styles.chatForm}>
          <div className={styles.chatFormInner}>
            <div className={styles.textareaFieldWrap}>
              <div
                className={this.state.quote ? styles.quote : styles.quoteHide}
              >
                <div className={styles.quoteContent}>
                  <div className={styles.quoteName}>
                    {this.state.quote ? this.state.quote.fullName : null}
                  </div>
                  {this.renderQouteBlock()}
                </div>
                <div className={styles.quoteClose} onClick={this.closeQuote}>
                  <svg>
                    <use xlinkHref="#close" />
                  </svg>
                </div>
              </div>

              <div className={miniChat ? styles.textAreaMini : styles.textArea}>
                {showEmojiPopup ? (
                  <div className={styles.chatEmoji}>
                    <Emodji
                      categories={categories}
                      onChange={({ unicode }) => this.appendEmoji(unicode)}
                    />
                  </div>
                ) : null}
                <button
                  ref="btn"
                  onClick={() => this.toggleEmojiPopup()}
                  className={
                    miniChat
                      ? styles.chatEmojiButtonMini
                      : styles.chatEmojiButton
                  }
                >
                  😀
                </button>
                <textarea
                  className={
                    miniChat ? styles.textareaFieldMini : styles.textareaField
                  }
                  rows={1}
                  ref="message"
                  //onChange={(e) => onMessageChanged(e)}
                  placeholder={dict[lang]["yourMessage"]}
                  onFocus={(e) => (e.target.placeholder = "")}
                  onBlur={(e) =>
                    (e.target.placeholder = dict[lang]["yourMessage"])
                  }
                ></textarea>

                <div
                  className={miniChat ? styles.btnChatMini : styles.btnChat}
                  onClick={() => {
                    // onMessageSend(this.refs.message.value, this.state.quote);
                    //this.refs.message.value = "";
                    //this.closeQuote();
                  }}
                >
                  {miniChat ? (
                    <div className={styles.btnChatMiniIcon}>
                      <svg>
                        <use xlinkHref="#i-send"></use>
                      </svg>
                    </div>
                  ) : (
                    <div className={styles.btnChatTitle}>
                      {dict[lang]["send"]}
                    </div>
                  )}

                  <div className={styles.btnChatIco}>
                    <svg className={styles.svgIconBoldArrowUp}>
                      <use xlinkHref="#ico-bold-arrow-up"></use>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  renderQouteBlock = () => {
    if (this.state.quote) {
      const isStickers = this.state.quote.text.indexOf("sticker:") !== -1;
      const sticker = this.state.quote.text.split(":")[1];
      if (isStickers) {
        return (
          <div
            className={classnames(styles.quoteBlock, {
              [styles.stickers]: isStickers,
            })}
          >
            <img src={`/assets/img/alfa/stickers/${sticker}`} alt="" />
          </div>
        );
      }
      return <div className={styles.quoteBlock}>{this.state.quote.text}</div>;
    }
    return <div className={styles.quoteBlock}></div>;
  };
}

const mapStateToProps = (state) => {
  const { userInfo, lang } = state;

  const { singleChat } = state.chat;

  return {
    singleChat,
    userInfo,
    lang,
  };
};

ChatScreen = connect(mapStateToProps)(ChatScreen);

export default CSSModules(ChatScreen, styles);
