import React from 'react'
import {dateFormat} from '../../utils/helpers'
import CSSModules from 'react-css-modules'
import styles from './chatList.css'

export default CSSModules(({list = [], onChatSelect, chatType, selectedChat}) => {
  const spectator = (chat) => {
    if (chat.userStarter.firstName) {
      if (!chat.userStarter.isSpectator) {
        return <div className={styles.chatsListSpectator}>
                  <svg className={styles.svgIco}>
                      <use xlinkHref="#ico-done"></use>
                  </svg>
              </div>

      }
    } else {
      return null
    }
  }

  const line = list
    .map((chat, index) => {
      return (
        <div
          key={index}
          className={selectedChat === chat.id ? styles.chatsListItemSelected : styles.chatsListItem}
          onClick={() => {
            onChatSelect(chat.type, chat.typeId, chat.id)
          }}>
          <div className={styles.chatsListItemName}>
            {chat.title || '-'}
            {chatType === 2 ? spectator(chat) : null}
          </div>

          { chatType === 2 ? <div>
                <span className={styles.chatsListItemTimestamp}>
                  {chat.hasMessages ? (chat.isAnswered || chat.status === 2 || chat.comments[0].userInfo.role === 2? 'Отвечено ' : `Ожидает ответа: ${chat.timePassed}`) : 'Пустой'}
                </span>
                <span>
                {dateFormat(chat.comments[0].date, true)}
                </span>

            </div>

            : null}

        </div>
      )
    })
  return (
    <div className={styles.chatsList}>
      {line}
    </div>
  )
}, styles)
