import React from 'react'
import CSSModules from 'react-css-modules'
import styles from './chatGroup.css'

import ChatList from './ChatList'

export default CSSModules(({title, unread, list, onChatSelect, chatType, selectedChat}) => {
  return (
  <div className={styles.chatGroup}>

    <div
      className={styles.chatGroupHeader}>
      <div className={styles.chatGroupName}>
        {title}
      </div>
        {chatType === 2 ? <div className={styles.chatGroupUnread}>

        Непрочитанных

        <div className={styles.chatGroupCounter}>
          {unread}
        </div>
      </div> : null }
    </div>

    <div className={styles.chatGroupBody}>
      <ChatList
        list={list}
        chatType={chatType}
        selectedChat={selectedChat}
        onChatSelect={onChatSelect}/>
    </div>
  </div>
)}, styles)
