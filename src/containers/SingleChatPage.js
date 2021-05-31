import PropTypes from 'prop-types';
import React, { Component } from "react";
import { connect } from "react-redux";
import classNames from "classnames/bind";
import Layout from "../components/componentKit2/Layout";
import {  
  fetchSingleChat,
  fetchChatInfo,
  fetchChat,
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
  PRIVATE_CHAT_ID,
  PUBLIC_CHAT_ID,
  TEAM_CHAT_ID,
  ALL_USERS_CHAT_ID,
  fetchTaskDayIfNeeded,
  setMenuList,
  unpinChatAction,
  pinChatAction,
  deleteUserAction,
} from "../actions";

import CSSModules from "react-css-modules";
import styles from "./chatPage.css";
import Loader from "../components/componentKit/Loader";
const signalR = require("@aspnet/signalr");
import cookie from "react-cookie";
import ChatBlock from "../components/Chat/ChatBlock";
import ChatEditBlock from "./ChatEditBlock.js";
import moment from "moment";
import { browserHistory } from "react-router";
import { chat } from "../reducers/chats";
import { wsConnection, startConnection, listenToMessages, sendMessageRequest, listenToUnreadMessages, stopConnection } from "../utils/";

/**
 *  Контейнер ChatPage.
 *  Используется для отображения страницы Чата (/chats)
 *
 */
const cx = classNames.bind(styles);

class SingleChatPage extends Component {
  /**
   * @memberof ChatPage
   * @prop {object} propTypes - the props that are passed to this component
   * @prop {func} propTypes.clearRenderChat Очистка чата
   * @prop {func} propTypes.setMenuList установка выбранной старницы в меню
   * @prop {func} propTypes.fetchTaskDayIfNeeded Получение данных для страницы дня
   * @prop {object} propTypes.userInfo Данные пользователя
   *
   * */
  static propTypes = {
    clearRenderChat: PropTypes.func.isRequired,
    /**
     * Функция Очистка чата
     * @memberof ChatPage
     * @param {number} page - Номер выбранной страницы
     */
    setMenuList: PropTypes.func.isRequired,
    /**
     * Функция Очистка чата
     * @memberof ChatPage
     * @param {string} day - Номер дня.
     */
    fetchTaskDayIfNeeded: PropTypes.func.isRequired,
    userInfo: PropTypes.object.isRequired,
  };

  state = {
    isForwarding: false,
    miniChatOpen: false,
    miniChatSmall: true,
    isEditBlockOn: false,
    unReadCount: 0,
  };

  componentDidMount() {
    const {
      fetchSingleChat,
      fetchTaskDayIfNeeded,
      selectedTaskDay,
      fetchChatInfo,
      setMenuList,
      location
    } = this.props;
    const { role } = this.props; //undefined
    const { miniChat, changeChatType } = this.props;
    console.log("smth0")
    setMenuList("chats");
    fetchTaskDayIfNeeded(selectedTaskDay);
    fetchSingleChat(location.state.type, location.state.typeId);
    fetchChatInfo(location.state.type, location.state.typeId);

    const miniChatState =
      cookie.load("miniChatSmall") === undefined
        ? 1
        : parseInt(cookie.load("miniChatSmall"));

    miniChatState ? this.setState({ miniChatSmall: true }) : this.setState({ miniChatSmall: false}) 

    role === 2 && changeChatType(PUBLIC_CHAT_ID);

    this.updateChatWs();
    !miniChat && this.scrollTop();
    
  }

  toggleMiniChat(bool) {
    this.setState({ miniChatOpen: bool });
    //clearRenderChat()
  }

