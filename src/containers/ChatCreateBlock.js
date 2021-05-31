import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import cookie from "react-cookie";
import styles from "./chatCreateBlock.css";
import InputProfile from "components/componentKit/InputProfile";
import { dict } from "dict";
import { addNewChatAction } from "../actions/chats";
import { getChatMembersSuggestions, photoFileUpload } from "../utils/api";
import { api } from "../config";
class ChatCreateBlock extends Component {
  state = {
    chatName: "",
    memberFilter: "",
    memberSuggestions: [],
    memberChosen: [],
    isSuggestionOn: false,
    fileUrl: null,
  };

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

  handleSearchTextOnChange = (e) => {
    const searchName = e.target.value;
    this.setState({
      memberFilter: searchName,
      isSuggestionOn: true,
    });

    getChatMembersSuggestions({
      authToken: cookie.load("token"),
      data: { userFilterText: searchName },
    }).then((res) => this.setState({ memberSuggestions: res.data.data }));
  };

  handleSearchTextOnEnter = (e) => {
    if (e && e.key === "Enter") {
      this.handleSearchTextOnChange(e);
    }
  };

  addMember = (item) => {
    const { memberChosen } = this.state;
    this.setState({
      memberChosen: [
        ...memberChosen,
        {
          id: item.id,
          firstName: item.firstName,
          lastName: item.lastName,
          photo: item.photo,
        },
      ],
      isSuggestionOn: false,
      memberFilter: "",
    });
  };

  deleteMember = (id) => {
    const { memberChosen } = this.state;
    const updatedMembers = memberChosen.filter((item) => item.id != id);
    this.setState({ memberChosen: updatedMembers });
  };

  saveChat = () => {
    const { chatName, memberChosen, fileUrl } = this.state;
    const { closeChat, addNewChatAction } = this.props;
    const membersId = memberChosen.map((item) => {
      return item.id;
    });

    addNewChatAction(fileUrl, chatName, [...membersId]).then(closeChat());
  };

  render() {
    const { lang, closeChat, showChatInfoMode, isAdmin } = this.props;
    const i18n = dict[lang];
    const { isSuggestionOn } = this.state;
    return (
      <div className={styles.createChatBlock}>
        <h1 className={styles.createChatBlock_title}>
          {i18n["chat.createChat.createChat"]}
        </h1>
        <div className={styles.chatName}>
          {this.renderAvatar()}
          {this.renderInput()}
        </div>
        <h1 className={styles.createChatBlock_title}>
          {i18n["chat.createChat.members"]}
        </h1>
        <div className={styles.membersContainer}>
          <div className={styles.searchMember}>{this.renderSearchMember()}</div>
          <div style={{ position: "relative" }}>
            {" "}
            {isSuggestionOn && this.renderSuggestionsList()}
          </div>
          {this.renderChosenMembersList()}
        </div>
        <div className={styles.createChatAction}>
          <button className={styles.approveButton} onClick={this.saveChat}>
            {i18n["chat.createChat.action.save"]}
          </button>
          <button className={styles.cancelButton} onClick={closeChat}>
            {i18n["chat.createChat.action.cancel"]}
          </button>
        </div>
      </div>
    );
  }

  renderAvatar() {
    const { fileUrl } = this.state;
    return (
      <div className={styles.avatarBlock}>
        {!fileUrl && (
          <div className={styles.avatarWrap}>
            <div className={styles.avatarIcon}>
              <label className={styles.avatarUpload} htmlFor="avatar">
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
    const { lang } = this.props;
    const i18n = dict[lang];
    return (
      <div className={styles.inputWrapper}>
        <InputProfile
          meta={{}}
          input={{
            name: "chatName",
            onChange: this.createChatName,
          }}
          val={chatName}
          remote={true}
          placeholder={i18n["chat.createChat.name"]}
          cls={styles.chatName_input}
        />
      </div>
    );
  }

  renderSearchMember() {
    const { memberFilter } = this.state;
    const { lang } = this.props;
    const i18n = dict[lang];
    return (
      <div className={styles.searchInputBox}>
        <div className={styles.searchIcon}></div>
        <input
          className={styles.searchInput}
          type="text"
          value={memberFilter}
          name="searchText"
          type="text"
          placeholder={i18n["chat.createChat.searchMember"]}
          onChange={this.handleSearchTextOnChange}
          onKeyPress={this.handleSearchTextOnEnter}
        />
      </div>
    );
  }

  renderSuggestionsList() {
    const { memberSuggestions, memberChosen } = this.state;
    const { userInfo } = this.props;
    const chosenIds = Boolean(memberChosen.lenght)
      ? memberChosen.map((item) => item.id)
      : "";

    return (
      <ul className={styles.suggestionList}>
        {Boolean(memberSuggestions) &&
          memberSuggestions
            .filter((item) => item.id !== userInfo.data.id)
            .filter(
              (i) => memberChosen.filter((item) => item.id === i.id).length == 0
            )
            .map((item) => {
              return (
                <li
                  className={styles.listItem}
                  key={item.id}
                  onClick={() => this.addMember(item)}
                >
                  <div className={styles.listAvatarWrap}>
                    <img className={styles.listAvatar} src={item.photo} />
                  </div>
                  <p>
                    {" "}
                    {item.lastName} {item.firstName}
                  </p>
                </li>
              );
            })}
      </ul>
    );
  }

  renderChosenMembersList() {
    const { memberChosen } = this.state;
    const { lang, userInfo } = this.props;
    const i18n = dict[lang];
    return (
      <ul className={styles.chosenList}>
        {Boolean(memberChosen) &&
          memberChosen.map((item) => {
            return (
              <li className={styles.listItem} key={item.id}>
                <div className={styles.listAvatarWrap}>
                  <img className={styles.listAvatar} src={item.photo} />
                </div>
                <p>
                  {" "}
                  {item.lastName} {item.firstName}
                </p>
                <div
                  className={styles.deleteAction}
                  onClick={() => this.deleteMember(item.id)}
                >
                  <span className={styles.deleteAction_cross}>X</span>
                  <p className={styles.deleteAction_text}>
                    {i18n["chat.createChat.deleteMember"]}
                  </p>
                </div>
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
  };
};
ChatCreateBlock = connect(mapStateToProps, {
  addNewChatAction,
})(ChatCreateBlock);

export default ChatCreateBlock;
