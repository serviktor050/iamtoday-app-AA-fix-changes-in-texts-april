import React, {Component} from 'react'
import CSSModules from 'react-css-modules'
import styles from './chatWindow.css'

class Chat extends Component {
  render() {
    const {
      // Data
      userId,
      comments = [],
      sendButtonText,
      placeholderText,
      // Flags
      isFetching,
      isForwarding,
      isMessageValid,
      showMessages = true,
      showAdminPanel = true,
      // Callbacks
      onClose,
      onWaiting,
      onForwarding,
      onMessageChanged,
      onMessageSend
    } = this.props

    return (
      <div className={`minion-chat minion-chat_${isFetching ? 'fetching' : (isForwarding ? 'forwarding' : '')}`}>
        <svg
          onClick={() => onClose()}
          className={styles.minionChatCloseIcon}>
          <use xlinkHref="#ico-close"></use>
        </svg>

        <div className={styles.minionChatSpinner}></div>

        {
          showAdminPanel ? (
              <div className={styles.minionChatButtons}>
                <button
                  onClick={() => onWaiting()}
                  className={styles.minionChatButtonWaiting}>
                  Жду ответа
                </button>
                <button
                  onClick={() => onForwarding()}
                  className={styles.minionChatButtonForward}>
                  {isForwarding ? 'Отмена' : 'Переадресовать'}
                </button>
              </div>
            ) : null
        }

        {
          showMessages ? (
              <div className={`minion-chat__messages ${!comments.length ? 'minion-chat__messages_empty' : ''}`}>
                <div className={styles.minionChatMessagesBox}>
                  {
                    comments.length ? comments.map(({text, user}, index) => (
                        <div
                          key={index}
                          className={`minion-chat__message minion-chat__message_${user.id !== userId ? 'left' : 'right'}`}>
                          {text}
                        </div>
                      )) : 'Нет сообщений'
                  }
                </div>
              </div>
            ) : null
        }

        <div className={styles.minionChatAnswerBox}>
          <textarea
            ref="message"
            onChange={(e) => onMessageChanged(e)}
            placeholder={placeholderText}
            className={styles.minionChatAnswerArea}/>

          <button
            disabled={!isMessageValid}
            onClick={() => {
              onMessageSend(this.refs.message.value)

              this.refs.message.value = ''
            }}
            className={`minion-chat__answer-button btn btn--${isMessageValid ? 'primary' : 'disabled'}`}>
            {sendButtonText}
          </button>
        </div>
      </div>
    )
  }
}

export default CSSModules(Chat, styles)
