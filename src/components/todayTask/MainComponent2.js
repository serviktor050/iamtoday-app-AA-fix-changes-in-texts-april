import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { browserHistory } from 'react-router'
import Chat from '../../containers/Chat'
import Poll from '../componentKit/Poll'
import Header from '../componentKit/Header'
import CalendarList from './CalendarList'
import TaskIntro from './TaskIntro'
import Menu from './Menu'
import Exercises from './Exercises'
import Modal from 'boron-react-modal/FadeModal'
import SendReportModal, {conditions} from './SendReportModal'
import { connect } from 'react-redux'
import cookie from 'react-cookie'
import { api } from '../../config.js'
import ScrollToTop from 'react-scroll-up'

import { createWithMessage, changeChatType, clearRenderChat, setTypeId , PRIVATE_CHAT_ID } from '../../actions'
import CSSModules from 'react-css-modules'
import styles from './mainComponent.css'
import LogoLink from '../componentKit/LogoLink'


let contentStyle = {
  borderRadius: '18px',
  padding: '30px'
}

const reportStyle = {
  borderRadius: '18px',
  padding: '30px'
}

let modalStyle = {
  // position: 'absolute',
  zIndex: '3000',
  transform: 'translate3d(-50%, -50%, 0px)',
  overflowY: 'auto',
  padding: '0',
  bottom: '0',
  rigth: '0',
  width: '100%',
  maxWidth: '530px',
  minWidth: '300px',
  WebkitOverflowScrolling: 'touch',
  height: '100%',
  top: '50%',
  left: '50%'
}

const scrollUpStyle = {
  zIndex: 2000,
  position: 'fixed',
  fontSize: 16,
  bottom: 60,
  left: 30,
  cursor: 'pointer',
  transitionDuration: '0.2s',
  transitionTimingFunction: 'linear',
  transitionDelay: '0s'
}

const HEALTH_CONDITIONS = conditions.reduce((all, {filter, title}) => Object.assign(all, {[filter]: title}), {})

class MainComponent extends Component {
  constructor(props) {
    super()
    this.state = {
      status: ''
    }
  }

  componentWillMount() {
    if (window.mobilecheck()) {
      contentStyle.margin = '100px'
      contentStyle.width = '300px'
      delete reportStyle.borderRadius
    }

    if (!window.mobilecheck()) {
      modalStyle = {}
    }

    const { setTypeId, taskDay, clearRenderChat, changeChatType } = this.props
    //setTypeId(taskDay.id)
    changeChatType(PRIVATE_CHAT_ID)
    //clearRenderChat()
  }

  componentWillReceiveProps(nextProps) {
    const { renderPublicChatAction, renderPrivateChatAction, chatType, typeId, changeChatType } = this.props
    //this.props.isFetchingChat === 0 ||

  }


