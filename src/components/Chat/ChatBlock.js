import PropTypes from 'prop-types';
import React, { Component } from "react";
//import EmojiPicker from 'emojione-picker'
import { EmojiPicker as Emodji } from "../profile/emodji/index";
import "../../../node_modules/emojione-picker/css/picker.css";
import ChatContent from "./ChatContent";
import CSSModules from "react-css-modules";
import styles from "./chatBlock.css";
import {
  PUBLIC_CHAT_ID,
  PRIVATE_CHAT_ID,
  TEAM_CHAT_ID,
  ALL_USERS_CHAT_ID,
  SPECIALIZATION_CHAT_ID,
} from "../../actions";
import { withRouter } from "react-router";
import MiniChatTabs from "./MiniChatTabs";
import classnames from "classnames";
import { Link } from "react-router";
import { dict } from "dict";
import { ChatNavbar } from "./ChatNavbar";
import { listenToUnreadMessages } from "../../utils/wsApi";

/**
 *  Компонент ChatBloc.
 *  Используется для вывода блока чата в лк и в админке
 *
 */

class ChatBlock extends Component {
  /**
   * @memberof ChatBlock
   * @prop {object} propTypes - the props that are passed to this component
   * @prop {func} propTypes.changeChat Выбор чата
   * @prop {func} propTypes.onMessageSend Отправка сообщений на сервер
   * @prop {object} propTypes.privateChats  Приватный чат
   * @prop {object} propTypes.teamChats Командный чат
   * @prop {object} propTypes.commonChats Общий чат
   * @prop {bool} propTypes.admin Проверяет юзера - админ или нет
   * */

  static propTypes = {
    changeChat: PropTypes.func.isRequired,
    onMessageSend: PropTypes.func.isRequired,
    privateChats: PropTypes.array,
    teamChats: PropTypes.array,
    commonChats: PropTypes.array,
    admin: PropTypes.bool,
  };
  constructor(props) {
    super(props);

    this.state = {
      showEmojiPopup: false,
      selectChat: 0,
      quote: null,
    };
  }

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

  renderChatName() {
    const { chat, lang } = this.props;
    if (chat === PUBLIC_CHAT_ID) {
      return dict[lang]["commonChat"];
    } else if (chat === TEAM_CHAT_ID) {
      return dict[lang]["vipChat"];
    } else if (chat === PRIVATE_CHAT_ID) {
      return dict[lang]["support"];
    } else if (chat === ALL_USERS_CHAT_ID) {
      return "Общий чат";
    } else if (chat === SPECIALIZATION_CHAT_ID) {
      return "Чат";
    }
  }

  toChat() {
    const { router } = this.props;
    router.push("/chats");
  }

  handleDocumentClick = (e) => {
    if (this.refs.btn !== e.target) {
      if (this.state.showEmojiPopup) {
        this.setState({
          showEmojiPopup: false,
        });
      }
    }
  };

  changeActiveTab(tab) {
    this.setState({
      selectChat: tab,
    });
  }

  componentDidMount() {
    window.addEventListener("click", this.handleDocumentClick);
    this.scrollTop()
  }

  componentWillUnmount() {
    window.removeEventListener("click", this.handleDocumentClick);
  }
  
  scrollTop() {  
    const closest = (el, cls) => {
      while ((el = el.parentElement) && !el.classList.contains(cls));
      return el;
    };
    let chat = document.querySelector("#chat-list");
    
    if (chat) {
      let msgs = chat.querySelectorAll("#message-item");
      let newMessage = chat.querySelector("#newMessage");
      const chatBlock = closest(chat, "chatContent");
      if (newMessage) {
        newMessage.scrollIntoView(false);
        this.listenToReadNewMessage(chatBlock, newMessage);
      } else {
        msgs[msgs.length - 1].scrollIntoView();
      }
      chat.style.opacity = "1";
    } 
  }

  listenToReadNewMessage(chat, newMessage) {
    const {
      singleChat,
      userInfo,
    } = this.props;
   
    const chatSetRead = () => {
      //if (this.connection) {        
        //listenToUnreadMessages(userInfo.data.id, singleChat.type, singleChat.typeId)
        newMessage.style.display = "none";
        chat.removeEventListener("scroll", scrollHandler); 
      //}
    };
    chatSetRead();

       
    const scrollHandler = () => {
      if (chat.children[0].offsetHeight) {
        if (
          chat.children[0].offsetHeight - chat.scrollTop - chat.offsetHeight < 3
        ) {
          chatSetRead();
        }
      }
    };

    if (chat.scrollHeight > chat.offsetHeight) {
      chat.removeEventListener("scroll", scrollHandler);
      chat.addEventListener("scroll", scrollHandler);
    } else {
      chatSetRead();
    }
  }

