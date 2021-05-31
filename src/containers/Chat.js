import PropTypes from 'prop-types';
import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { browserHistory } from "react-router";
import ChatBlock from "../components/Chat/ChatBlock";
import $ from "jquery";
import { api, host } from "../config.js";
import classnames from "classnames";
const signalR = require("@aspnet/signalr");
import cookie from "react-cookie";
import CSSModules from "react-css-modules";
import styles from "./chat.css";
import { getNotificationsList } from "modules/Notifications";
import { postPinChat, postUnpinChat, deleteUser } from "../utils/api";
import moment from "moment";

import {
  fetchChatList,
  fetchSingleChat,
  fetchChat,
  fetchChats,
  closeChat,
  addToChat,
  answerToChat,
  answeredChat,
  waitingFromChat,
  setTypeId,
  concatPrivateChatAction,
  concatTeamChatAction,
  concatPublicChatAction,
  concatAllUsersChatAction,
  concatSingleChatAction,
  clearRenderChat,
  setUnReadComments,
  changeChatComments,
  renderPublicChatAction,
  renderPrivateChatAction,
  renderTeamChatAction,
  renderAllUsersChatAction,
  renderSingleChatAction,
  changeChatType,
  changeStatusChatAction,
  setUnReadMsgs,
  PUBLIC_CHAT_ID,
  PRIVATE_CHAT_ID,
  TEAM_CHAT_ID,
  ALL_USERS_CHAT_ID,
  SPECIALIZATION_CHAT_ID,
} from "../actions";
/**
 *  Компонент Chat
 *  Используется для блока Чат
 *
 */
