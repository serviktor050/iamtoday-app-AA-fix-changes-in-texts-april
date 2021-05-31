import React, { Component } from "react";
import CSSModules from "react-css-modules";
import moment from "moment";
import { connect, bindActionCreators } from "react-redux";
import styles from "./ChatList.css";
import ChatTabItem from "../components/Chat/ChatTabItem";
import { Link, browserHistory } from "react-router";
import {
  PUBLIC_CHAT_ID,
  PRIVATE_CHAT_ID,
  TEAM_CHAT_ID,
  ALL_USERS_CHAT_ID,
  SPECIALIZATION_CHAT_ID,
  fetchChat,
  fetchTaskDayIfNeeded,
  setTypeId,
  setMenuList,
  clearRenderChat,
  fetchChats,
  closeChat,
  addToChat,
  answerToChat,
  answeredChat,
  waitingFromChat,
  concatPrivateChatAction,
  concatTeamChatAction,
  concatPublicChatAction,
  concatAllUsersChatAction,
  concatSpecializationChatAction,
  setUnReadComments,
  changeChatComments,
  renderPublicChatAction,
  renderPrivateChatAction,
  renderTeamChatAction,
  renderAllUsersChatAction,
  renderSpecializationChatAction,
  changeChatType,
  changeStatusChatAction,
  setUnReadMsgs,
} from "../actions";
import { getFIO } from "../utils/helpers";
import { dict } from "dict";
import { fromPairs } from "ramda";

class ChatList extends Component {
  /*conponentDidMount(){
    this.props.changeChat(PRIVATE_CHAT_ID)
  }*/

  onClickTabs(tab) {
    //this.props.changeChat(tab);

    browserHistory.push(`${location.pathname}/${tab}`);
  }

  formatDate = (date) => {
    return moment(date).format("DD.MM.YYYY");
  };

  /*content() {
    const {
      role,
      workTeam,
      isPaid,
      lang,
      publicChats,
      privateChats,
      teamChats,
      allUsersChats,
    } = this.props;*/

  allUsersTab = () => {
    const { role, allUsersChats } = this.props;
    const { photo, comments, unreadCount, id, type, name } = allUsersChats;
    const messageAuthor = comments[0]
      ? `${comments[comments.length - 1].userInfo.firstName} ${
          comments[comments.length - 1].userInfo.lastName
        }`
      : null;

    return (
      <li>
        {allUsersChats && comments && Boolean(comments.length) && (
          <ChatTabItem
            onClickTabs={() =>
              browserHistory.push(`${location.pathname}/${type}`)
            }
            tabName={ALL_USERS_CHAT_ID}
            role={role}
            active={this.props.chat}
            chatAvatar={photo}
            lastMessageDate={this.formatDate(
              comments[comments.length - 1].date
            )}
            lastMessageAuthor={messageAuthor}
            lastMessage={comments[comments.length - 1].text}
            unreadMessages={unreadCount}
          >
            {name}
          </ChatTabItem>
        )}
      </li>
    );
  };

  specializationTab = () => {
    const { role, specializationChats } = this.props;
    const {
      photo,
      comments,
      unreadCount,
      id,
      type,
      name,
    } = specializationChats;
    const messageAuthor = comments[0]
      ? `${comments[comments.length - 1].userInfo.firstName} ${
          comments[comments.length - 1].userInfo.lastName
        }`
      : null;

    return (
      <li>
        {specializationChats && comments && Boolean(comments.length) && (
          <ChatTabItem
            onClickTabs={() =>
              browserHistory.push(`${location.pathname}/${type}`)
            }
            tabName={SPECIALIZATION_CHAT_ID}
            role={role}
            active={this.props.chat}
            chatAvatar={photo}
            lastMessageDate={this.formatDate(
              comments[comments.length - 1].date
            )}
            lastMessageAuthor={messageAuthor}
            lastMessage={comments[comments.length - 1].text}
            unreadMessages={unreadCount}
          >
            {name}
          </ChatTabItem>
        )}
      </li>
    );
  };