  createTask(data) {
    const { taskDay, token, createWithMessage } = this.props
    const healthConditions = HEALTH_CONDITIONS[data.health] && HEALTH_CONDITIONS[data.health] !== 'undefined' ? HEALTH_CONDITIONS[data.health] : ''
    const dataReport = data.report && data.report !== 'undefined' ? data.report : ''
    const dataVideo = data.video && data.video !== 'undefined' ? data.video : ''

    const chatMessage = data.video && data.video !== 'undefined'
      ? `Отчёт для тренера: Комментарий: "${dataReport}"; Видео: ${dataVideo}; Оценка: ${healthConditions}.`
      : `Отчёт для тренера: Комментарий: "${dataReport}"; Оценка: ${healthConditions}.`

    return Promise.all([

      createWithMessage(PRIVATE_CHAT_ID, null, chatMessage, true),
      fetch(`${api}/user/userDay-create`, {

        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
          authToken: token ? token : cookie.load('token'),
          data: {
            ...data,
            health: data.health,
            day: taskDay.id,
            user: taskDay.user.id,
            status: 'waiting',
            admin: taskDay.user.admin,
            adminAnswer: ''
          }
        })
      })
        .then(response => response.json())
        .then(json => {
          this.refs.successModal.show()
          this.refs.sendReportModal.hide()
          if (json.isSuccess) {
            if (taskDay.isVideo) {
              document.getElementById('reportButton').style.cssText = 'pointer-events: none; opacity: 0.4;'
            }
            this.setState({
              status: 'waiting'
            })
          }
        })
    ])
  }

  /*shouldComponentUpdate(nextProps, nextState){

    if(!nextProps.typeId){
      console.log('scurrrrrr')
      return false
    }
  }
*/


  render() {

    const { taskDay, token, pollWasSend, setTypeId, changeChatType, clearRenderChat, selectedDayId, updateAction, taskDayData, typeId, location } = this.props
    const { intro, tasks, isVideo, status, date, poll, calendar, id, isPollVoted, forceSendReportEnable, user, user: { firstName, lastName, role, gender } } = taskDay
    const introJSON = intro && intro[0] && intro[0].intro ? JSON.parse(intro[0].intro) : null
    const introHTML = intro && intro[0] && intro[0].introHTML ? intro[0].introHTML : ''

    const { isFetching, isLoad, dayData } = taskDayData

    return (
      <div className={styles.layout}>
        <Header closeMobMenu={() => {}} isTask={true}/>

        <div className={styles.layoutInner}>
          <div className={styles.grid}>
            <div className={styles.gridCellLayoutMenu14}>
              <div id="menu" className={styles.gridLayoutMenuInner}>
                <Menu
                  fullName={`${firstName} ${lastName}`}
                  gender={gender}
                  location={location}
                />

                <CalendarList
                  calendar={calendar}
                  dayId={id} role={role}
                  privateChatId={PRIVATE_CHAT_ID}
                  status={this.state.status}
                  setTypeId ={setTypeId}
                  changeChatType={changeChatType}
                  clearRenderChat={clearRenderChat}
                  updateAction = {updateAction}
                />

              </div>
            </div>
            <div className={styles.gridCellLayoutContentPocket34}>
              <TaskIntro
                date={date}
                text={introHTML}
                json={introJSON}
                isTasks={!!tasks && !!tasks[0]} scrollToTasks={e => {
                  e.preventDefault()

                  const nextElement = document.getElementById('tasks')
                  let offset = 0
                  if (nextElement) {
                    offset = nextElement.offsetTop - 20
                  } else {
                    offset = this.refs.taskResults.offsetTop
                  }
                  window.scrollTo(0, offset)
                }}
              />

              <div id='tasks'/>

              {tasks && tasks[0] &&
              <Exercises
                forceSendReportEnable={forceSendReportEnable}
                token={token}
                tasks={tasks}
                isVideo={isVideo}
                status={status}
                date={date}
                sendReport={() => {
                 this.refs.sendReportModal.show()
                }}
              />
              }

              <Modal ref='sendReportModal' modalStyle={modalStyle} contentStyle={reportStyle}>
                <SendReportModal isVideo={taskDay.isVideo} onSubmit={(data) => this.createTask(data)}/>
              </Modal>
              <Modal ref='successModal' contentStyle={contentStyle}>
                <h2>Отчет отправлен! В течении некоторого времени его проверит твой тренер</h2>
                <br/>
                <div className={styles.btnAction} onClick={e => this.refs.successModal.hide()}>
                  Продолжить
                </div>
              </Modal>

              {poll && poll.description && !isPollVoted && !pollWasSend.find(p => p === id) &&
              <Poll poll={poll} id={id}/>
              }

              {!isFetching && isLoad ?
                <Chat
                  userId={taskDay.user.id}
                  user={user}
                  type={PRIVATE_CHAT_ID}
                  isWindow={false}
                  showAdminPanel={false}
                  isTaskChat={true}
                  role={role}
                  kindChat={1}
                  typeId={dayData.id}
                  admin={false}
                /> : null}

              <ScrollToTop style={scrollUpStyle} showUnder={160}>
                <div className={styles.btnGoBack}>
                  <svg className={styles.svgIcoArrowUp}>
                    <use xlinkHref="#ico-arrow-up"></use>
                  </svg>
                </div>
              </ScrollToTop>
            </div>
          </div>
        </div>

        <ul className={styles.menuMobBottom}>
          <li className={styles.menuMobBottomItem}>
            <a href="#" className={styles.menuMobBottomItemInner} onClick={
              () => browserHistory.push('/reports')
            }>
              <span className={styles.menuMobBottomIco}>
                <svg className={styles.svgIcoBookMobile}>
                  <use xlinkHref="#ico-m-book"></use>
                </svg>
              </span>
              <span className={styles.menuMobBottomTitle}>Зачетка</span>
            </a>
          </li>
          <li className={styles.menuMobBottomItem}>
            <a href="#" className={styles.menuMobBottomItemInner} onClick={
              () => browserHistory.push('/food')
            }>
              <span className={styles.menuMobBottomIco}>
                <svg className={styles.svgIcoFoodMobile}>
                  <use xlinkHref="#ico-m-food"></use>
                </svg>
              </span>
              <span className={styles.menuMobBottomTitle}>Питание</span>
            </a>
          </li>
          <li className={styles.menuMobBottomItem}>
            <a href="#" className={styles.menuMobBottomItemInner} onClick={
              () => browserHistory.push('/faq')
            }>
              <span className={styles.menuMobBottomIco}>
                <svg className={styles.svgIcoFaqMobile}>
                  <use xlinkHref="#ico-m-faq"></use>
                </svg>
              </span>
              <span className={styles.menuMobBottomTitle}>Вопросы/Ответы</span>
            </a>
          </li>
          <li className={styles.menuMobBottomItem}>
            <a href="#" className={styles.menuMobBottomItemInner} onClick={
              () => browserHistory.push('/profile')
            }>
              <span className={styles.menuMobBottomIco}>
                <svg className={styles.svgIcoFaqMobile}>
                  <use xlinkHref="#ico-m-faq"></use>
                </svg>
              </span>
              <span className={styles.menuMobBottomTitle}>Профиль</span>
            </a>
          </li>
          <li className={styles.menuMobBottomItem}>
            <a href="#" className={styles.menuMobBottomItemInner} onClick={
              () => browserHistory.push('/seasons')
            }>
              <span className={styles.menuMobBottomIco}>
                <svg className={styles.svgIcoFaqMobile}>
                  <use xlinkHref="#ico-m-faq"></use>
                </svg>
              </span>
              <span className={styles.menuMobBottomTitle}>Сезоны</span>
            </a>
          </li>
          <li className={styles.menuMobBottomItem}>
            <a href="#" className={styles.menuMobBottomItemInner} onClick={
              () => browserHistory.push('/photos')
            }>
              <span className={styles.menuMobBottomIco}>
                <svg className={styles.svgIcoPhoto}>
                  <use xlinkHref="#ico-photo"></use>
                </svg>
              </span>
              <span className={styles.menuMobBottomTitle}>Фото</span>

            </a>
          </li>
          <li className={styles.menuMobBottomItem}>
            <a href="#" className={styles.menuMobBottomItemInner} onClick={
              () => browserHistory.push('/chats')
            }>
              <span className={styles.menuMobBottomIco}>
                <svg className={styles.svgIcoPhoto}>
                  <use xlinkHref="#ico-chat"></use>
                </svg>
              </span>
              <span className={styles.menuMobBottomTitle}>Чат</span>

            </a>
          </li>

        </ul>

        <div className="menu-mob-left">
          <div className="menu-mob-left__inner">
            <div className="menu-mob-left__ico-close">
              <svg className={styles.svgIcoClose}>
                <use xlinkHref="#ico-close"></use>
              </svg>
            </div>
            <div className="menu-mob-left__logo">
              <LogoLink/>
            </div>
            <ul className={styles.mainNav}>
              <li className="main-nav__item main-nav__item--active">
                <a href="#" className="main-nav__item-inner">
                  <svg className={styles.svgIcoTasksMobile}>
                    <use xlinkHref="#ico-m-tasks"></use>
                  </svg>
                  <span className="main-nav__title">Задания</span>
                </a>
              </li>
              <li className={styles.mainNavItem}>
                <a href="#" className="main-nav__item-inner">
                  <svg className={styles.svgIcoBookMobile}>
                    <use xlinkHref="#ico-m-book"></use>
                  </svg>
                  <span className="main-nav__title">Зачетка</span>
                </a>
              </li>
              <li className={styles.mainNavItem}>
                <a href="#" className="main-nav__item-inner">
                  <svg className={styles.svgIcoFoodMobile}>
                    <use xlinkHref="#ico-m-food"></use>
                  </svg>
                  <span className="main-nav__title">Питание</span>
                </a>
              </li>
              <li className={styles.mainNavItem}>
                <a href="#" className="main-nav__item-inner">
                  <svg className={styles.svgIcoFaqMobile}>
                    <use xlinkHref="#ico-m-faq"></use>
                  </svg>
                  <span className="main-nav__title">Вопросы/Ответы</span>
                </a>
              </li>
            </ul>
            <hr/>
            <div className={styles.profile}>
              <a href="#">
                <p className={styles.profileName}>Анна Иванова</p>
                <p className={styles.profileSubText}>Профиль</p>
              </a>
            </div>
            <hr/>
            <ul className="banner-ls banner-ls--menu-mob-left">
              <li className="banner-ls__item">
                <a href="#">
                  <div className="banner-ls__img">
                    <img src="/tmp/banner-2.png" alt=""/>
                  </div>
                  <p className="banner-ls__desc">В твой выходной день только сегодня TezTour дарит -10% на тур</p>
                </a>
              </li>
              <li className="banner-ls__item">
                <a href="#">
                  <div className="banner-ls__img">
                    <img src="/tmp/banner-1.png" alt=""/>
                  </div>
                </a>
              </li>
            </ul>
            <hr/>
            <div className={styles.btnAction}>Выйти из кабинета</div>
          </div>
        </div>

        {/* <div id="fill-report-2">
          <div className={styles.basePopupMsg}>
            <h3 className={styles.h1}>Отчет миньону отправлен успешно!</h3>
            <hr/>
            <div className={styles.basePopupMsgContent}>
              <p className={styles.baseParag}>Молодец! Так держать! Нам нравится твой подход к тренировкам. Не сдавайся, и ты скоро ты увидишь ошеломляющий  результат.</p>
            </div>
            <div className={styles.btnPrimaryFillReport3}>Зачетна книжка</div>
          </div>
        </div>

        <div id="fill-report-3">
          <div className={styles.basePopupMsg}>
            <h3 className={styles.h1}>Это твоя зачетная книжка.</h3>
            <hr/>

            <div className={styles.basePopupMsgContent}>
              <p className={styles.baseParag}>Здесь ты будешь сдавать тренерам “проверяющим” отчеты о своих выполненных заданиях. Они тебе будут задавать наводящие вопросы, для того, чтобы проверить тебя. Мы ведь обещали, что спуску не дадим! Пиши отчет по каждому выполненному заданию и двигайся вперед к финальным задачам! Удачи!</p>

            </div>
            <div className={styles.btnPrimary}>Отлилчно!</div>
          </div>
        </div> */}

      </div>
    )
  }
}

const mapStateToProps = state => {
  const { taskDayData, selectedDayId } = state

  return {todayTask: state.todayTask, pollWasSend: state.pollWasSend,  selectedDayId, taskDayData}
}

const mapDispatchToProps = dispatch => ({
  createWithMessage: bindActionCreators(createWithMessage, dispatch),
  setTypeId: bindActionCreators(setTypeId , dispatch),
  changeChatType: bindActionCreators(changeChatType , dispatch),
  clearRenderChat: bindActionCreators(clearRenderChat , dispatch)
})

MainComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(MainComponent)

export default CSSModules(MainComponent, styles)
