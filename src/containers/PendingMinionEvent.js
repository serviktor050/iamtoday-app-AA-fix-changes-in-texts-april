import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {connect} from 'react-redux'
import {Link} from 'react-router'
import EmojiPicker from 'emojione-picker'
import Textarea from 'react-textarea-autosize'
import {
  fetchChat,
  closeChat,
  createWithMessage,
  rejectExam,
  waitingExam,
  approveExam,
  fetchPendingExam,
  PRIVATE_CHAT_ID
} from '../actions'
import CSSModules from 'react-css-modules'
import styles from './pendingMinionEvent.css'

import Chat from './Chat'
import UserReportsMenu from '../components/userReports/UserReportsMenu'

const programs = [
  'Я герой',
  'Мама может',
  'Экстренная сушка'
]

const healthConditions = {
  bad: 'Ужасно',
  middle: 'Так себе',
  good: 'Отлично'
}
const youtubePattern = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/

/**
 *  Контейнер UserReports.
 *  Используется для отображения страницы экзаменов в админке (/userReports/exams/:userId/:dayId)
 *
 */
class UserReports extends Component {
  /**
   * @memberof UserReports
   * @prop {object} propTypes - the props that are passed to this component
   * @prop {number} propTypes.userId id Пользователя
   * @prop {func} propTypes.closeChat Функция закрывания чата
   * @prop {func} propTypes.fetchPendingExam Получение данных с сервера(экзамены)
   * @prop {func} propTypes.rejectExam Функция отклонения экзамена
   * @prop {func} propTypes.waitingExam Функция  - экзамен в ожидании
   * @prop {func} propTypes.approveExam Функция  - принять экзамен
   * @prop {object} propTypes.userInfo Данные пользователя
   *
   * */
  static propTypes = {
    userId: PropTypes.number.isRequired,
    closeChat: PropTypes.func.isRequired,
    fetchPendingExam: PropTypes.func.isRequired,
    approveExam: PropTypes.func.isRequired,
    rejectExam: PropTypes.func.isRequired,
    waitingExam: PropTypes.func.isRequired,
    userInfo: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props)
    this.state = {
      /**
       * Видим ли popup
       * @memberof UserReports
       */
      isConfirmPopupVisible: false,
      /**
       * Показать  Emoji
       * @memberof UserReports
       */
      showEmojiPopup: false
    }
  }

  componentWillMount() {
    const {fetchPendingExam, routeParams} = this.props

    fetchChat(PRIVATE_CHAT_ID)
    fetchPendingExam(routeParams.userId, routeParams.dayId)
  }

  componentWillUnmount() {
    const {closeChat} = this.props

    closeChat()
  }

  confirmChoice() {
    const {confirmMessage} = this.refs
    const {confirmationAction} = this.state

    this.toggleStatus(confirmationAction, confirmMessage.value)
  }

  toggleStatus(action, message) {
    const {id, router} = this.props

    action(id, message)
      .then(() => router.push('/userReports/exams'))
  }

  showConfirmPopup(confirmationAction) {
    this.setState({isConfirmPopupVisible: true, confirmationAction})
  }

  hideConfirmPopup() {
    this.setState({isConfirmPopupVisible: false})
  }

  dateFormat(date, bool) {
    let newDate

    if (date) {
      let arr = date.split('-')
      let arrTime = date.split('T')
      let age

      if (bool) {
        newDate = arrTime[1].slice(0, 8) + ',' + ' ' + arr[2].slice(0, 2) + '-' + arr[1] + '-' + arr[0]
        return newDate
      }
      newDate = arr[2].slice(0, 2) + '-' + arr[1] + '-' + arr[0]

      age = Math.floor((new Date() - new Date(arr[0], arr[1] - 1, arr[2].slice(0, 2))) / 3600 / 1000 / 24 / 365.25)
      return {newDate, age}
    }

    return 'Нет данных'
  }

  toggleEmojiPopup() {
    this.setState({showEmojiPopup: !this.state.showEmojiPopup})
  }

  appendEmoji(unicode) {
    this.refs.confirmMessage.value += this.getEmoji(unicode)
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

  render() {
    const { isConfirmPopupVisible, showEmojiPopup } = this.state

    const {
      userId,
      isFetching,
      approveExam,
      waitingExam,
      rejectExam,
      video = '',
      report,
      health,
      createTs,
      userInfo
    } = this.props

    const {
      firstName,
      lastName,
      city,
      program,
      id,
      diseases,
      birthday,
      bodyMeasure,
      isSpectator
      } = userInfo ? userInfo : 'Нет данных'

    const {
      hips,
      chest,
      height,
      thigh,
      waist,
      weight,
      date
      } = bodyMeasure ? bodyMeasure : 'Нет данных'

    const fullName = firstName + ' ' + lastName

    const birthdayFormat = this.dateFormat(birthday).newDate
    const dateFormat = this.dateFormat(date).newDate
    const createTsFormat = this.dateFormat(createTs, true).newDate

    const age = this.dateFormat(birthday).age
    const healthCondition = healthConditions[health] || healthConditions.middle

    let matchYoutubeUrl = ''
    let videoEmbedUrl = ''
    let isVideoValid = false
    let yandexVideo = false

    if (video && video.indexOf('drive.google.com') > -1) {
      matchYoutubeUrl = video.match(/open\?id=(.*)|file\/d\/(.*)\/view/)
      if(matchYoutubeUrl){
        isVideoValid = matchYoutubeUrl[1] || matchYoutubeUrl[2]
        videoEmbedUrl = `https://drive.google.com/file/d/${matchYoutubeUrl[1] ? matchYoutubeUrl[1] : matchYoutubeUrl[2]}/preview`
      }

    } else if (video && video.indexOf('yadi.sk') > -1) {
      yandexVideo = true
      videoEmbedUrl = video
    } else if (video && video.match(youtubePattern)) {
      matchYoutubeUrl = video.match(youtubePattern)
      if(matchYoutubeUrl){
        isVideoValid = matchYoutubeUrl && matchYoutubeUrl[2].length === 11
        videoEmbedUrl = isVideoValid ? `https://www.youtube.com/embed/${matchYoutubeUrl[2]}?autoplay=0` : null
      }
    }

    return (
        <div className={styles.layout}>
          <Chat
            userId={userId}
            onWaiting={() => this.toggleStatus(waitingExam, '')}/>

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
                  isFetching ? <div className={styles.textCenter}>
                        <div className={styles.loaderMain}></div>
                      </div> : (
                      <div className={styles.pendingProfile}>
                        <div className={styles.pendingProfileTopPanel}>
                          <div className={styles.pendingProfileButtons}>
                            <button
                              onClick={() => this.showConfirmPopup(approveExam)}
                              className={styles.pendingProfileButtonPrimary}>
                              Отчёт принят
                            </button>
                            <button
                              onClick={() => this.showConfirmPopup(rejectExam)}
                              className={styles.pendingProfileButtonAction}>
                              Отчёт не принят
                            </button>
                            <button
                              onClick={() => this.showConfirmPopup(waitingExam)}
                              className={styles.pendingProfileButtonSecondary}>
                              Вернуть клиенту
                            </button>
                          </div>

                          <Link
                            to="/userReports/exams"
                            className={styles.pendingProfileCloseButton}>
                            <svg className={styles.svgIcoClose}>
                              <use xlinkHref="#ico-close"></use>
                            </svg>
                          </Link>
                        </div>

                        <div className={styles.pendingProfileContainer}>
                          <div className={styles.pendingProfileRow}>
                            <h3 className={styles.pendingProfileRowTitle}>
                              Состояние
                            </h3>

                            {healthCondition}
                          </div>

                          <div className={styles.pendingProfileRow}>
                            <h3 className={styles.pendingProfileRowTitle}>
                              Комментарий
                            </h3>

                            {report}
                          </div>

                          <div className={styles.pendingProfileRow}>
                            <h3 className={styles.pendingProfileRowTitle}>
                              Видео
                            </h3>

                            {
                              yandexVideo ? (
                                <a href='#' onClick={e => {
                                  e.preventDefault()
                                  window.open(videoEmbedUrl, '_blank')
                                }}>
                                  Открыть в Яндекс Диске
                                </a>
                              ) : isVideoValid ? (
                                  <iframe width="420" height="315" src={videoEmbedUrl}/>
                                ) : video
                            }
                          </div>

                          <div className={styles.pendingProfileRow}>
                            <h2>Информация о пользователе</h2>

                            <div className={styles.pendingProfileRow}>
                              <h3 className={styles.pendingProfileRowTitle}>
                                id Пользователя
                              </h3>

                              {id}
                            </div>

                            <div className={styles.pendingProfileRow}>
                              <h3 className={styles.pendingProfileRowTitle}>
                                Имя
                              </h3>

                              {fullName}
                            </div>

                            <div className={styles.pendingProfileRow}>
                              <h3 className={styles.pendingProfileRowTitle}>
                               Программа
                              </h3>

                              {programs[program - 1]}
                            </div>

                            <div className={styles.pendingProfileRow}>
                              <h3 className={styles.pendingProfileRowTitle}>
                                Претендует на призы:
                              </h3>

                              {isSpectator ? 'нет' : 'да'}
                            </div>

                            <div className={styles.pendingProfileRow}>
                              <h3 className={styles.pendingProfileRowTitle}>
                                Город
                              </h3>

                              {city}
                            </div>

                            <div className={styles.pendingProfileRow}>
                              <h3 className={styles.pendingProfileRowTitle}>
                                День рождения
                              </h3>

                                {birthdayFormat} ({age})

                            </div>

                            <div className={styles.pendingProfileRow}>
                              <h3 className={styles.pendingProfileRowTitle}>
                                Травмы
                              </h3>

                              {diseases}
                            </div>

                            <div className={styles.pendingProfileRow}>
                              <h3 className={styles.pendingProfileRowTitle}>
                                Дата отправки отчета
                              </h3>

                              {createTsFormat}
                            </div>

                            <div className={styles.pendingProfileRow}>
                              <h3 className={styles.pendingProfileRowTitle}>
                                Параметры тела:
                              </h3>

                              <div>
                                <table className={styles.pendingProfileParams}>
                                  <tr>
                                    <td>Дата заполнения</td>
                                    <td> {dateFormat}</td>
                                  </tr>
                                  <tr>
                                    <td>Рост</td>
                                    <td>{height ? height + ' см' : 'нет данных'}</td>
                                  </tr>
                                  <tr>
                                    <td>Вес</td>
                                    <td>{weight ? weight + ' кг' : 'нет данных'}</td>
                                  </tr>
                                  <tr>
                                    <td>Грудь</td>
                                    <td>{chest ? chest + ' см' : 'нет данных'}</td>
                                  </tr>
                                  <tr>
                                    <td>Талия</td>
                                    <td>{waist ? waist + ' см' : 'нет данных'}</td>
                                  </tr>
                                  <tr>
                                    <td>Бедра</td>
                                    <td>{hips ? hips + ' см' : 'нет данных'}</td>
                                  </tr>
                                  <tr>
                                    <td>Обхват бедра</td>
                                    <td> {thigh ? thigh + ' см' : 'нет данных'}</td>
                                  </tr>

                                </table>
                              </div>

                            </div>
                          </div>

                        </div>
                      </div>
                    )
                }

                {
                  isConfirmPopupVisible ? (
                      <div className={styles.pendingProfileInnerPopup}>
                        <br/>
                        <br/>
                        <br/>
                        <br/>
                        <div className={styles.pendingProfileTopPanel}>
                          <div className={styles.pendingProfileButtons}>
                            <button
                              onClick={() => this.confirmChoice()}
                              className={styles.pendingProfileButtonPrimary}>
                              Принять
                            </button>
                            <button
                              onClick={() => this.hideConfirmPopup()}
                              className={styles.pendingProfileButtonAction}>
                              Отмена
                            </button>
                          </div>

                          <div className={styles.pendingProfileCloseButton}
                               onClick={() => this.hideConfirmPopup()}>
                            <svg className={styles.svgIcoClose}>
                              <use xlinkHref="#ico-close"></use>
                            </svg>
                          </div>
                        </div>

                        <br/>
                        <br/>
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
                              ref="confirmMessage"
                              onKeyDown={e => {
                                if (e.keyCode === 13 && !e.shiftKey) {
                                  this.refs.confirmMessage.value = ''
                                  this.confirmChoice()
                                }
                              }}
                              placeholder="Написать комментарий"
                              className={styles.chatFormInnerTextarea}></Textarea>
                          </div>
                        </div>
                      </div>
                    ) : null
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  const {pendingEvent = {}} = state


  return pendingEvent
}

const mapDispatchToProps = {
  fetchChat,
  closeChat,
  createWithMessage,
  rejectExam,
  waitingExam,
  approveExam,
  fetchPendingExam
}

UserReports = connect(
  mapStateToProps,
  mapDispatchToProps
)(UserReports)

export default CSSModules(UserReports, styles)
