import React, {Component} from 'react'
import CSSModules from 'react-css-modules'
import styles from './miniChatTabs.css'
import ChatTabItem from './ChatTabItem'
import { PUBLIC_CHAT_ID, PRIVATE_CHAT_ID, TEAM_CHAT_ID } from '../../actions'
import classnames from 'classnames'
class MiniChatTabs extends Component {

   onClickTabs(tab) {
     const {changeChat, miniChatOpen, toggleMiniChat, selectChat, isFetchingChat, changeActiveTab} = this.props
     if(isFetchingChat !== 0){
       return;
     }
     if(selectChat === tab){
       toggleMiniChat(!miniChatOpen)
     } else {
         toggleMiniChat(true)
     }
     changeActiveTab(tab)
     changeChat(tab)
  }

  content() {
    const { unReadPublicChat,  unReadPrivateChat, unReadTeamChat,  selectChat, workTeam} = this.props
    return (
      <div className={styles.miniChatMenu}>
        <div
          data-drag="drag"
          className={styles.miniChatDrag}
        >
          <div data-drag="drag" className={styles.miniChatDragBlock}>
            <div data-drag="drag" className={styles.miniChatDragLine}>
              <div data-drag="drag" className={styles.miniChatDragItem}></div>
              <div data-drag="drag" className={styles.miniChatDragItem}></div>
              <div data-drag="drag" className={styles.miniChatDragItem}></div>
            </div>
            <div data-drag="drag" className={styles.miniChatDragLine}>
              <div data-drag="drag" className={styles.miniChatDragItem}></div>
              <div data-drag="drag" className={styles.miniChatDragItem}></div>
              <div data-drag="drag" className={styles.miniChatDragItem}></div>
            </div>
          </div>
        </div>

        <div
          className={classnames(styles.miniChatMenuItem, {
            [styles.select]: selectChat === PUBLIC_CHAT_ID}
            )}
          onClick={this.onClickTabs.bind(this, PUBLIC_CHAT_ID)}
        >
          <svg className={styles.svgIconMenuCommon}>
            <use xlinkHref="#message"></use>
          </svg>
          {unReadPublicChat && selectChat !== PUBLIC_CHAT_ID ? <div className={styles.miniChatMenuUnRead}>{unReadPublicChat}</div> : null}
        </div>
          <div className={classnames(styles.miniChatMenuItem, { [styles.select]: selectChat === TEAM_CHAT_ID})}
               onClick={this.onClickTabs.bind(this, TEAM_CHAT_ID)}>
              <svg className={styles.svgIconMenu}>
                  <use xlinkHref="#vip"></use>
              </svg>
              {unReadTeamChat && selectChat !== TEAM_CHAT_ID ? <div className={styles.miniChatMenuUnRead}>{unReadTeamChat}</div> : null}
          </div>
          <div className={classnames(styles.miniChatMenuItem, { [styles.select]: selectChat === PRIVATE_CHAT_ID})}
               onClick={this.onClickTabs.bind(this, PRIVATE_CHAT_ID)}>
              <svg className={styles.svgIconMenu}>
                  <use xlinkHref="#support"></use>
              </svg>
              {unReadPrivateChat && selectChat !== PRIVATE_CHAT_ID ? <div className={styles.miniChatMenuUnRead}>{unReadPrivateChat}</div> : null}
          </div>
      </div>
    )
  }

  render() {
    return (this.content())
  }
}

export default CSSModules(MiniChatTabs, styles)