  privateTab = () => {
    const { role, privateChats } = this.props;
    const { photo, comments, unreadCount, id, type, name } = privateChats;
    const messageAuthor = comments[0]
      ? `${comments[comments.length - 1].userInfo.firstName} ${
          comments[comments.length - 1].userInfo.lastName
        }`
      : null;

    return (
      <li>
        {privateChats && comments && Boolean(comments.length) && (
          <ChatTabItem
            onClickTabs={() =>
              browserHistory.push(`${location.pathname}/${type}`)
            }
            tabName={PRIVATE_CHAT_ID}
            role={role}
            active={this.props.chat}
            chatAvatar={photo}
            lastMessageDate={this.formatDate(
              comments[comments.length - 1].date
            )}
            lastMessageAuthor={messageAuthor}
            lastMessage={comments[comments.length - 1].text}
            unreadMessages={unreadCount}
          >
            {name}
          </ChatTabItem>
        )}
      </li>
    );
  };
  teamTab = () => {
    const { role, teamChats } = this.props;
    const { id, isPaid, photo, comments, unreadCount, type, name } = teamChats;
    const messageAuthor = comments[0]
      ? `${comments[comments.length - 1].userInfo.firstName} ${
          comments[comments.length - 1].userInfo.lastName
        }`
      : null;
    return (
      <li>
        {teamChats && comments && Boolean(comments.length) && (
          <ChatTabItem
            onClickTabs={() =>
              browserHistory.push(`${location.pathname}/${type}`)
            }
            tabName={TEAM_CHAT_ID}
            role={role}
            isPaid={isPaid}
            active={this.props.chat}
            chatAvatar={photo}
            lastMessageDate={this.formatDate(
              comments[comments.length - 1].date
            )}
            lastMessageAuthor={messageAuthor}
            lastMessage={comments[comments.length - 1].text}
            unreadMessages={unreadCount}
          >
            <svg className={styles.icon}>
              <use xlinkHref="#vip" />
            </svg>
            <span>{name}</span>
          </ChatTabItem>
        )}
        {teamChats && !isPaid && (
          <ChatTabItem
            onClickTabs={() =>
              browserHistory.push(`${location.pathname}/${type}`)
            }
            tabName={TEAM_CHAT_ID}
            role={role}
            isPaid={isPaid}
            active={this.props.chat}
            chatAvatar={photo}
            lastMessageDate={""}
            lastMessageAuthor={""}
            lastMessage={""}
            unreadMessages={0}
          >
            <svg className={styles.icon}>
              <use xlinkHref="#vip" />
            </svg>
            <span>{name}</span>
          </ChatTabItem>
        )}
      </li>
    );
  };
  publicTab = () => {
    const { role, publicChats } = this.props;
    const {
      photo,
      comments,
      unreadCount,
      id,
      type,
      name,
      isPaid,
    } = publicChats;

    const messageAuthor = comments[0]
      ? `${comments[comments.length - 1].userInfo.firstName} ${
          comments[comments.length - 1].userInfo.lastName
        }`
      : null;

    return (
      <li className={styles.chatTabs}>
        {Boolean(publicChats) && comments && Boolean(comments.length) && (
          <ChatTabItem
            onClickTabs={() =>
              browserHistory.push(`${location.pathname}/${type}`)
            }
            tabName={PUBLIC_CHAT_ID}
            role={role}
            active={this.props.chat}
            chatAvatar={photo}
            lastMessageDate={this.formatDate(
              comments[comments.length - 1].date
            )}
            lastMessageAuthor={messageAuthor}
            lastMessage={comments[comments.length - 1].text}
            unreadMessages={unreadCount}
          >
            {name}
          </ChatTabItem>
        )}
        {publicChats && !isPaid && (
          <ChatTabItem
            onClickTabs={() =>
              browserHistory.push(`${location.pathname}/${type}`)
            }
            tabName={PUBLIC_CHAT_ID}
            role={role}
            isPaid={isPaid}
            active={this.props.chat}
            chatAvatar={photo}
            lastMessageDate={""}
            lastMessageAuthor={""}
            lastMessage={""}
            unreadMessages={0}
          >
            <span>{name}</span>
          </ChatTabItem>
        )}
      </li>
    );
  };

  content = () => {
    const { role } = this.props;

    return (
      <ul className={styles.chatTabs}>
        {
          //role === 2 ? null :
          this.teamTab()
        }
        {
          //role === 2 ? null :
          this.privateTab()
        }
        {this.publicTab()}
        {this.allUsersTab()}
        {this.specializationTab()}
      </ul>
    );
  };

  render() {
    return this.content();
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
    publicChats,
    privateChats,
    teamChats,
    allUsersChats,
    messageChats,
    specializationChats,
    //isFetching,
    isFetchingChat,
    renderPrivateChat,
    renderPublicChat,
    renderTeamChat,
    renderAllUsersChat,
    renderSpecializationChat,
  } = state.chat;
  const { adminChatOpen, groupId, chatTypeId, chatType, typeId } = state.chats;

  const { isFetching, reports } = recivedReports[selectedReports] || {
    isFetching: true,
    reports: [],
  };
  const { taskDay } = recivedTaskDay[selectedTaskDay] || {
    isFetching: true,
    taskDay: {},
  };

  return {
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
    renderSpecializationChat,
    isFetching,
    //chatsTest,
    adminChatOpen,
    groupId,
    typeId,
    chatType,
    chatTypeId,
    userInfo,
    isFetchingChat,
    lang,
  };
};
const mapDispatchToProps = (dispatch) => ({
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
  concatPublicChatAction: bindActionCreators(concatPublicChatAction, dispatch),
  concatTeamChatAction: bindActionCreators(concatTeamChatAction, dispatch),
  concatSpecializationChatAction: bindActionCreators(
    concatSpecializationChatAction,
    dispatch
  ),
  concatAllUsersChatAction: bindActionCreators(
    concatAllUsersChatAction,
    dispatch
  ),
  renderPublicChatAction: bindActionCreators(renderPublicChatAction, dispatch),
  renderPrivateChatAction: bindActionCreators(
    renderPrivateChatAction,
    dispatch
  ),
  renderTeamChatAction: bindActionCreators(renderTeamChatAction, dispatch),
  renderSpecializationChatAction: bindActionCreators(
    renderSpecializationChatAction,
    dispatch
  ),
  renderAllUsersChatAction: bindActionCreators(
    renderAllUsersChatAction,
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

ChatList = connect(mapStateToProps, {
  fetchTaskDayIfNeeded,
  setTypeId,
  clearRenderChat,
  fetchChat,
  setMenuList,
})(ChatList);

export default CSSModules(ChatList, styles);
