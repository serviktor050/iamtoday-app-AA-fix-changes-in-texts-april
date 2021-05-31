import PropTypes from 'prop-types';
import React, { Component } from "react";
import CSSModules from "react-css-modules";
import styles from "./chatContent.css";
import Loading from "../componentKit2/Loading";
import emptyChat from "./imgs/ico-chat.svg";
import classnames from "classnames";
import moment from "moment";
import { browserHistory } from "react-router";
import {
  PUBLIC_CHAT_ID,
  PRIVATE_CHAT_ID,
  TEAM_CHAT_ID,
  ALL_USERS_CHAT_ID,
  SPECIALIZATION_CHAT_ID,
} from "../../actions";
import { dict } from "dict";
import { goBack } from "react-router-redux";

const dateFormat = (date, bool) => {
  let newDate;

  if (date) {
    let arr = date.split("-");
    let arrTime = date.split("T");
    let age;
    if (bool) {
      newDate =
        arrTime[1].slice(0, 8) +
        "," +
        " " +
        arr[2].slice(0, 2) +
        "-" +
        arr[1] +
        "-" +
        arr[0];
      return newDate;
    }
    newDate = arr[2].slice(0, 2) + "-" + arr[1] + "-" + arr[0];

    age = Math.floor(
      (new Date() - new Date(arr[0], arr[1] - 1, arr[2].slice(0, 2))) /
        3600 /
        1000 /
        24 /
        365.25
    );
    return { newDate, age };
  }
  return "Нет данных";
};

class MsgItem extends Component {
  state = {
    actionsMsg: false,
  };

  componentDidMount() {
    document.body.addEventListener("mousedown", this.handleActionMsg, false);
  }

  handleActionMsg = (e) => {
    if (this.state.actionsMsg) {
      if (
        !e.target.classList.contains(styles.toggle) &&
        !e.target.classList.contains(styles.toggleSvg) &&
        !e.target.classList.contains(styles.actions)
      ) {
        this.setState({
          actionsMsg: false,
        });
      }
    }
  };

  componentWillUnmount() {
    document.body.removeEventListener("mousedown", this.handleActionMsg, false);
  }

  openActions = () => {
    this.setState((state) => ({
      actionsMsg: !state.actionsMsg,
    }))
  };

  toQuote = ({ text, fullName, id }) => {
    const { toQuote } = this.props;
    toQuote({ text, fullName, id });
    this.setState({
      actionsMsg: false,
    });
  };

  toMsg = () => {
    this.props.scrollToMsg(this.props.replyInfo.id);
  };

  renderMsg = () => {
    let { text } = this.props;

    if (text.indexOf("sticker:") !== -1) {
      const sticker = text.split(":")[1];
      return (
        <div className={styles.msg}>
          <img src={`/assets/img/alfa/stickers/${sticker}`} alt="" />
        </div>
      );
    }

    return <div className={styles.msg}>{text}</div>;
  };

