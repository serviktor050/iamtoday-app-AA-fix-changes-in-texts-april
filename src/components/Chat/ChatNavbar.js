import { browserHistory } from "react-router";
import React, { Component } from "react";
import styles from "./ChatNavbar.css";
import moment from "moment";
import { dict } from "dict";
import DateRangePicker from "../common/DateRangePicker/DateRangePicker";


const today = moment().local().format("YYYY-MM-DD");
export class ChatNavbar extends Component {
  state = {
    isMenuOpen: false,
    isSearchInputOpen: false,
    isMembersOpen: false,
    isDatePickerOn: false,
    messageFilter: "",
    dateFilter: {
      dateStart: "2020-01-01",
      dateEnd: today
    }
  };

  backToChats() {
    browserHistory.push("/chats");
  }

  openChatMenu = () => {
    const { isMenuOpen } = this.state;
    this.setState({ isMenuOpen: !isMenuOpen });
  };

  openSearchInput = () => {
    this.setState({ isSearchInputOpen: true });
  };

  closeSearchInput = () => {
    const { chatInfo, sendSearchMessageRequest } = this.props;
    //clear filter, hide datePicker, close searchInput
    this.setState({ isSearchInputOpen: false, messageFilter: "", isDatePickerOn: false });
    sendSearchMessageRequest(chatInfo.type, chatInfo.typeId);
  };

  openCalendar = () => {
    const { isDatePickerOn } = this.state;
    this.setState({ isDatePickerOn: !isDatePickerOn })
  };

  handleSearchTextOnChange = (e) => {
    const searchMessage = e.target.value;
    this.setState({
      messageFilter: searchMessage,
    });
  };

  handleSearchTextOnEnter = (e) => {
    if (e && e.key === "Enter") {
      this.handleSearchTextOnChange(e);
    }
  };

  handleDateRangeChanged = (dates) => {
    const newDateStart = dates.start.local().format("YYYY-MM-DD");
    const newDateEnd = dates.end.local().format("YYYY-MM-DD");
    this.setState({
      dateFilter: {
        dateStart: newDateStart,
        dateEnd: newDateEnd,
      },
    });
  };

  handleSearchButton = () => {
    const { messageFilter, dateFilter } = this.state;
    const { chatInfo, sendSearchMessageRequest } = this.props;
    sendSearchMessageRequest(chatInfo.type, chatInfo.typeId, messageFilter, dateFilter.dateStart, dateFilter.dateEnd);
    this.setState({ isDatePickerOn: false })
  };


  render() {
    const { isMenuOpen, isSearchInputOpen } = this.state;
    const { chatInfo, lang } = this.props;
    const i18n = dict[lang];

    return (
      <div style={{ background: "#FFFFFF" }}>
        {isSearchInputOpen && this.renderSearchInput()}

        {!isSearchInputOpen && (
          <div>
            <div className={styles.chatNavbar}>
              <div>
                <button className={styles.backBtn} onClick={this.backToChats}>
                  {i18n["chat.chatNavbar.back"]}
                </button>
                <button className={styles.backBtnMobile} onClick={this.backToChats}>
                </button>
              </div>
              <div className={styles.navTitle}>
                <div>
                  <p className={styles.chatName}>{chatInfo.name}</p>
                  {!chatInfo.isPublic && (
                    <p className={styles.chatMembers}>
                      {chatInfo.userCount} {i18n["chat.chatNavbar.members"]}
                    </p>
                  )}
                </div>
                {chatInfo.isPinned && (
                  <div className={styles.pinnedIcon}>
                    <svg className={styles.icon}>
                      <use xlinkHref="#ico-pin" />
                    </svg>
                  </div>
                )}
              </div>
              <button
                className={styles.menuBtn}
                onClick={this.openChatMenu}
                id={"chatMenu"}
              >
                <svg className={styles.icon}>
                  <use xlinkHref="#ico-list" />
                </svg>
              </button>
            </div>
            <hr />
            {isMenuOpen && this.renderChatMenu()}
          </div>
        )}
      </div>
    );
  }

  renderChatMenu = () => {
    const {
      chatInfo,
      lang,
      pinChat,
      unpinChat,
      leaveChat,
      editChat,
    } = this.props;
    const i18n = dict[lang];
    const menuButtons = [
      {
        icon: "#ico-pin",
        text: i18n["chat.chatNavbar.menu.pin"],
        action: () => pinChat(chatInfo.type, chatInfo.typeId),
        show: !chatInfo.isPinned,
      },
      {
        icon: "#ico-unpin",
        text: i18n["chat.chatNavbar.menu.unpin"],
        action: () => unpinChat(chatInfo.type, chatInfo.typeId),
        show: chatInfo.isPinned,
      },
      {
        icon: "#ico-search",
        text: i18n["chat.chatNavbar.menu.searchMessages"],
        action: this.openSearchInput,
        show: true,
      },
      {
        icon: "#ico-members",
        text: i18n["chat.chatNavbar.menu.members"],
        action: editChat,
        show: !chatInfo.isPublic,
      },
      {
        icon: "#ico-off",
        text: i18n["chat.chatNavbar.menu.leaveChat"],
        action: () => leaveChat(chatInfo.type, chatInfo.typeId),
        show: true,
      },
    ];
    return (
      <ul className={styles.popupMenuList}>
        {menuButtons.map((item, i) => {
          return (
            item.show && (
              <li className={styles.popupMenuItem} key={i}>
                <svg className={styles.popupMenuIcon}>
                  <use xlinkHref={item.icon} />
                </svg>
                <button
                  className={styles.popupMenuButton}
                  onClick={item.action}
                >
                  {item.text}
                </button>
              </li>
            )
          );
        })}
      </ul>
    );
  };

  renderSearchInput() {
    const { lang } = this.props;
    const { messageFilter, dateFilter, isDatePickerOn } = this.state;
    const i18n = dict[lang];

    return (
      <div className={styles.searchBlock}>
        <div className={styles.searchInputBox}>
          <div className={styles.searchIcon}></div>
          <input
            className={styles.searchInput}
            type="text"
            value={messageFilter}
            name="searchText"
            type="text"
            placeholder={i18n["chat.chatNavbar.menu.searchMessagePlaceholder"]}
            onChange={this.handleSearchTextOnChange}
            onKeyPress={this.handleSearchTextOnEnter}
          />
        </div>
        {isDatePickerOn && (
          <DateRangePicker
            start={dateFilter.dateStart}
            end={dateFilter.dateEnd}
            onChange={this.handleDateRangeChanged}
          />)
        }
        {!isDatePickerOn && (
          <div className={styles.calendarIcon} onClick={this.openCalendar} />
        )}
        <button className={styles.approveButton} onClick={this.handleSearchButton} >
          {i18n["chat.chatNavbar.menu.search"]}
        </button>
        <button className={styles.cancelButton} onClick={this.closeSearchInput}>
          {i18n["chat.chatNavbar.menu.cancel"]}
        </button>
      </div>
    );
  }
}
