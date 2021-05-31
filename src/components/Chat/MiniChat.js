import React, {Component} from 'react'
import CSSModules from 'react-css-modules'
import styles from './miniChat.css'
import Chat from '../../containers/Chat'
import {PRIVATE_CHAT_ID } from '../../actions'
import Draggable from 'react-draggable';

class MiniChat extends Component {


  onStart(e) {
    if(!e.target.getAttribute('data-drag') && e.target.getAttribute('data-drag') !== 'drag'){
      return false;
    }
  }

  render() {
    const { taskDay, params } = this.props
    return (
      <div className={styles.miniChat}>
        <div className={styles.miniChatWindow}>
          <Draggable
            onStart={(e) => this.onStart(e)}
          >
            <div className={styles.miniChatDragable}>
              <Chat
                userId={taskDay.user.id}
                user={taskDay.user}
                type={PRIVATE_CHAT_ID}
                isWindow={false}
                showAdminPanel={false}
                role={taskDay.user.role}
             /*   kindChat={1}*/
                miniChat={true}
                params={params}
              /*  taskDay={taskDay}*/
                admin={false}
              />
            </div>

          </Draggable>
        </div>
      </div>

    )
  }
}

export default CSSModules(MiniChat, styles)