  renderReplyText = () => {
    const { replyInfo } = this.props;
    const isStickers = replyInfo.text.indexOf("sticker:") !== -1;

    if (isStickers) {
      const sticker = replyInfo.text.split(":")[1];
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
    return <div className={styles.quoteBlock}>{replyInfo.text}</div>;
  };

  render() {
    let {
      userId,
      userInfo,
      isSystem,
      miniChat,
      text,
      toQuote,
      cls,
      id,
      replyInfo,
      date,
      lang,
    } = this.props;
    const fullName = `${userInfo.firstName || ""} ${userInfo.lastName || ""}`;

    const isStickers = text.indexOf("sticker:") !== -1;
    if (!(userId === userInfo.id)) {
      return (
        <div className={cls}>
          {!isSystem ? (
            <div className={styles.chatMsgAva}>
              <img
                className={styles.chatMsgAvaImg}
                src={
                  userInfo.photo
                    ? userInfo.photo
                    : userInfo.gender === "male"
                    ? "/assets/img/png/boy.png"
                    : "/assets/img/png/girl.png"
                }
                alt=""
              />
            </div>
          ) : null}

          <div
            className={
              miniChat ? styles.chatMsgContentMini : styles.chatMsgContent
            }
          >
            {!miniChat && <div className={styles.dateSomeone}></div>}

            <div
              className={classnames(styles.chatMsgText + " msg-text", {
                [styles.stickers]: isStickers,
              })}
            >
              <div className={styles.chatMsgTextMini}>
                {isSystem ? dict[lang]["systemMessage"] : fullName}
              </div>
              {replyInfo && (
                <div className={styles.quote} onClick={this.toMsg}>
                  <div className={styles.quoteContent}>
                    <div className={styles.quoteName}>
                      {replyInfo.fullName
                        ? replyInfo.fullName
                        : `${replyInfo.userInfo.firstName} ${replyInfo.userInfo.lastName}`}
                    </div>
                    {this.renderReplyText()}
                  </div>
                </div>
              )}
              {this.renderMsg()}
              <div data-r={"sdf"} className={styles.date}>
                {moment(date).lang(lang).format("LT")}
              </div>
              {!isSystem && (
                <div className={styles.toggle} onClick={this.openActions}>
                  <svg className={styles.toggleSvg}>
                    <use xlinkHref="#toggle" />
                  </svg>
                </div>
              )}
              {this.state.actionsMsg && (
                <div
                  className={styles.actions}
                  onClick={() => this.toQuote({ text, fullName, id })}
                >
                  {dict[lang]["toAnswer"]}
                </div>
              )}
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className={cls}>
          <div className={styles.chatMsgContent}>
            {!miniChat && (
              <div className={isSystem ? styles.dateSystem : styles.date}>
                <p className={styles.chatMsgName}>
                  {isSystem ? dict[lang]["systemMessage"] : fullName}
                </p>
              </div>
            )}

            <div
              className={classnames(styles.chatMsgText + " msg-text", {
                [styles.bgMini]: miniChat,
                [styles.stickers]: isStickers,
              })}
            >
              {replyInfo && (
                <div className={styles.quote} onClick={this.toMsg}>
                  <div className={styles.quoteContent}>
                    <div className={styles.quoteName}>
                      {replyInfo.fullName
                        ? replyInfo.fullName
                        : `${replyInfo.userInfo.firstName} ${replyInfo.userInfo.lastName}`}
                    </div>
                    {this.renderReplyText()}
                  </div>
                </div>
              )}
              {this.renderMsg()}
              <div className={styles.date}>
                {moment(date).lang(lang).format("LT")}
              </div>
              {!isSystem && (
                <div className={styles.toggle} onClick={this.openActions}>
                  <svg className={styles.toggleSvg}>
                    <use xlinkHref="#toggle" />
                  </svg>
                </div>
              )}
              {this.state.actionsMsg && (
                <div
                  className={styles.actions}
                  onClick={() => this.toQuote({ text, fullName, id })}
                >
                  {dict[lang]["toAnswer"]}
                </div>
              )}
            </div>
          </div>
          {!isSystem ? (
            <div className={styles.chatMsgAva}>
              <img
                className={styles.chatMsgAvaImg}
                src={
                  userInfo.photo
                    ? userInfo.photo
                    : userInfo.gender === "male"
                    ? "/assets/img/png/boy.png"
                    : "/assets/img/png/girl.png"
                }
                alt=""
              />
            </div>
          ) : null}
        </div>
      );
    }
  }
}

/**
 *  Компонент ChatContent.
 *  Используется для вывода контента чата
 *
 */
class ChatContent extends Component {
  /**
   * @memberof ChatContent
   * @prop {object} propTypes - the props that are passed to this component
   * @prop {func} propTypes.list Массив сообщений
   * @prop {func} propTypes.userId Номер Пользователя
   * @prop {object} propTypes.type  Тип чата
   * */

  static propTypes = {
    list: PropTypes.array.isRequired,
    userId: PropTypes.number.isRequired,
    type: PropTypes.number,
  };
  componentDidMount() {
    //const { fetchChat } = this.props;
    //fetchChat();
  }
  /*shouldComponentUpdate(nextProps){
	  return (
		   nextProps.userId !== this.props.userId
		|| nextProps.list !== this.props.list
		|| nextProps.isFetching !== this.props.isFetching
		|| nextProps.isActive !== this.props.isActive
		|| nextProps.miniChatSmall !== this.props.miniChatSmall
	  )
	}*/

