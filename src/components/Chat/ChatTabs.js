import React, { Component } from "react";
import CSSModules from "react-css-modules";
import styles from "./chatTabs.css";
import ChatTabItem from "./ChatTabItem";
import { PUBLIC_CHAT_ID, PRIVATE_CHAT_ID, TEAM_CHAT_ID } from "../../actions";
import { dict } from "dict";
class ChatTabs extends Component {
  /*conponentDidMount(){
    this.props.changeChat(PRIVATE_CHAT_ID)
  }*/

  onClickTabs(tab) {
    this.props.changeChat(tab);
  }

  content() {
    const { role, workTeam, isPaid, lang } = this.props;

    const privateTab = () => {
      return (
        <ChatTabItem
          onClickTabs={this.onClickTabs.bind(this)}
          tabName={PRIVATE_CHAT_ID}
          role={role}
          active={this.props.chat}
        >
          {dict[lang]["support"]}
        </ChatTabItem>
      );
    };
    const teamTab = () => {
      return (
        <ChatTabItem
          onClickTabs={this.onClickTabs.bind(this)}
          tabName={TEAM_CHAT_ID}
          role={role}
          isPaid={isPaid}
          active={this.props.chat}
        >
          <svg className={styles.icon}>
            <use xlinkHref="#vip" />
          </svg>
          <span>{dict[lang]["vipChat"]}</span>
        </ChatTabItem>
      );
    };
    return (
      <ul className={styles.chatTabs}>
        <ChatTabItem
          onClickTabs={this.onClickTabs.bind(this)}
          tabName={PUBLIC_CHAT_ID}
          role={role}
          active={this.props.chat}
        >
          {dict[lang]["commonChat"]}
        </ChatTabItem>

        {role === 2 ? null : teamTab()}

        {role === 2 ? null : privateTab()}
      </ul>
    );
  }

  render() {
    return this.content();
  }
}

export default CSSModules(ChatTabs, styles);
