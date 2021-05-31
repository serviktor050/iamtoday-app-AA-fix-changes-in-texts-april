import PropTypes from 'prop-types';
import React, { Component } from 'react';
import cookie from 'react-cookie'
import { Field, reduxForm } from 'redux-form'
import {connect} from 'react-redux'
import { api } from '../config.js'
import Modal from 'boron-react-modal/FadeModal'
import EmojiPicker from 'emojione-picker'
import Textarea from 'react-textarea-autosize'
import {
  fetchChat,
  fetchChats,
  changeChatType,
  fetchTaskDayIfNeeded,
  adminChatCloseAction,
  setChatTypeId, setGroupId,
  adminChatOpenAction,
  clearRenderChat,
  answerToChat
} from '../actions'
import CSSModules from 'react-css-modules'
import styles from './pendingMinionChats.css'

import ReactPaginate from 'react-paginate'
import Chat from '../containers/Chat'

import ChatGroup from '../components/userReports/ChatGroup'
import UserReportsMenu from '../components/userReports/UserReportsMenu'

const DEFAULT_PAGE = 1
const DEFAULT_PAGE_COUNT = 10
let currentChatType = 2

let contentStyle = {
  borderRadius: '18px',
  padding: '30px'
}

/**
 *  Контейнер PendingMinionChats.
 *  Используется для отображения страницы экзаменов в админке (/userReports/chats)
 *
 */
class PendingMinionChats extends Component {
  /**
   * @memberof PendingMinionChats
   * @prop {object} propTypes - the props that are passed to this component
   * @prop {func} propTypes.fetchChats Функция получения массива чатов
   * @prop {func} propTypes.adminChatOpenAction Функция открытия чата для админа
   * @prop {func} propTypes.setGroupId Функция  - установка номера группы для чата
   * @prop {func} propTypes.setChatTypeId Функция  - установка типа чата
   * @prop {boolean} propTypes.isChatsFetching Данные пользователя
   *
   * */
  static propTypes = {
    fetchChats: PropTypes.func.isRequired,
    adminChatOpenAction: PropTypes.func.isRequired,
    setGroupId: PropTypes.func.isRequired,
    setChatTypeId: PropTypes.func.isRequired,
    isChatsFetching: PropTypes.bool.isRequired
  }
  constructor(props) {
    super(props)

    this.state = {
      selectedChat: false,
      showEmojiPopup: false
    }
  }

  toggleEmojiPopup() {
    this.setState({showEmojiPopup: !this.state.showEmojiPopup})
  }

  appendEmoji(unicode) {
    this.refs.message.value += this.getEmoji(unicode)
  }

  getEmoji(unicode) {
    const point = Number('0x' + unicode)
    const offset = point - 0x10000
    const lead = 0xd800 + (offset >> 10)
    const trail = 0xdc00 + (offset & 0x3ff)
    const arr = [lead.toString(16), trail.toString(16)]

    return arr
      .map((el) => parseInt(el, 16))
      .map((el) => String.fromCharCode(el))
      .join('')
  }