  render() {
    const {
      list,
      userId,
      isFetching,
      isActive,
      isLoadMore,
      gender,
      miniChat,
      isFetchingChat,
      miniChatSmall,
      toQuote,
      scrollToMsg,
      fetchChat,
      lang,
    } = this.props;
    let listArr = list ? list : [];

    const chatContentClass = classnames("chatContent", styles.chatContent, {
      [styles.chatContentActive]: isActive,
      [styles.smallChatHeigth]: miniChatSmall,
      [styles.miniChatContent]: miniChat && !miniChatSmall,
      [styles.border]: miniChat,
    });

    return (
      <div className={chatContentClass}>
        <div className={styles.btnMore}>
          {isLoadMore && (
            <button onClick={fetchChat}>{dict[lang]["moreLoad"]}</button>
          )}
        </div>
        {listArr.length ? (
          <div
            ref="chat"
            id="chat-list"
            className={classnames({
              [styles.chatMessagesMini]: miniChat,
              [styles.chatMessages]: !miniChat,
            })}
          >
            {listArr.map(
              (
                { id, userInfo, date, text, isRead, isSystem, replyInfo },
                index
              ) => {
                let liStyle;
                let data = null;
                if (!index) {
                  data = moment(date).lang(lang).format("LL");
                } else {
                  data =
                    moment(date).format("LL") !==
                    moment(listArr[index - 1].date).format("LL")
                      ? moment(date).lang(lang).format("LL")
                      : null;
                }
                if (isSystem) {
                  liStyle = styles.chatMsgSystem;
                } else if (userId === userInfo.id) {
                  liStyle = styles.chatMsgYou;
                } else {
                  liStyle = styles.chatMsgSomeone;
                }

                if (
                  !isRead &&
                  (listArr[index - 1] ? listArr[index - 1].isRead : true)
                ) {
                  return (
                    <div key={id} className={styles.chatMsgNewWrapper}>
                      <div id="newMessage" style={{ display: "block" }}>
                        <div className={styles.chatMsgNewLine}></div>
                        <div className={styles.chatMsgNew}>
                          {dict[lang]["newMsg"]}
                        </div>
                      </div>

                      <div id="message-item" data-msg={id}>
                        <MsgItem
                          cls={liStyle}
                          userId={userId}
                          userInfo={userInfo}
                          isSystem={isSystem}
                          miniChat={miniChat}
                          text={text}
                          toQuote={toQuote}
                          id={id}
                          replyInfo={replyInfo}
                          date={date}
                          scrollToMsg={scrollToMsg}
                          lang={lang}
                        />
                      </div>
                    </div>
                  );
                }
                return (
                  <div key={id}>
                    {data && data !== "Invalid date" && (
                      <div className={styles.data}>{data}</div>
                    )}
                    <div id="message-item" data-msg={id}>
                      <MsgItem
                        cls={liStyle}
                        userId={userId}
                        userInfo={userInfo}
                        isSystem={isSystem}
                        miniChat={miniChat}
                        text={text}
                        toQuote={toQuote}
                        id={id}
                        replyInfo={replyInfo}
                        date={date}
                        scrollToMsg={scrollToMsg}
                        lang={lang}
                      />
                    </div>
                  </div>
                );
              }
            )}
          </div>
        ) : !isFetchingChat ? (
          <div
            className={classnames("chat-empty", {
              "chat-empty__mini": miniChat && miniChatSmall,
            })}
          >
            <div className="chat-empty__ico">
              <img
                className="chat-empty__img"
                src={emptyChat}
                alt="emptyChat"
              />
            </div>
            <p className="chat-empty__copy">{dict[lang]["noMsg"]}</p>
          </div>
        ) : (
          /*<Loading />*/
          <p className={styles.chat__notFound}>{dict[lang]["chat.messageNotFound"]}</p>
        )}
      </div>
    );
  }
}

export default CSSModules(ChatContent, styles);
