import PropTypes from 'prop-types';
import React, { Component } from "react";
import { connect } from "react-redux";
import { browserHistory } from "react-router";
import moment from "moment";
import classNames from "classnames/bind";
import Layout from "../components/componentKit2/Layout";
import ChatTabItem from "../components/Chat/ChatTabItem";
import ChatCreateBlock from "./ChatCreateBlock";
import { fetchChatList, setMenuList } from "../actions";
import CSSModules from "react-css-modules";
import styles from "./chatPage.css";
import Loader from "../components/componentKit/Loader";
import { Breadcrumb } from "../components/common/Breadcrumb";
import { dict } from "../dict";

/**
 *  Контейнер ChatPage.
 *  Используется для отображения страницы список чатов (/chats)
 *
 */
const cx = classNames.bind(styles);

class ChatPage extends Component {
  /**
   * @memberof ChatPage
   * @prop {object} propTypes - the props that are passed to this component
   * @prop {func} propTypes.clearRenderChat Очистка чата
   * @prop {func} propTypes.setMenuList установка выбранной старницы в меню
   * @prop {func} propTypes.fetchTaskDayIfNeeded Получение данных для страницы дня
   * @prop {object} propTypes.userInfo Данные пользователя
   *
   * */

  state = {
    userSearchText: "",
    isCreateChat: false,
  };
  componentDidMount() {
    const { setMenuList, fetchChatList } = this.props;
    setMenuList("chats");
    //fetchChatList();
  }

  /*componentDidUpdate(prevProps) {
    const { allChats, fetchChatList } = this.props;

    if (allChats !== prevProps.allChats) {
      fetchChatList();
    }
  }*/

  formatDate = (date) => moment(date).format("DD.MM.YYYY");

  openCreateChat = () => this.setState({ isCreateChat: true });

  closeCreateChat = () => this.setState({ isCreateChat: false });

  handleSearchTextOnChange = (event) => {
    this.setState({ userSearchText: event.target.value })
    this.props.fetchChatList(event.target.value);
  };

  handleSearchTextOnEnter = (event) => {
    if (event && event.key === "Enter") {
      this.handleSearchTextOnChange(event);
    }
  };

  renderSearchInputBox = (props) => (
    <div className={styles.searchInputBox}>
      <svg className={styles.svgIconFile}>
        <use xlinkHref="#ico-input-search" />
      </svg>
      <input type="text" {...props} />
    </div>
  );

  renderHeader() {
    const { userSearchText, isCreateChat } = this.state;
    const i18n = dict[this.props.lang];
    const items = [i18n["breadcrumb.main"], i18n["breadcrumb.chat"]];
    const links = ["/", "/chats"];

    return (
      <div className={styles.chatBreadcrumb}>
        <div>
          <h2 className={cx(styles.title)}>{i18n["chat.title"]}</h2>
          <Breadcrumb items={items} links={links} />
        </div>
        {!isCreateChat && (
          <div className={styles.breadcrumb__action}>
            <button
              className={styles.breadcrumb__actionButton}
              onClick={this.openCreateChat}
            >
              {i18n["chat.addChat"]}
            </button>
            {this.renderSearchInputBox({
              value: userSearchText,
              name: "searchText",
              type: "text",
              placeholder: i18n["chat.searchText"],
              onChange: this.handleSearchTextOnChange,
              onKeyPress: this.handleSearchTextOnEnter,
            })}
          </div>
        )}
      </div>
    );
  }
  render() {
    const { userInfo, location, allChats } = this.props;
    const { isCreateChat } = this.state;

    return (
      <Layout
        location={location}
        page={"chats"}
        prevSeasons={userInfo.data.prevSeasons}
      >
        <div className={styles.chatComponent}>
          {this.renderHeader()}
          <hr />
          {Boolean(allChats.length) ? (
            !isCreateChat && this.renderChatList()
          ) : (
              <Loader />
            )}
          {isCreateChat && this.renderCreateChat()}
        </div>
      </Layout>
    );
  }
  renderChatList() {
    const { allChats } = this.props;

    return (
      <div>
        {allChats &&
          Boolean(allChats.length) &&
          allChats
            .sort((x, y) => y.isPinned - x.isPinned)
            .map((item) => {
              const hasComments = Boolean(item.comments.length);
              const lastMessage = hasComments && item.comments[0];
              const lastMessageAuthor = hasComments
                ? `${lastMessage.userInfo.firstName} ${lastMessage.userInfo.lastName}`
                : "";
              return item.type === 11 && !hasComments ? null : (
                <ChatTabItem
                  key={item.id}
                  onClickTabs={() =>
                    browserHistory.push({
                      pathname: `${location.pathname}/${item.id}`,
                      state: { type: item.type, typeId: item.typeId },
                    })
                  }
                  tabName={item.name}
                  isPaid={item.isPaid}
                  isPinned={item.isPinned}
                  //active={this.props.chat}
                  chatAvatar={item.photo}
                  lastMessageDate={
                    hasComments && this.formatDate(lastMessage.date)
                  }
                  lastMessageAuthor={lastMessageAuthor}
                  lastMessage={lastMessage.text}
                  unreadMessages={item.unreadCount}
                >
                  {item.name}
                </ChatTabItem>
              );
            })}
        <button
          className={styles.actionButton_mobile}
          onClick={this.openCreateChat}
        >
          +
        </button>
      </div>
    );
  }

  renderCreateChat() {
    return <ChatCreateBlock closeChat={this.closeCreateChat} />;
  }
}

const mapStateToProps = (state) => {
  const { chats, userInfo, lang } = state;
  const { allChats } = state.chat;

  return {
    allChats,
    userInfo,
    chats,
    lang,
  };
};

ChatPage = connect(mapStateToProps, {
  fetchChatList,
  setMenuList,
})(ChatPage);

export default CSSModules(ChatPage, styles);