export class Chat extends Component {
  /**
   * @memberof Chat
   * @prop {object} propTypes - the props that are passed to this component
   * @prop {func} propTypes.closeAdminChat Закрытие админского чата
   * @prop {func} propTypes.closeChat Закрыть чат
   * @prop {func} propTypes.answeredChat Посылает ответ
   * @prop {func} propTypes.addToChat Добавить в чат админа
   * @prop {func} propTypes.fetchChat Получение данных для чата
   * @prop {func} propTypes.changeChatType Сменить тип чата
   * @prop {number} propTypes.chatType Тип чата
   * @prop {number} propTypes.chatTypeId Тип чата числовой
   *
   * */
  static propTypes = {
    closeAdminChat: PropTypes.func,
    closeChat: PropTypes.func.isRequired,
    answeredChat: PropTypes.func.isRequired,
    addToChat: PropTypes.func.isRequired,
    fetchChat: PropTypes.func.isRequired,
    changeChatType: PropTypes.func.isRequired,
    chatType: PropTypes.number,
    chatTypeId: PropTypes.number.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      isForwarding: false,
      miniChatOpen: false,
      miniChatSmall: true,
      unReadTeamChat: 0,
      unReadPrivatChat: 0,
      unReadPublicChat: 0,
      unReadAllUsersChat: 0,
      unReadSpecializationChat: 0,
      ////chatType:2
    };
  }

  componentDidMount() {
    const { role, chatType } = this.props;
    const {
      miniChat,
      typeId,
      admin,
      fetchChat,
      changeChatType,
      clearRenderChat,
    } = this.props;
    const miniChatState =
      cookie.load("miniChatSmall") === undefined
        ? 1
        : parseInt(cookie.load("miniChatSmall"));
    if (miniChatState) {
      this.setState({
        miniChatSmall: true,
      });
    } else {
      this.setState({
        miniChatSmall: false,
      });
    }
    if (!miniChat) {
      setTimeout(() => {
        this.scrollTop();
      }, 10);
    }

    if (role === 2) {
      changeChatType(PUBLIC_CHAT_ID);
    }
    this.updateChatWs();
  }
  toggleMiniChat(bool) {
    this.setState({
      miniChatOpen: bool,
    });
  }
  //componentDidUpdate()
  componentWillMount() {
    const {
      fetchChat,
      admin,
      publicChats,
      privateChats,
      //taskDay,
      teamChats,
      allUsersChats,
      setUnReadMsgs,
      setTypeId,
    } = this.props;
    const unReadPublicChat = publicChats.unreadCount
      ? publicChats.unreadCount
      : 0;
    const unReadPrivateChat = privateChats.unreadCount
      ? privateChats.unreadCount
      : 0;
    const unReadTeamChat = teamChats.unreadCount ? teamChats.unreadCount : 0;
    const unReadAllUsersChat = allUsersChats.unreadCount
      ? allUsersChats.unreadCount
      : 0;

    this.setState({
      unReadPublicChat: unReadPublicChat,
      unReadPrivateChat: unReadPrivateChat,
      unReadTeamChat: unReadTeamChat,
      unReadAllUsersChat: unReadAllUsersChat,
    });

    if (!admin) {
      // setTypeId(taskDay.id)

      if (!publicChats.comments || !publicChats.comments.length) {
        fetchChat(PUBLIC_CHAT_ID, null);
      }
      if (!allUsersChats.comments || !allUsersChats.comments.length) {
        fetchChat(ALL_USERS_CHAT_ID, null);
      }

      if (!privateChats.comments || !privateChats.comments.length) {
        fetchChat(PRIVATE_CHAT_ID, null);
      }
      if (!teamChats.comments || !teamChats.comments.length) {
        fetchChat(TEAM_CHAT_ID, null);
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    const {
      renderPublicChatAction,
      renderTeamChatAction,
      fetchChat,
      renderPrivateChatAction,
      renderAllUsersChatAction,
      renderSingleChatAction,
      chatType,
      typeId,
      changeChatType,
      publicChats,
      privateChats,
      teamChats,
      allUsersChats,
      singleChat,
    } = this.props;

    if (
      nextProps.publicChats.unreadCount !== this.props.publicChats.unreadCount
    ) {
      this.setState({
        unReadPublicChat: nextProps.publicChats.unreadCount,
      });
      this.props.setUnReadMsgs(
        nextProps.publicChats.unreadCount +
          this.state.unReadPrivateChat +
          this.state.unReadTeamChat
      );
    }
    if (
      nextProps.allUsersChats.unreadCount !==
      this.props.allUsersChats.unreadCount
    ) {
      this.setState({
        unReadAllUsersChat: nextProps.allUsersChats.unreadCount,
      });
      this.props.setUnReadMsgs(
        this.state.unReadAllUsersChat +
          nextProps.allUsersChats.unreadCount +
          this.state.unReadAllUsersChat
      );
    }
    if (
      nextProps.privateChats.unreadCount !== this.props.privateChats.unreadCount
    ) {
      this.setState({
        unReadPrivateChat: nextProps.privateChats.unreadCount,
      });
      this.props.setUnReadMsgs(
        this.state.unReadPublicChat +
          nextProps.privateChats.unreadCount +
          this.state.unReadTeamChat
      );
    }
    if (nextProps.teamChats.unreadCount !== this.props.teamChats.unreadCount) {
      this.setState({
        unReadTeamChat: nextProps.teamChats.unreadCount,
      });
      this.props.setUnReadMsgs(
        this.state.unReadPublicChat +
          this.state.unReadPrivateChat +
          nextProps.teamChats.unreadCount
      );
    }

    if (
      nextProps.isFetchingChat === 0 &&
      nextProps.isFetchingChat !== this.props.isFetchingChat
    ) {
      if (!nextProps.isFetching) {
        if (chatType === PUBLIC_CHAT_ID) {
          renderPublicChatAction(nextProps.publicChats.comments);
        }

        if (chatType === PRIVATE_CHAT_ID) {
          renderPrivateChatAction(nextProps.privateChats.comments);
        }
        if (chatType === ALL_USERS_CHAT_ID) {
          renderAllUsersChatAction(nextProps.allUsersChats.comments);
        }
        if (chatType === TEAM_CHAT_ID) {
          renderTeamChatAction(nextProps.teamChats.comments);
        }
        if (chatType === 10 || chatType === 11) {
          renderSingleChatAction(nextProps.singleChat.comments);
        }
      }

      let skip = null;
      if (chatType == PUBLIC_CHAT_ID) {
        skip = nextProps.publicChats.skip;
      }
      if (chatType == PRIVATE_CHAT_ID) {
        skip = nextProps.privateChats.skip;
      }
      if (chatType == TEAM_CHAT_ID) {
        skip = nextProps.teamChats.skip;
      }
      if (chatType == ALL_USERS_CHAT_ID) {
        skip = nextProps.allUsersChats.skip;
      }
      if (!skip) {
        setTimeout(() => {
          this.scrollTop();
        }, 10);
      }
    }
  }

  toggleMiniChatSmall(bool) {
    this.setState({
      miniChatSmall: !this.state.miniChatSmall,
    });

    if (this.state.miniChatSmall) {
      cookie.save("miniChatSmall", "0", {
        path: "/",
        maxAge: 60 * 60 * 24 * 365 * 10,
      });
    } else {
      cookie.save("miniChatSmall", "1", {
        path: "/",
        maxAge: 60 * 60 * 24 * 365 * 10,
      });
    }
  }
  checkMessageLength(e) {
    this.setState({
      isMessageValid: e.target && e.target.value.length,
    });
  }
  closeChat() {
    const { closeChat, closeAdminChat } = this.props;

    if (this.state.isForwarding) {
      this.setState({ isForwarding: false });
    }
    closeAdminChat();
  }
  waiting(idGroup) {
    const { waitingFromChat } = this.props;
    waitingFromChat(idGroup);
  }
  answered(id) {
    const { answeredChat, dispatch } = this.props;
    answeredChat(id).then(() =>
      dispatch({ type: "UPDATE_CHATS", updateChats: true })
    );
    this.closeChat();
  }

  sendMessage(text, reply) {
    const {
      id,
      type,
      typeId,
      groupId,
      chatType,
      chatTypeId,
      admin,
      addToChat,
      answerToChat,
      fetchChat,
      changeStatusChatAction,
    } = this.props;

    const { isForwarding } = this.state;
    const replyId = reply ? reply.id : null;

    if (!text.length) return;
    if (isForwarding) {
      addToChat(chatType, chatTypeId, text);
    } else {
      if (admin) {
        if (chatType === PRIVATE_CHAT_ID) {
          this.concatChat("privateChats", text, reply);
          changeStatusChatAction(groupId);
          answerToChat(groupId, text, chatType, chatTypeId, replyId).then(() =>
            fetchChat(PRIVATE_CHAT_ID, chatTypeId, null, 0)
          );
        }
        if (chatType === PUBLIC_CHAT_ID) {
          this.concatChat("commonChats", text, reply);
          answerToChat(groupId, text, chatType, chatTypeId, replyId).then(() =>
            fetchChat(PUBLIC_CHAT_ID, chatTypeId, null, 0)
          );
        }
        if (chatType === ALL_USERS_CHAT_ID) {
          this.concatChat("allUsersChats", text, reply);
          answerToChat(groupId, text, chatType, chatTypeId, replyId).then(() =>
            fetchChat(ALL_USERS_CHAT_ID, chatTypeId, null, 0)
          );
        }
        if (chatType === SPECIALIZATION_CHAT_ID) {
          this.concatChat("specializationChats", text, reply);
          answerToChat(groupId, text, chatType, chatTypeId, replyId).then(() =>
            fetchChat(SPECIALIZATION_CHAT_ID, chatTypeId, null, 0)
          );
        }
      } else {
        if (chatType === PUBLIC_CHAT_ID) {
          answerToChat(id, text, PUBLIC_CHAT_ID, chatTypeId, replyId);
          this.concatChat("commonChats", text, reply);
        }
        if (chatType === PRIVATE_CHAT_ID) {
          answerToChat(id, text, PRIVATE_CHAT_ID, chatTypeId, replyId);
          this.concatChat("privateChats", text, reply);
        }
        if (chatType === ALL_USERS_CHAT_ID) {
          answerToChat(id, text, ALL_USERS_CHAT_ID, chatTypeId, replyId);
          this.concatChat("allUsersChats", text, reply);
        }
        if (chatType === SPECIALIZATION_CHAT_ID) {
          answerToChat(id, text, SPECIALIZATION_CHAT_ID, '131816605', replyId);
          this.concatChat("specializationChats", text, reply);
        }
        if (chatType === TEAM_CHAT_ID) {
          answerToChat(id, text, TEAM_CHAT_ID, chatTypeId, replyId);
          this.concatChat("teamChats", text, reply);
        } else {
          answerToChat(id, text, chatType, chatTypeId, replyId);
          this.concatChat("singleChats", text, reply);
        }
      }
    }
  }

  concatChat(chatType, text, reply) {
    const {
      userId,
      user,
      renderPrivateChat = [],
      renderPublicChat = [],
      renderTeamChat = [],
      renderAllUsersChat = [],
      renderSingleChat = [],
      concatPrivateChatAction,
      concatTeamChatAction,
      concatPublicChatAction,
      concatAllUsersChatAction,
      concatSingleChatAction,
    } = this.props;
    const replyInfo = reply
      ? {
        text: reply.text,
        fullName: reply.fullName,
      }
      : null;

    if (chatType === "privateChats") {
      let chats = renderPrivateChat.concat({
        date: moment(),
        text: text,
        id: +new Date(),
        isRead: true,
        userInfo: {
          id: userId,
          firstName: user.firstName,
          lastName: user.lastName,
          photo: user.photo,
        },
        replyInfo: replyInfo,
      });
      concatPrivateChatAction(chats);
    }
    if (chatType === "allUsersChats") {
      let chats = renderAllUsersChat.concat({
        date: moment(),
        text: text,
        id: +new Date(),
        userInfo: {
          id: userId,
          firstName: user.firstName,
          lastName: user.lastName,
          photo: user.photo,
        },
        replyInfo: replyInfo,
      });
      concatAllUsersChatAction(chats);
    }
    if (chatType === "specializationChats") {
      let chats = renderSpecializationChat.concat({
        date: moment(),
        text: text,
        id: +new Date(),
        userInfo: {
          id: userId,
          firstName: user.firstName,
          lastName: user.lastName,
          photo: user.photo,
        },
        replyInfo: replyInfo,
      });
      concatSpecializationChatAction(chats);
    }
    if (chatType === "teamChats") {
      let chats = renderTeamChat.concat({
        date: moment(),
        text: text,
        id: +new Date(),
        userInfo: {
          id: userId,
          firstName: user.firstName,
          lastName: user.lastName,
          photo: user.photo,
        },
        replyInfo: replyInfo,
      });
      concatTeamChatAction(chats);
    }

    if (chatType === "commonChats") {
      let chats = renderPublicChat.concat({
        date: moment(),
        text: text,
        isRead: true,
        id: +new Date(),
        userInfo: {
          id: userId,
          firstName: user.firstName,
          lastName: user.lastName,
          photo: user.photo,
        },
        replyInfo: replyInfo,
      });
      concatPublicChatAction(chats);
    }
    if (chatType === "singleChats") {
      let chats = renderSingleChat.concat({
        date: moment(),
        text: text,
        isRead: true,
        id: +new Date(),
        userInfo: {
          id: userId,
          firstName: user.firstName,
          lastName: user.lastName,
          photo: user.photo,
        },
        replyInfo: replyInfo,
      });
      concatSingleChatAction(chats);
    }
    setTimeout(() => {
      this.scrollTop();
    }, 10);
  }

  toggleForwarding() {
    this.setState({
      isForwarding: !this.state.isForwarding,
    });
  }

  listenToReadNewMessage(chat, newMessage) {
    const {
      privateChats,
      changeChatComments,
      setUnReadComments,
      teamChats,
      publicChats,
      allUsersChats,
      specializationChats,
    } = this.props;
    const chatSetRead = () => {
      if (this.connection) {
        const { userId, typeId, chatType } = this.props;
        this.connection.invoke("ChatSetRead", userId, chatType, typeId);
        newMessage.style.display = "none";
        chat.removeEventListener("scroll", scrollHandler);
        if (chatType === 1) {
          const comments = publicChats.comments.map((item) => {
            if (!item.isRead) {
              item.isRead = true;
            }
            return item;
          });
          changeChatComments("publicChats", comments);
          setUnReadComments("publicChats", 0);
        }
        if (chatType === 2) {
          const comments = privateChats.comments.map((item) => {
            if (!item.isRead) {
              item.isRead = true;
            }
            return item;
          });
          changeChatComments("privateChats", comments);
          setUnReadComments("privateChats", 0);
        }
        if (chatType === 7) {
          const comments = allUsersChats.comments.map((item) => {
            if (!item.isRead) {
              item.isRead = true;
            }
            return item;
          });
          changeChatComments("allUsersChats", comments);
          setUnReadComments("allUsersChats", 0);
        }
        if (chatType === 11) {
          const comments = specializationChats.comments.map((item) => {
            if (!item.isRead) {
              item.isRead = true;
            }
            return item;
          });
          changeChatComments("specializationChats", comments);
          setUnReadComments("specializationChats", 0);
        }
        if (chatType === 9) {
          const comments = teamChats.comments.map((item) => {
            if (!item.isRead) {
              item.isRead = true;
            }
            return item;
          });
          changeChatComments("teamChats", comments);
          setUnReadComments("teamChats", 0);
        }
      }

      const scrollHandler = () => {
        if (chat.children[0].offsetHeight) {
          if (
            chat.children[0].offsetHeight - chat.scrollTop - chat.offsetHeight <
            3
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
    };
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

  scrollToMsg = (id) => {
    let chat = document.querySelector("#chat-list");
    let msgs = chat.querySelectorAll("#message-item");
    let search = null;
    let msgText = null;

    msgs.forEach((item) => {
      if (item.getAttribute("data-msg") == id) {
        search = item;
      }
    });

    if (search) {
      msgText = search.querySelector(".msg-text");
    }
    if (msgText) {
      msgText.style.background = "#bbcfea";
      search.scrollIntoView(false);
      setTimeout(() => {
        msgText.style.background = "";
      }, 300);
    }
  };

  renderChat(chatType) {
    const {
      typeId,
      fetchChat,
      renderPublicChatAction,
      renderPrivateChatAction,
      renderTeamChatAction,
      renderAllUsersChatAction,
      renderSingleAction,
      allUsersChats,
      privateChats,
      teamChats,
      publicChats,
      singleChat,
    } = this.props;

    if (chatType === PUBLIC_CHAT_ID) {
      if (!publicChats.comments || !publicChats.comments.length) {
        fetchChat(publicChats, null);
      } else {
        renderPublicChatAction(publicChats.comments);
      }
    }
    if (chatType === PRIVATE_CHAT_ID) {
      if (!privateChats.comments || !privateChats.comments.length) {
        fetchChat(PRIVATE_CHAT_ID, null);
      } else {
        renderPrivateChatAction(privateChats.comments);
      }
    }
    if (chatType === ALL_USERS_CHAT_ID) {
      if (!allUsersChats.comments || !allUsersChats.comments.length) {
        fetchChat(ALL_USERS_CHAT_ID, null);
      } else {
        renderAllUsersChatAction(allUsersChats.comments);
      }
    }
    if (chatType === SPECIALIZATION_CHAT_ID) {
      if (
        !specializationChats.comments ||
        !specializationChats.comments.length
      ) {
        fetchChat(SPECIALIZATION_CHAT_ID, '131816605');
      } else {
        renderSpecializationChatAction(specializationChats.comments);
      }
    }
    if (chatType === TEAM_CHAT_ID) {
      if (!teamChats.comments || !teamChats.comments.length) {
        fetchChat(TEAM_CHAT_ID, null);
      } else {
        renderTeamChatAction(teamChats.comments);
      }
    }

    if (chatType === 10) {
      if (!singleChat.comments || !singleChat.comments.length) {
        fetchChat(10, null);
      } else {
        renderSingleChatAction(singleChat.comments);
      }
    }
    if (chatType === 11) {
      if (!singleChat.comments || !singleChat.comments.length) {
        fetchChat(11, null);
      } else {
        renderSingleChatAction(singleChat.comments);
      }
    }
    setTimeout(() => {
      this.scrollTop();
    }, 10);
  }

  changeChat(chatType) {
    const { typeId, clearRenderChat, changeChatType } = this.props;

    //clearRenderChat()
    changeChatType(chatType);

    this.renderChat(chatType);
  }

  componentWillUnmount() {
    this.connection
      .stop()
      .then(() => { })
      .catch((err) => console.log(err));
  }

  updateChatWs() {
    const { type, userId, fetchChat, admin, chatType } = this.props;
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl("https://online.antiage-expert.com/chat")
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Debug)
      .build();
    let arr = window.location.pathname.split("/");
    this.connection.on("Send", (message) => {
      if (admin) {
        if (chatType === 1) {
          fetchChat(chatType, null, null, true);
        }
      } else {
        if (message === "update_private") {
          fetchChat(PRIVATE_CHAT_ID, null, null, true);
        }
        if (message === "update_allUsers") {
          fetchChat(ALL_USERS_CHAT_ID, null, null, true);
        }
        if (message === "update_public") {
          fetchChat(PUBLIC_CHAT_ID, null, null, true);
        }
        if (message === "update_team") {
          fetchChat(TEAM_CHAT_ID, null, null, true);
          console.log("what??")
        }
        if (message === "update_specialization") {
          fetchChat(SPECIALIZATION_CHAT_ID, "131816605", null, true);
        }
      }
    });

    this.connection
      .start()
      .then(() => {
        return this.connection.invoke("ConnectUser", userId);
      })
      .catch((err) => console.log(err));
  }

  pinChat = (type, typeId) => {
    const { fetchChatList } = this.props;
    postPinChat({
      authToken: cookie.load("token"),
      data: {
        type: type,
        typeId: typeId,
      },
    }).then(fetchChatList());
  };

  unpinChat = (type, typeId) => {
    const { fetchChatList } = this.props;
    postUnpinChat({
      authToken: cookie.load("token"),
      data: {
        type: type,
        typeId: typeId,
      },
    }).then(fetchChatList());
  };

  leaveChatAction = (type, typeId) => {
    deleteUser({
      authToken: cookie.load("token"),
      data: {
        type: type,
        typeId: typeId,
      },
    }).then(() => browserHistory.push("/chats"));
  };

  clearChat = () => {
    const { clearRenderChat } = this.props;
    clearRenderChat();
  };
  sendSearchMessageRequest = () => {};

  render() {
    const { isForwarding, isMessageValid } = this.state;

    const {
      isTaskChat,
      userId,
      publicChats,
      privateChats,
      teamChats,
      allUsersChats,
      specializationChats,
      isWindow = true,
      isFetching,
      showAdminPanel = true,
      status,
      chatType,
      chatTypeId,
      admin,
      renderPrivateChat,
      renderPublicChat,
      renderTeamChat,
      renderAllUsersChat,
      renderSingleChat,
      role,
      fetchChat,
      changeChatType,
      isFetchingChat,
      typeId,
      miniChat,
      userInfo,
      adminChatOpen,
      lang,
      singleChat,
      chatInfo,
    } = this.props;
    const idGroup = privateChats.id ? privateChats.id : 0;

    const chat = (
      <ChatBlock
        // Data
        clearChat={this.clearChat}
        chatInfo={chatInfo}
        lang={lang}
        userId={userId}
        role={role}
        singleChat={renderSingleChat}
        messageChats={renderPrivateChat}
        commonChats={renderPublicChat}
        privateChats={renderPrivateChat}
        teamChats={renderTeamChat}
        allUsersChats={renderAllUsersChat}
        specializationChats={renderSpecializationChat}
        unReadPublicChat={this.state.unReadPublicChat}
        unReadPrivateChat={this.state.unReadPrivateChat}
        unReadTeamChat={this.state.unReadTeamChat}
        unReadAllUsersChat={this.state.unReadAllUsersChat}
        unReadSpecializationChat={this.state.unReadSpecializationChat}
        isLoadMorePrivate={
          privateChats.skip + privateChats.take < privateChats.counts
        }
        isLoadMoreTeam={teamChats.skip + teamChats.take < teamChats.counts}
        isLoadMorePublic={
          publicChats.skip + publicChats.take < publicChats.counts
        }
        isLoadMoreAllUsers={
          allUsersChats.skip + allUsersChats.take < allUsersChats.counts
        }
        isLoadMoreSpecialization={
          specializationChats.skip + specializationChats.take <
          specializationChats.counts
        }
        admin={admin}
        typeId={typeId}
        toggleMiniChatSmall={this.toggleMiniChatSmall.bind(this)}
        toggleMiniChat={this.toggleMiniChat.bind(this)}
        miniChat={miniChat}
        userInfo={userInfo}
        isFetching={isFetching}
        fetchChat={fetchChat}
        miniChatSmall={this.state.miniChatSmall}
        miniChatOpen={this.state.miniChatOpen}
        isFetchingChat={isFetchingChat}
        chat={chatType}
        chatTypeId={chatTypeId}
        isPaid={
          chatType === TEAM_CHAT_ID
            ? teamChats.isPaid
            : chatType === PUBLIC_CHAT_ID
              ? publicChats.isPaid
              : null
        }
        changeChat={this.changeChat.bind(this)}
        sendButtonText={isForwarding ? "Переадресовать" : "Ответить"}
        placeholderText={
          isForwarding ? "Сообщение суперадмину" : "Сообщение пользователю"
        }
        // Flags
        isForwarding={isForwarding}
        isMessageValid={isMessageValid}
        scrollToMsg={this.scrollToMsg}
        onMessageChanged={(e) => this.checkMessageLength(e)}
        onMessageSend={(message, reply) => this.sendMessage(message, reply)}
        pinChat={this.pinChat}
        unpinChat={this.unpinChat}
        sendSearchMessageRequest={this.sendSearchMessageRequest}
        leaveChat={this.leaveChatAction}
      />
    );

    let style;
    if (isWindow) {
      style = styles.chatWindow;
    } else if (isForwarding) {
      style = styles.chatForwarding;
    }

    return adminChatOpen || !showAdminPanel ? (
      <div>
        <div
          className={classnames(styles.chat, { [styles.chatMini]: miniChat })}
        >
          {showAdminPanel && (
            <svg
              onClick={() => this.closeChat()}
              className={styles.minionChatCloseIcon}
            >
              <use xlinkHref="#ico-close"></use>
            </svg>
          )}

          {!isFetching && showAdminPanel && chatType === 2 ? (
            <div className={styles.chatAdminPanel}>
              {!isForwarding ? (
                <button
                  onClick={() => this.waiting(idGroup)}
                  className={styles.chatAdminPanelBtnSecondary}
                >
                  Жду ответа
                </button>
              ) : null}
              <button
                onClick={() => this.toggleForwarding()}
                className={styles.chatAdminPanelBtnAction}
              >
                {isForwarding ? "Отмена" : "Переадресовать"}
              </button>
              {status !== 2 && (
                <button
                  onClick={() => this.answered(idGroup)}
                  className={styles.minionChatButtonForwardPrimary}
                >
                  Чат отвечен
                </button>
              )}
            </div>
          ) : null}

          {renderSingleChat && chat}
        </div>
      </div>
    ) : null;
  }
}
const mapStateToProps = (state) => {
  const { userInfo, lang } = state;

  const {
    publicChats,
    privateChats,
    teamChats,
    allUsersChats,
    specializationChats,
    messageChats,
    isFetching,
    isFetchingChat,
    renderPrivateChat,
    renderPublicChat,
    renderTeamChat,
    renderAllUsersChat,
    renderSingleChat,
    singleChat,
    chatInfo,
  } = state.chat;
  const chatsTest = state.chats;
  const {
    adminChatOpen,
    groupId,
    //chatTypeId,
    /*chatType,*/ typeId,
  } = state.chats;
  return {
    publicChats,
    privateChats,
    allUsersChats,
    teamChats,
    messageChats,
    specializationChats,
    renderPrivateChat,
    renderPublicChat,
    renderTeamChat,
    renderAllUsersChat,
    renderSingleChat,
    isFetching,
    chatsTest,
    adminChatOpen,
    groupId,
    typeId,
    /*chatType,*/
    //chatTypeId,
    userInfo,
    isFetchingChat,
    lang,
    singleChat,
    chatInfo,
  };
};
const mapDispatchToProps = (dispatch) => ({
  fetchChatList: bindActionCreators(fetchChatList, dispatch),
  fetchSingleChat: bindActionCreators(fetchSingleChat, dispatch),
  fetchChats: bindActionCreators(fetchChats, dispatch),
  fetchChat: bindActionCreators(fetchChat, dispatch),
  closeChat: bindActionCreators(closeChat, dispatch),
  addToChat: bindActionCreators(addToChat, dispatch),
  answerToChat: bindActionCreators(answerToChat, dispatch),
  answeredChat: bindActionCreators(answeredChat, dispatch),
  waitingFromChat: bindActionCreators(waitingFromChat, dispatch),
  concatPrivateChatAction: bindActionCreators(
    concatPrivateChatAction,
    dispatch
  ),
  concatAllUsersChatAction: bindActionCreators(
    concatAllUsersChatAction,
    dispatch
  ),
  concatPublicChatAction: bindActionCreators(concatPublicChatAction, dispatch),
  concatTeamChatAction: bindActionCreators(concatTeamChatAction, dispatch),
  concatSingleChatAction: bindActionCreators(concatSingleChatAction, dispatch),
  renderPublicChatAction: bindActionCreators(renderPublicChatAction, dispatch),
  renderSingleChatAction: bindActionCreators(renderSingleChatAction, dispatch),
  renderAllUsersChatAction: bindActionCreators(
    renderAllUsersChatAction,
    dispatch
  ),
  renderPrivateChatAction: bindActionCreators(
    renderPrivateChatAction,
    dispatch
  ),
  renderTeamChatAction: bindActionCreators(renderTeamChatAction, dispatch),
  renderSpecializationChatAction: bindActionCreators(
    renderSpecializationChatAction,
    dispatch
  ),
  changeStatusChatAction: bindActionCreators(changeStatusChatAction, dispatch),
  changeChatType: bindActionCreators(changeChatType, dispatch),
  setTypeId: bindActionCreators(setTypeId, dispatch),
  clearRenderChat: bindActionCreators(clearRenderChat, dispatch),
  changeChatComments: bindActionCreators(changeChatComments, dispatch),
  setUnReadComments: bindActionCreators(setUnReadComments, dispatch),
  setUnReadMsgs: bindActionCreators(setUnReadMsgs, dispatch),
  dispatch,
});

Chat = connect(mapStateToProps, mapDispatchToProps)(Chat);

export default CSSModules(Chat, styles);
