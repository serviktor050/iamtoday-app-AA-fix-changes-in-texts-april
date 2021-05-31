import React, { Component } from "react";
import { connect } from "react-redux";
import cookie from "react-cookie";
import { browserHistory } from "react-router";
import styles from "./chatEditBlock.css";
import InputProfile from "components/componentKit/InputProfile";
import { dict } from "dict";
import { getChatMembersSuggestions, photoFileUpload } from "../utils/api";
import { api } from "../config";
import {
  fetchChatInfo,
  addUserAction,
  deleteUserAction,
  updateChatAction,
} from "../actions/chats";

class ChatEditBlock extends Component {
  state = {
    chatName: "",
    memberFilter: "",
    memberSuggestionFilter: "",
    memberChosen: [],
    filteredMembers: [],
    memberSuggestions: [],
    isSuggestionOn: false,
    fileUrl: null,
  };
  backToChats() {
    browserHistory.push("/chats");
  }
  loadPhoto = (input) => {
    const { target } = input;

    if (target.files && target.files[0]) {
      const reader = new FileReader();
      const name = target.files[0].name

      reader.onload = (e) => {
        const content = reader.result.replace(/data:image\/\w+;base64,/, '');
        photoFileUpload({content, name})
        .then(result=> this.setState({
          fileId: result.data.uid,
          fileUrl: `${api}/files/${result.data.uid}.${result.data.extension}`.replace(/api\//, ''),
          fileName: result.data.name
       })) 
      };

      reader.readAsDataURL(target.files[0]);
    }
  };

  createChatName = (e) => {
    this.setState({ chatName: e });
  };

  filterMembers = (searchName) => {
    const { chatInfo } = this.props;
    const filteredMembers = chatInfo.users.filter((item) => {
      return (
        item.firstName.toLowerCase().search(searchName.toLowerCase()) > -1 ||
        item.lastName.toLowerCase().search(searchName.toLowerCase()) > -1
      );
    });
    this.setState({ filteredMembers: filteredMembers });
  };

  handleSearchMemberOnChange = (e) => {
    const searchName = e.target.value;
    this.setState({
      memberFilter: searchName,
    });
    this.filterMembers(searchName);
  };

  handleSearchMemberOnEnter = (e) => {
    if (e && e.key === "Enter") {
      this.handleSearchMemberOnChange(e);
    }
  };

  handleSearchSuggestionOnChange = (e) => {
    const searchName = e.target.value;
    this.setState({
      memberSuggestionFilter: searchName,
    });

    getChatMembersSuggestions({
      authToken: cookie.load("token"),
      data: { userFilterText: searchName },
    }).then((res) => this.setState({ memberSuggestions: res.data.data }));
  };

  handleSearchSuggestionOnEnter = (e) => {
    if (e && e.key === "Enter") {
      this.handleSearchSuggestionOnChange(e);
    }
  };
  
  setSuggestionOn = () => {
    this.setState({ isSuggestionOn: true });

  };

  addMember = (id) => {
    const { chatInfo, addUserAction } = this.props;

    addUserAction(chatInfo.type, chatInfo.typeId, id).then(
      this.setState({
        isSuggestionOn: false,
        memberFilter: "",
      })
    );
  };

  deleteMember = (id) => {
    const { chatInfo, deleteUserAction } = this.props;
    deleteUserAction(chatInfo.type, chatInfo.typeId, id);
  };

  saveEditedChat = () => {
    const { chatName, fileUrl } = this.state;
    const { chatInfo, updateChatAction } = this.props;
    //when name is not changed send previous chat name
    const updatedName = chatName ? chatName : chatInfo.name;

    updateChatAction(
      chatInfo.type,
      chatInfo.typeId,
      updatedName,
      fileUrl
    ).then(this.backToChats());
  };

  render() {
    const { lang, closeChat, userInfo, chatInfo } = this.props;
    const isAdmin = userInfo.data.id === chatInfo.userStarter.id;
    const i18n = dict[lang];
    const { isSuggestionOn } = this.state;
    return (
      <div className={styles.createChatBlock}>
        <div>
          <button className={styles.backBtn} onClick={this.backToChats}>
            {i18n["chat.chatNavbar.back"]}
          </button>
        </div>
        <div className={styles.chatName}>
          {!isAdmin && this.renderUserStarter()}
          {isAdmin && this.renderAvatar()}
          {isAdmin && this.renderInput()}
        </div>
        <h1 className={styles.editChatBlock_title}>
          {i18n["chat.createChat.members"]}{" "}
          <span className={styles.editChatBlock_number}>
            {chatInfo.userCount}
          </span>
        </h1>
        <div className={styles.membersContainer}>
          <div className={styles.searchMember}>{this.renderSearchMember()}</div>
          <div style={{ position: "relative" }}>
            {" "}
            {isSuggestionOn && this.renderSuggestionsList()}
          </div>
          {this.renderMembersList(isAdmin)}
        </div>
        {isAdmin && (
          <div className={styles.createChatAction}>
            <button
              className={styles.approveButton}
              onClick={this.saveEditedChat}
            >
              {i18n["chat.createChat.action.save"]}
            </button>
            <button className={styles.cancelButton} onClick={closeChat}>
              {i18n["chat.createChat.action.cancel"]}
            </button>
          </div>
        )}
      </div>
    );
  }
  renderUserStarter() {
    const { chatInfo, lang } = this.props;
    const i18n = dict[lang];
    return (
      <div className={styles.userStarterBlock}>
        <div className={styles.avatarBlock}>
          <img
            className={styles.avatarImg}
            ref="avatar"
            src={chatInfo.userStarter.photo}
            alt="avatar"
          />
        </div>
        <div className={styles.userStarter}>
          <p>
            {chatInfo.userStarter.firstName} {chatInfo.userStarter.lastName}
          </p>
          <p className={styles.userStarter_role}>
            {i18n["chat.editChat.userStarter"]}
          </p>
        </div>
      </div>
    );
  }
  renderAvatar() {
    const { fileUrl } = this.state;
    const { chatInfo } = this.props;
    return (
      <div className={styles.avatarBlock}>
        {!fileUrl && (
          <div className={styles.avatarWrap}>
            <div
              className={styles.avatarBackground}
              style={{
                background: `url(${chatInfo.photo}) center/cover no-repeat`,
                filter: "brightness(0.5)",
              }}
            >
              {" "}
            </div>
            <div className={styles.avatarIcon}>
              <label className={styles.avatarUpload} htmlFor="avatar">
                <svg className={styles.icon}>
                  <use xlinkHref="#ico-plus" />
                </svg>
                Изменить фото
                <input
                  id="avatar"
                  type="file"
                  ref="avaInput"
                  accept="image/*"
                  onChange={(input) => this.loadPhoto(input)}
                  className={styles.uploadFileInput}
                />
              </label>
            </div>
          </div>
        )}
        {fileUrl && (
          <img
            className={styles.avatarImg}
            ref="avatar"
            src={fileUrl}
            alt="avatar"
          />
        )}
      </div>
    );
  }

  renderInput() {
    const { chatName } = this.state;
    const { lang, chatInfo } = this.props;
    const i18n = dict[lang];
    return (
      <div className={styles.inputWrapper}>
        <InputProfile
          meta={{}}
          input={{
            name: "chatName",
            onChange: this.createChatName,
          }}
          val={chatName ? chatName : chatInfo.name}
          remote={true}
          placeholder={i18n["chat.createChat.name"]}
          cls={styles.chatName_input}
        />
      </div>
    );
  }

  renderSearchMember() {
    const { memberFilter, memberSuggestionFilter, isSuggestionOn } = this.state;
    const { lang } = this.props;
    const i18n = dict[lang];
    return (
      <div className={styles.searchInputBox}>
        <div className={styles.searchIcon}></div>
        {!isSuggestionOn && (
          <input
            className={styles.searchInput}
            type="text"
            value={memberFilter}
            name="searchText"
            type="text"
            placeholder={i18n["chat.createChat.searchMember"]}
            onChange={this.handleSearchMemberOnChange}
            onKeyPress={this.handleSearchMemberOnEnter}
          />
        )}
        {isSuggestionOn && (
          <input
            autoFocus
            className={styles.searchInput}
            type="text"
            value={memberSuggestionFilter}
            name="searchText"
            type="text"
            placeholder={i18n["chat.createChat.searchMember"]}
            onChange={this.handleSearchSuggestionOnChange}
            onKeyPress={this.handleSearchSuggestionOnEnter}
          />
        )}
      </div>
    );
  }

  renderSuggestionsList() {
    const { memberSuggestions, memberChosen } = this.state;
    const { userInfo } = this.props;

    return (
      Boolean(memberSuggestions.length) && (
        <ul className={styles.suggestionList}>
          {memberSuggestions
            .filter((item) => item.id !== userInfo.data.id)
            .filter((i) => memberChosen.filter((item) => item.id === i.id).length == 0)
            .map((item) => {
              return (
                <li className={styles.listItem} key={item.id} onClick={() => this.addMember(item.id)}>
                  <div className={styles.listAvatarWrap}>
                    <img className={styles.listAvatar} src={item.photo} />
                  </div>
                  <p>
                    {item.lastName} {item.firstName}
                  </p>
                </li>
              )
            })
          }
        </ul>))
  }

  renderMembersList(isAdmin) {
    const { filteredMembers } = this.state;
    const { lang, chatInfo, userInfo } = this.props;
    const { users } = chatInfo;
    const i18n = dict[lang];
    const list = filteredMembers.length ? filteredMembers : users;
    return (
      <ul className={styles.chosenList}>
        {isAdmin && (
          <li className={styles.listItem} onClick={this.setSuggestionOn}>
            <div className={styles.listAvatarWrap}>
              <div className={styles.addToListAvatar}>
                <svg className={styles.icon}>
                  <use xlinkHref="#ico-user-plus" />
                </svg>
              </div>
            </div>
            <p className={styles.addToListText}>
              {i18n["chat.createChat.addNew"]}
            </p>
          </li>
        )}
        {Boolean(chatInfo) &&
          list
            //.filter((item) => item.id !== userInfo.data.id)
            .map((item) => {
              const isMe = item.id === userInfo.data.id;
              const isChatAdmin = item.id === chatInfo.userStarter.id;
              return (
                <li className={styles.listItem} key={item.id}>
                  <div className={styles.listAvatarWrap}>
                    <img className={styles.listAvatar} src={item.photo} />
                  </div>
                  <p>
                    {item.lastName} {item.firstName} {isMe && ('(я)')} {isChatAdmin && '⭐'}
                  </p>
                  {isAdmin && !isMe && (
                    <div
                      className={styles.deleteAction}
                      onClick={() => this.deleteMember(item.id)}
                    >
                      <span className={styles.deleteAction_cross}>X</span>
                      <p className={styles.deleteAction_text}>
                        {i18n["chat.createChat.deleteMember"]}
                      </p>
                    </div>
                  )}
                </li>
              );
            })}
      </ul>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    lang: state.lang,
    userInfo: state.userInfo,
    chatInfo: state.chat.chatInfo,
  };
};

ChatEditBlock = connect(mapStateToProps, {
  fetchChatInfo,
  addUserAction,
  deleteUserAction,
  updateChatAction,
})(ChatEditBlock);

export default ChatEditBlock;