  componentDidUpdate(prevProps) {
    const { renderSingleChatAction, singleChat } = this.props;
    
    if (prevProps.singleChat !== this.props.singleChat) {
      renderSingleChatAction(singleChat.comments);
    }
    if (prevProps.renderSingleChat !== this.props.renderSingleChat) {
      setTimeout(() => this.scrollTop())
     
    }

    if (prevProps.userInfo != this.props.userInfo) {     
      this.updateChatWs() 
        }

    //TODo: check if needed
    //if (prevProps.chatInfo !== this.props.chatInfo)
    //  fetchChatInfo(location.state.type, location.state.typeId);

  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.selectedTaskDay !== this.props.selectedTaskDay) {
      const { fetchTaskDayIfNeeded, selectedTaskDay } = nextProps;
      fetchTaskDayIfNeeded(selectedTaskDay);
    }
  }

  componentWillUnmount() {
    //stopConnection()
     this.connection
     .stop()
     .then(() => { })
     .catch((err) => console.log(err));
  }

 async updateChatWs() {

    
     this.connection = new signalR.HubConnectionBuilder()
      .withUrl("https://dev.todayme.ru/chat")
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Debug)
       .build();
     let arr = window.location.pathname.split("/");
    
     this.connection.on("newChatMessage",  //(message)=> console.log("message: ", message))
      (message) => this.concatChat(message))


    this.connection
       .start()
       .then(() => { return this.connection.invoke("ConnectUser", this.props.userInfo.data.id) })
      .catch((err) => console.log(err));
      
     //await startConnection(this.props.userInfo.data.id)
    // listenToMessages(this.concatChat, this.props.userInfo.data.id)

     //wsConnection.on("newChatMessage",  (message)=> this.concatChat(message))
      
  }

  concatChat(message) {
    const { renderSingleChat = [] } = this.props;
  
    const replyInfo = message.replyInfo
        ? 
          {
            text: message.replyInfo.text,
            fullName: message.replyInfo.userInfo.firstName,
          }
        : 
            null;     
        
    const chats = renderSingleChat.concat({
        date: message.date,
        text: message.text,
        isRead: message.isRead,
        id: message.id,//+new Date(),
        userInfo: {
          id: message.userInfo.id,
          firstName: message.userInfo.firstName,
          lastName: message.userInfo.lastName,
          photo: message.userInfo.photo,
        },
        replyInfo: replyInfo,
      });

    this.props.concatSingleChatAction(chats);
    
    setTimeout(() => { this.scrollTop() }, 10);
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
    const { location, addToChat } = this.props;

    const { isForwarding } = this.state;
    const chatType = location.state.type;
    const chatTypeId = location.state.typeId;
    const replyId = reply ? reply.id : null;


    if (!text.length) return;
    if (isForwarding) {
      addToChat(chatType, chatTypeId, text);
    } else {
      /*if (admin) {
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
        }*/
       
        const data = {
          "AuthToken": cookie.load("token"),
          "Data": { 
              "typeId":chatTypeId,   
              "type":chatType,   
              "text":text,
              "reply": replyId
  }
}

        this.connection.invoke("ChatMessageCreate", JSON.stringify(data));
        //sendMessageRequest(data)
    }
  }

  

  toggleForwarding() {
    this.setState({
      isForwarding: !this.state.isForwarding,
    });
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
    const { singleChat, userInfo } = this.props;
    const { typeId, type } = singleChat;
    
    const chatSetRead = () => {
      if (this.connection) {
        //const { userId, typeId, chatType } = this.props;
        this.connection.invoke("ChatSetReadToDate", userInfo.data.id, type, typeId, moment() );
        //listenToUnreadMessages(userInfo.data.id, type, typeId)
        newMessage.style.display = "none";
        chat.removeEventListener("scroll", scrollHandler);
    }
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


  //used for minichat
  renderChat(chatType) {
    const {
      fetchChat,
      renderPublicChatAction,
      renderPrivateChatAction,
      renderTeamChatAction,
      renderAllUsersChatAction,
      renderSingleChatAction,
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

  // used for minichat tabs
  changeChat(chatType) {
    const { typeId, clearRenderChat, changeChatType } = this.props;
    //clearRenderChat()
    changeChatType(chatType);
    this.renderChat(chatType);
  }

  clearChat = () => this.props.clearRenderChat();

  pinChat = (type, typeId) => this.props.pinChatAction(type, typeId);
    
  unpinChat = (type, typeId) => this.props.unpinChatAction(type, typeId);

  leaveChatAction = (type, typeId) => {
    const { deleteUserAction, userInfo } = this.props;
    deleteUserAction(type, typeId, userInfo.data.id).then(() =>
      browserHistory.push("/chats")
    );
  };

  sendSearchMessageRequest = (type, typeId, searchMessage, dateStart, dateEnd) => {
    this.props.fetchSingleChat(type, typeId, searchMessage, dateStart, dateEnd);
  };

  showEditChatBlock = () => this.setState({ isEditBlockOn: true });

  closeEditBlock = () => this.setState({ isEditBlockOn: false });
  

  render() {
    const { isForwarding, isMessageValid, isEditBlockOn } = this.state;
    const {
      taskDay,
      userInfo,
      singleChat,
      location,
      publicChats,
      privateChats,
      teamChats,
      allUsersChats,
      isWindow = true,
      isFetching,
      showAdminPanel = true,
      admin,
      renderSingleChat,
      fetchChat,
      isFetchingChat,
      typeId,
      miniChat,
      lang,
      chatInfo,
    } = this.props;
    const { role } = userInfo.data;

    return (
      <Layout
        location={location}
        page={"chats"}
        prevSeasons={userInfo.data.prevSeasons}
      >
        {taskDay && taskDay.data && taskDay.data.length !== 0 ? (
          chatInfo &&
          !isEditBlockOn && (
            <ChatBlock
              // Data
              clearChat={this.clearChat}
              chatInfo={chatInfo}
              lang={lang}
              userId={taskDay.data[0].user.id}
              role={role}
              singleChat={renderSingleChat}
              unReadPublicChat={this.state.unReadPublicChat}
              unReadPrivateChat={this.state.unReadPrivateChat}
              unReadTeamChat={this.state.unReadTeamChat}
              unReadAllUsersChat={this.state.unReadAllUsersChat}
              isLoadMorePrivate={
                privateChats.skip + privateChats.take < privateChats.counts
              }
              isLoadMoreTeam={
                teamChats.skip + teamChats.take < teamChats.counts
              }
              isLoadMorePublic={
                publicChats.skip + publicChats.take < publicChats.counts
              }
              isLoadMoreAllUsers={
                allUsersChats.skip + allUsersChats.take < allUsersChats.counts
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
              chat={location.state.type}
              chatTypeId={location.state.typeId}
              isPaid={singleChat.isPaid}
              changeChat={this.changeChat.bind(this)}
              sendButtonText={isForwarding ? "Переадресовать" : "Ответить"}
              placeholderText={
                isForwarding
                  ? "Сообщение суперадмину"
                  : "Сообщение пользователю"
              }
              // Flags
              isForwarding={isForwarding}
              isMessageValid={isMessageValid}
              scrollToMsg={this.scrollToMsg}
              onMessageChanged={(e) => this.checkMessageLength(e)}
              onMessageSend={(message, reply) =>
                this.sendMessage(message, reply)
              }
              pinChat={this.pinChat}
              unpinChat={this.unpinChat}
              sendSearchMessageRequest={this.sendSearchMessageRequest}
              leaveChat={this.leaveChatAction}
              editChat={this.showEditChatBlock}
            />
          )
        ) : (
            <Loader />
          )}
        {isEditBlockOn && chatInfo && (
          <ChatEditBlock closeChat={this.closeEditBlock} />
        )}
      </Layout>
    );
  }
}

const mapStateToProps = (state) => {
  const {
    selectedReports,
    selectedDayId,
    chats,
    recivedReports,
    selectedTaskDay,
    recivedTaskDay,
    userInfo,
    taskDayData,
    lang,
  } = state;

  const {
    singleChat,
    publicChats,
    privateChats,
    teamChats,
    messageChats,
    allUsersChats,
    specializationChats,
    //isFetching,
    isFetchingChat,
    renderPrivateChat,
    renderPublicChat,
    renderTeamChat,
    renderAllUsersChat,
    renderSingleChat,
    chatInfo,
  } = state.chat;
  const { adminChatOpen, groupId, chatTypeId, typeId } = state.chats;

  const { isFetching, reports } = recivedReports[selectedReports] || {
    isFetching: true,
    reports: [],
  };
  const { taskDay } = recivedTaskDay[selectedTaskDay] || {
    isFetching: true,
    taskDay: {},
  };

  return {
    singleChat,
    publicChats,
    privateChats,
    teamChats,
    messageChats,
    allUsersChats,
    specializationChats,
    renderPrivateChat,
    renderPublicChat,
    renderTeamChat,
    renderAllUsersChat,
    renderSingleChat,
    isFetching,
    adminChatOpen,
    groupId,
    typeId,
    /*chatType,*/
    chatTypeId,
    userInfo,
    isFetchingChat,
    taskDay,
    userInfo,
    chats,
    recivedTaskDay,
    selectedTaskDay,
    selectedDayId,
    selectedReports,
    isFetching,
    taskDayData,
    reports,
    lang,
    chatInfo,
  };
};

SingleChatPage = connect(mapStateToProps, {
  fetchTaskDayIfNeeded,
  setTypeId,
  clearRenderChat,
  fetchChat,
  fetchSingleChat,
  fetchChatInfo,
  setMenuList,  
  closeChat,
  addToChat,
  answerToChat,
  answeredChat,
  waitingFromChat,
  concatPrivateChatAction,
  concatAllUsersChatAction,
  concatPublicChatAction,
  concatTeamChatAction,
  concatSingleChatAction,
  renderPublicChatAction,
  renderAllUsersChatAction,
  renderPrivateChatAction,
  renderTeamChatAction,
  renderSingleChatAction,
  changeStatusChatAction,
  changeChatType,
  changeChatComments,
  setUnReadComments,
  setUnReadMsgs,
  unpinChatAction,
  pinChatAction,
  deleteUserAction,
})(SingleChatPage);

export default CSSModules(SingleChatPage, styles);