  componentWillMount() {
    const {fetchChats} = this.props

    this.state = {
      list: [],
      page: DEFAULT_PAGE,
      pageCount: DEFAULT_PAGE_COUNT
    }

    fetchChats(currentChatType, DEFAULT_PAGE)
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.isChatsFetching && this.props.isChatsFetching) {
      this.setState({
        list: [...nextProps.list],
        pageCount: nextProps.pageCount
      })
    }
  }
  componentDidMount() {
    const { fetchTaskDayIfNeeded, selectedTaskDay } = this.props
    fetchTaskDayIfNeeded(selectedTaskDay)
  }

  componentDidUpdate() {
    const { fetchChats, dispatch } = this.props

    if (this.props.updateChats) {
      this.setState({
        list: []
      })
      dispatch({type: 'UPDATE_CHATS', updateChats: false})

      fetchChats(currentChatType, this.state.page)
    }
  }

  selectChat(type, typeId, groupId) {
    const {fetchChat ,setChatTypeId, setGroupId, adminChatOpenAction} = this.props

    setGroupId(groupId)
    setChatTypeId(typeId)
    adminChatOpenAction()
    fetchChat(type, typeId)
  }

  closeAdminChat() {
    this.props.adminChatCloseAction()
    this.props.clearRenderChat()
  }

  render() {
    const { taskDay } = this.props

    let user
    if (taskDay.taskDay && taskDay.taskDay.data) {
      user = taskDay.taskDay.data[0].user
    }
    const {
      list = true,
      showEmojiPopup,
      pageCount,
      page
      } = this.state

    const {
      chat,
      userId,
      isChatsFetching = true,
      fetchChats,
      showGlobalMessage,
      dispatch
      } = this.props

    const handlePageClick = data => {
      const nextPage = data.selected + 1

      this.setState({page: nextPage, list: []})
      fetchChats(currentChatType, nextPage)
    }

    const chatTypes = [
      {text: 'Публичные', val: 1},
      {text: 'Приватные', val: 2}
    ]

    const sendMessage = () => {
      this.refs.loadingModal.show()
      return fetch(`${api}/user/chatmessage-privateSendToEveryone`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
          data: {text: this.refs.message.value},
          authToken: cookie.load('token')
        })
      })
        .then(response => response.json())
        .then(json => {
          this.refs.loadingModal.hide()
          if (json && json.errorCode === 1) {
            this.refs.successModal.show()
          } else {
            this.refs.errorModal.show()
          }
        })
    }

    const filterText = userFilterText => {
      this.state = {
        list: [],
        page: DEFAULT_PAGE
      }

      fetchChats(currentChatType, DEFAULT_PAGE, undefined, this.refs.filterText.value)
    }


    const filterId = user => {
      this.state = {
        list: [],
        page: DEFAULT_PAGE
      }

      fetchChats(currentChatType, DEFAULT_PAGE, this.refs.filterId.value, undefined)
    }

    return (
      <div className={styles.layout}>

        <div className={styles.header}>
          <div className={styles.gridHeaderInner}>
            <h1 className={styles.gridCellHeaderLogo}>
              Ясегодня
              <img src="/assets/img/ys_logo.svg" alt="Ясегодня"/>
            </h1>
          </div>
        </div>

        <div className={styles.layoutInner}>
          <div className={styles.grid}>

          <div className={styles.gridCellLayoutMenu14}>
            <div className={styles.gridLayoutMenuInner}>
              <div className={styles.gridCellLayout66}>
                <UserReportsMenu/>
              </div>
            </div>
          </div>
          <div className={styles.gridCellLayoutContentPocket34}>
            <div className={styles.stageBoxSmallPadding}>
              {
                !isChatsFetching || list.length ? (
                  <div className={styles.chatsGroups}>
                    <ul className={styles.optionsWhiteMtd30} style={{ display: 'inline-block' }}>
                      {chatTypes.map((val, index) => (
                        <label key={index} style={{ display: 'inline-block' }}>
                          <li name="chatTypes"
                              className={ currentChatType === val.val ? styles.optionsItemIsActive : styles.optionsItem}
                              id={`chatTypes[${index}]`} onClick={e => {
                                document.getElementById(`chatTypes[${index}]`).className += ' is-active'
                                chatTypes.forEach((v, i) => {
                                  if (index !== i) {
                                    document.getElementById(`chatTypes[${i}]`).className = styles.optionsItem
                                  }
                                })
                              }}>
                            <Field
                              component='input'
                              type='radio'
                              name='chatTypes'
                              style={{visibility: 'hidden', margin: -5}}
                              value={val.val}
                              onClick={() => {
                                    currentChatType = val.val
                                    this.props.changeChatType(val.val)

                                    this.state = {
                                      list: [],
                                      page: DEFAULT_PAGE
                                    }

                                    fetchChats(currentChatType, DEFAULT_PAGE)
                                  }}/>
                            {val.text}
                          </li>
                          <span/>
                        </label>
                      ))}
                    </ul>

                    <div className={styles.btnAction} onClick={() => {
                          dispatch({ type: 'SHOW_GLOBAL_MESSAGE', showGlobalMessage: !showGlobalMessage })
                        }}>
                      Отправить сообщение всем пользователям
                    </div>

                    {showGlobalMessage &&
                    <div className={styles.chatForm}>
                      <div className={styles.chatFormInner}>
                        {
                          showEmojiPopup ? (
                            <div className={styles.chatEmoji}>
                              <EmojiPicker onChange={({unicode}) => this.appendEmoji(unicode)}/>
                            </div>
                          ) : null
                        }

                        <button
                          onClick={() => this.toggleEmojiPopup()}
                          className={styles.chatEmojiButton}>
                          😀
                        </button>


                              <Textarea
                                ref="message"
                                onKeyDown={e => {
                                  if (e.keyCode === 13 && !e.shiftKey) {
                                    this.refs.message.value = ''
                                    sendMessage()
                                  }
                                }}
                                placeholder="Сообщение всем пользователям"
                                className={styles.chatFormInnerTextarea}
                              />

                        <div className={styles.btnChat}
                             onClick={filterText}>
                          <div className={styles.btnChatTitle}>Отправить</div>
                          <div className={styles.btnChatIco}>
                            <svg className={styles.svgIcoArrowUp}>
                              <use xlinkHref="#ico-arrow-up"/>
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                    }


                    <div className={styles.chatForm}>
                      <div className={styles.chatFormInner}>

                            <Textarea
                              ref="filterId"
                              onKeyDown={e => {
                                if (e.keyCode === 13 && !e.shiftKey) {
                                  this.refs.confirmMessage.value = ''
                                  this.confirmChoice()
                                }
                              }}
                              placeholder="Поиск..."
                              className={styles.chatFormInnerTextarea}
                            />

                        <div className={styles.btnChat}
                             onClick={filterId}>
                          <div className={styles.btnChatTitle}>Поиск ID</div>
                          <div className={styles.btnChatIco}>
                            <svg className={styles.svgIcoArrowUp}>
                              <use xlinkHref="#ico-arrow-up"/>
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className={styles.chatForm}>
                      <div className={styles.chatFormInner}>


                            <Textarea
                              ref="filterText"
                              onKeyDown={e => {
                                if (e.keyCode === 13 && !e.shiftKey) {
                                  this.refs.confirmMessage.value = ''
                                  this.confirmChoice()
                                }
                              }}
                              placeholder="Поиск..."
                              className={styles.chatFormInnerTextarea}
                            />

                        <div className={styles.btnChat}
                             onClick={filterText}>
                          <div className={styles.btnChatTitle}>Поиск</div>
                          <div className={styles.btnChatIco}>
                            <svg className={styles.svgIcoArrowUp}>
                              <use xlinkHref="#ico-arrow-up"/>
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>

                    <ChatGroup
                      title={`${chatTypes[currentChatType - 1].text} чаты`}
                      list={list}
                      chatType={currentChatType}
                      unread={list.reduce((sum, {isAnswered, comments, hasMessages, status}) => {

                          if (currentChatType === 1) {
                            return (hasMessages && isAnswered) ? sum : sum + 1
                          } else {
                            return (hasMessages && isAnswered) || status === 2 || comments[0].userInfo.role === 2 ? sum : sum + 1
                          }
                        }, 0)}
                      selectedChat={chat.id}
                      onChatSelect={(type, typeId, groupId) => this.selectChat(type, typeId, groupId)}
                    />

                    <ReactPaginate previousLabel={'<'}
                                   nextLabel={'>'}
                                   forcePage={page - 1}
                                   breakLabel={<a href=''>...</a>}
                                   breakClassName={'break-me'}
                                   pageCount={pageCount}
                                   marginPagesDisplayed={2}
                                   pageRangeDisplayed={5}
                                   onPageChange={handlePageClick}
                                   containerClassName={'pagination'}
                                   subContainerClassName={'pages pagination'}
                                   activeClassName={'active'}
                    />

                    <Modal ref='loadingModal' contentStyle={contentStyle} backdrop={false}>
                      <div className={styles.entryHeader}>
                        <h2 className={styles.entryTitleCenter}>Загружается...</h2>
                      </div>
                      <div className={styles.textCenter}>
                        <div className={styles.loaderMain}></div>
                      </div>
                    </Modal>

                    <Modal ref='successModal' contentStyle={contentStyle}>
                      <h2>Сообщение отправлено всем-всем-всем!</h2>
                      <br/>
                      <button className={styles.btnAction} onClick={() => this.refs.successModal.hide()}>
                        Продолжить
                      </button>
                    </Modal>

                    <Modal ref='errorModal' contentStyle={contentStyle}>
                      <h2>Что-то пошло не так</h2>
                      <br/>
                      <button className={styles.btnAction} onClick={() => this.refs.errorModal.hide()}>
                        Продолжить
                      </button>
                    </Modal>

                  </div>
                ) : <div className={styles.textCenter}>
                      <div className={styles.loaderMain}></div>
                    </div>
              }
              </div>
            </div>
          </div>

        </div>

        <Chat admin={true}
              chatTypeId={this.state.chatTypeId}
              groupId={this.state.groupId}
              closeAdminChat={this.closeAdminChat.bind(this)}
              userId={userId}
              user={user}
              status={chat.status}/>
      </div>
    )
  }
}

PendingMinionChats = reduxForm({
  form: 'chatsForm'
})(PendingMinionChats)

const mapStateToProps = state => {
  const {chat, showGlobalMessage, selectedTaskDay, recivedTaskDay, updateChats, chats: { chats, pageCount, isFetching }} = state
  const isChatFetching = chat.isFetching === true
  const isChatsFetching = isFetching

  const taskDay = recivedTaskDay[selectedTaskDay] || {}
  return {
    updateChats,
    showGlobalMessage,
    list: chats,
    pageCount,
    chat,
    userId: Number(cookie.load('user_id')),
    isChatFetching,
    isChatsFetching,
    taskDay,
    selectedTaskDay
  }
}

const mapDispatchToProps = {
  fetchChat,
  fetchChats,
  changeChatType,
  adminChatCloseAction,
  adminChatOpenAction,
  setChatTypeId, setGroupId,
  answerToChat,
  clearRenderChat,
  fetchTaskDayIfNeeded
}

PendingMinionChats = connect(
  mapStateToProps,
  mapDispatchToProps
)(PendingMinionChats)

export default CSSModules(PendingMinionChats, styles)