  closeMiniChat() {
    const { toggleMiniChat } = this.props;
    toggleMiniChat(false);
    this.changeActiveTab(0);
  }

  toQuote = ({ text, fullName, id }) => {
    const editText = text.length > 200 ? text.slice(0, 200) + "..." : text;
    this.setState({
      quote: {
        text: editText,
        fullName,
        id,
      },
    });
  };

  closeQuote = () => {
    this.setState({
      quote: null,
    });
  };

  changeChat = (tab) => {
    const { changeChat } = this.props;
    this.closeQuote();
    changeChat(tab);
  };

  addSticker = (sticker) => {
    this.props.onMessageSend(sticker, null);
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

  render() {
    let {
      // Data
      chatInfo,
      lang,
      userId,
      // comments = [],
      // sendButtonText,
      placeholderText,
      // Flags
      isFetching,
      isFetchingChat,
      onMessageChanged,
      changeChat,
      onMessageSend,
      userInfo,
      miniChatOpen,
      privateChats,
      allUsersChats,
      specializationChats,
      toggleMiniChat,
      toggleMiniChatSmall,
      teamChats,
      commonChats,
      miniChatSmall,
      chat /*=chatType*/,
      chatTypeId,
      unReadPublicChat,
      unReadPrivateChat,
      unReadTeamChat,
      unReadAllUsersChat,
      unReadSpecializationChat,
      role,
      miniChat,
      scrollToMsg,
      fetchChat,
      isLoadMorePrivate,
      isLoadMorePublic,
      isLoadMoreTeam,
      isLoadMoreAllUsers,
      isLoadMoreSpecialization,
      isPaid,
      admin,
      singleChat,
      pinChat,
      unpinChat,
      sendSearchMessageRequest,
      leaveChat,
      clearChat,
      editChat,
    } = this.props;

    let workTeam = null;
    if (!admin && userInfo.data.workTeamInfo) {
      workTeam = userInfo.data.workTeamInfo.name;
    }

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

    const miniature = (chat === 9 && !isPaid) || (chat === 1 && !isPaid);

    return (
      <div style={{ position: "relative" }}>
        {!miniChat && chatInfo && (
          <ChatNavbar
            pinChat={pinChat}
            unpinChat={unpinChat}
            sendSearchMessageRequest={sendSearchMessageRequest}
            leaveChat={leaveChat}
            chatInfo={chatInfo}
            lang={lang}
            clearChat={clearChat}
            editChat={editChat}
          />
        )}
        {miniChat && (
          <MiniChatTabs
            role={role}
            chat={chat}
            workTeam={workTeam}
            miniChatOpen={miniChatOpen}
            toggleMiniChat={toggleMiniChat}
            changeChat={changeChat}
            changeActiveTab={this.changeActiveTab.bind(this)}
            unReadPublicChat={unReadPublicChat}
            unReadPrivateChat={unReadPrivateChat}
            unReadTeamChat={unReadTeamChat}
            unReadAllUsersChat={unReadAllUsersChat}
            unReadSpecializationChat={unReadSpecializationChat}
            isFetchingChat={isFetchingChat}
            selectChat={this.state.selectChat}
          />
        )}

        {!miniChat || miniChatOpen ? (
          <div
            className={
              miniChat && miniChatSmall
                ? styles.chatInnerBlockSmall
                : styles.chatInnerBlock
            }
          >
            {miniChat && (
              <div
                className={classnames(styles.miniChatHeader, {
                  [styles.vipChat]: chat == 9,
                })}
              >
                <div
                  className={classnames(styles.miniChatTitle, {
                    [styles.vipChat]: chat == 9,
                  })}
                >
                  {chat == 9 && (
                    <svg className={styles.iconVip}>
                      <use xlinkHref="#vip" />
                    </svg>
                  )}
                  <div>{this.renderChatName()}</div>
                </div>
                <div className={styles.miniChatAction}>
                  <div
                    className={styles.miniChatActionItem}
                    onClick={this.toChat.bind(this)}
                  >
                    <svg className={styles.minionChatCloseIcon}>
                      <use xlinkHref="#arrow_rigth"></use>
                    </svg>
                  </div>
                  <div
                    className={styles.miniChatActionItem}
                    onClick={() => toggleMiniChatSmall(true)}
                  >
                    <svg className={styles.minionChatCloseIcon}>
                      <use
                        xlinkHref={
                          miniChatSmall ? "#arrow_diagonal" : "#arrow_inner"
                        }
                      ></use>
                    </svg>
                  </div>
                  <div
                    className={styles.miniChatActionItem}
                    onClick={() => this.closeMiniChat()}
                  >
                    <svg className={styles.minionChatCloseIcon}>
                      <use xlinkHref="#ico-close"></use>
                    </svg>
                  </div>
                </div>
              </div>
            )}
            {/*spinner */}
            <div className={styles.chatSpinner}>
              <div className={styles.spinner}></div>
            </div>

            <div
              className={classnames(styles.chatWrap, {
                [styles.chatWrapVip]: miniature,
                [styles.miniChat]: miniChat,
                [styles.miniChatSmall]: miniChatSmall,
              })}
            >
              {/*заглушка если чат не оплачен */}
              {miniature && (
                <div className={styles.chatMiniature}>
                  <div
                    className={classnames(styles.chatMiniatureTitle, {
                      [styles.miniChat]: miniChat,
                    })}
                  >
                    {dict[lang]["notAccess.vip.1"]}
                  </div>
                  {chat === 9 && (
                    <div
                      className={classnames(styles.chatMiniatureDesc, {
                        [styles.miniChat]: miniChat,
                      })}
                    >
                      {dict[lang]["notAccess.vip.2"]}
                      <br />
                      <br />
                      {dict[lang]['notAccess.vip.2.additional']}
                    </div>
                  )}

                  {chat === 9 && (
                    <div
                      className={classnames(styles.chatMiniatureNote, {
                        [styles.miniChat]: miniChat,
                      })}
                    >
                      <span>{dict[lang]["notAccess.vip.3"]}</span>
                      <Link
                        className={styles.chatMiniatureLink}
                        to="/trainings"
                      >
                        {dict[lang]["notAccess.vip.4"]}
                      </Link>
                      <span>{dict[lang]["notAccess.vip.5"]}</span>
                    </div>
                  )}

                  {chat === 1 && (
                    <div
                      className={classnames(styles.chatMiniatureNote, {
                        [styles.miniChat]: miniChat,
                      })}
                    >
                      <span>{dict[lang]["notAccess.common.1"]}</span>
                      <Link
                        className={styles.chatMiniatureLink}
                        to="/trainings"
                      >
                        {dict[lang]["notAccess.common.2"]}
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {/*render singleChat if it's from new chats*/}
              {Boolean(singleChat) && !miniature && (
                <ChatContent
                  miniChatSmall={miniChat && miniChatSmall}
                  miniChat={miniChat}
                  isFetchingChat={isFetchingChat}
                  isFetching={isFetching}
                  gender={userInfo.data.gender}
                  isActive
                  userId={userId}
                  list={singleChat}
                  toQuote={this.toQuote}
                  scrollToMsg={scrollToMsg}
                  //fetchChat={() => fetchChat(PUBLIC_CHAT_ID, null, true)}
                  isLoadMore={isLoadMorePublic}
                  lang={lang}
                />
              )}

              {/*send message block */}
              {!miniature && (
                <div
                  className={miniChat ? styles.chatFormMini : styles.chatForm}
                >
                  <div className={styles.chatFormInner}>
                    <div className={styles.textareaFieldWrap}>
                      <div
                        className={
                          this.state.quote ? styles.quote : styles.quoteHide
                        }
                      >
                        <div className={styles.quoteContent}>
                          <div className={styles.quoteName}>
                            {this.state.quote
                              ? this.state.quote.fullName
                              : null}
                          </div>
                          {this.renderQouteBlock()}
                        </div>
                        <div
                          className={styles.quoteClose}
                          onClick={this.closeQuote}
                        >
                          <svg>
                            <use xlinkHref="#close" />
                          </svg>
                        </div>
                      </div>

                      <div
                        className={
                          miniChat ? styles.textAreaMini : styles.textArea
                        }
                      >
                        {showEmojiPopup ? (
                          <div className={styles.chatEmoji}>
                            <Emodji
                              categories={categories}
                              onChange={({ unicode }) =>
                                this.appendEmoji(unicode)
                              }
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
                            miniChat
                              ? styles.textareaFieldMini
                              : styles.textareaField
                          }
                          rows={1}
                          ref="message"
                          onChange={(e) => onMessageChanged(e)}
                          placeholder={dict[lang]["yourMessage"]}
                          onFocus={(e) => (e.target.placeholder = "")}
                          onBlur={(e) =>
                            (e.target.placeholder = dict[lang]["yourMessage"])
                          }
                        ></textarea>

                        {/*<Stickers add={this.addSticker} miniChat={miniChat} />*/}

                        <div
                          className={
                            miniChat ? styles.btnChatMini : styles.btnChat
                          }
                          onClick={() => {
                            onMessageSend(
                              this.refs.message.value,
                              this.state.quote
                            );
                            this.refs.message.value = "";
                            this.closeQuote();
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

                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}
const ChatBlockComponent = withRouter(ChatBlock);
export default CSSModules(ChatBlockComponent, styles);
