import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Scroll from 'react-scroll'
import Chat from '../../containers/Chat'
import Poll from '../componentKit/Poll'
import TaskIntro from './TaskIntro'
import Exercises from './Exercises'
import Modal from 'boron-react-modal/FadeModal'
import SendReportModal, {conditions} from './SendReportModal'
import cookie from 'react-cookie'
import { api } from '../../config.js'
import Loader from '../componentKit/Loader'
import Layout from '../componentKit2/Layout'
import { sendLink, createWithMessage, changeChatType, fetchProfileIfNeeded, clearRenderChat, setTypeId , PRIVATE_CHAT_ID } from '../../actions'
import CSSModules from 'react-css-modules'
import styles from './mainComponent.css'
import LogoLink from '../componentKit/LogoLink'
import SendReport from './SendReport'
import BodyParams from '../profile/BodyParams'
import Music from './Music';
import moment from "moment/moment";

let contentStyle = {
  borderRadius: '18px',
  padding: '30px',
  textAlign: 'center'
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

const month = [
	'января',
	'февраля',
	'марта',
	'апреля',
	'мая',
	'июня',
	'июля',
	'августа',
	'сентября',
	'октября',
	'ноября',
	'декабря',
]

const HEALTH_CONDITIONS = conditions.reduce((all, {filter, title}) => Object.assign(all, {[filter]: title}), {})

class MainComponent extends Component {
  constructor(props) {
    super();
    this.state = {
      status: '',
      errMsg: 'Что-то пошло не так, попробуйте снова'
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

    const { setTypeId, taskDay, fetchProfileIfNeeded, selectedProfile, clearRenderChat, changeChatType } = this.props
    changeChatType(PRIVATE_CHAT_ID)
    //clearRenderChat()
  }

  componentWillReceiveProps(nextProps) {
    const { renderPublicChatAction, renderPrivateChatAction, chatType, typeId, changeChatType } = this.props
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
          if (json.isSuccess) {
            if (taskDay.isVideo) {
              //document.getElementById('reportButton').style.cssText = 'pointer-events: none; opacity: 0.4;'
            }
            this.setState({
              status: 'waiting'
            })
          }
        })
    ])
  }

  createLink = (link, cb) => {

    const { taskDay } = this.props;
    const data =  {
      video: link,
      user: taskDay.user.id,
      day: taskDay.id
    };
    const payload = {
      authToken: cookie.load('token'),
      data
    };


    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    const method = 'POST';

    this.refs.loadingModal.show()
    return fetch(`${api}/user/socTaskReport-create`, {
      headers,
      method,
      body: JSON.stringify(payload)
    })
      .then(response => response.json())
      .then(json => {
        this.refs.loadingModal.hide();
        if (json.errorCode == 133) {
          this.setState({
            errMsg:json.errorMessage || 'Что-то пошло не так, попробуйте снова'
          })
        }
        if (json.isSuccess) {
          return cb(json.data.status);
        }
        this.refs.errorModal.show();
      });
  }

  render() {
    const { taskDay, token, pollWasSend, dispatch,
      taskDayData,  showFull, showFullContent,
      showMinContent,  params, sign, userInfo, location } = this.props
    let { socTask, intro, tasks, isVideo, status, date, poll, calendar, id, playlists, isPollVoted, showBodyMeasures, forceSendReportEnable, user, user: { firstName, lastName, role, gender, program, photo } } = taskDay
    let introJSON = intro && intro[0] && intro[0].intro ? JSON.parse(intro[0].intro) : null
    let introJSONMin = intro && intro[0] && intro[0].introMin ? JSON.parse(intro[0].introMin) : null
    const isNav = intro[0] && intro[0].intro && intro[0].introMin;
    const introHTML = intro && intro[0] && intro[0].introHTML ? intro[0].introHTML : '';
    const hasEditorTasks = introJSON && Object.keys(introJSON.entityMap).some((key) => introJSON.entityMap[key].type === 'TASK')
    const { isFetching, isLoad, dayData } = taskDayData;
    const isToggleMobileStylesNeeded = tasks && tasks[0] && window.mobilecheck();

    const dateString = `${moment(date).get('date')} ${month[moment(date).get('month')]}`;

      if(!introJSON){
          introJSON = introJSONMin;
      }
      if(!introJSONMin){
          introJSONMin = introJSON;
      }

    return (
    <Layout location={location} page={'tasks'} params={params} calendarLoadSlow={isFetching || !isLoad} prevSeasons={userInfo.data.prevSeasons}>
        {!isFetching && isLoad ?
            <div className={styles.wrap}>
              <ul className={styles.contentNav}>
                {tasks && tasks[0] &&
                  <li
                    className={styles.contentNavItem}
                    style={window.mobilecheck() ? { paddingRight: '5px' } : {}}
                    onClick={e => {
                      e.preventDefault()

                      const nextElement = document.getElementById('tasks');
                      let offset = 0;
                      if (nextElement) {
                        offset = nextElement.offsetTop - 20
                      } else {
                        offset = this.refs.taskResults.offsetTop
                      }
                      Scroll.animateScroll.scrollTo(offset)
                    }}
                  >
                    <span className={window.mobilecheck() ? styles.btnBaseMobile : styles.btnBase}>
                      <span className={styles.btnTitle}>к заданию</span>
                      <span className={styles.btnIco}>
                        <svg className={window.mobilecheck() ? styles.svgIconBoldArrowDownMoble : styles.svgIconBoldArrowDown}>
                          <use xlinkHref="#ico-bold-arrow-down"></use>
                        </svg>
                      </span>
                    </span>
                  </li>
                }
                  {/*{
                      isNav &&
                      <li className={styles.contentNavItemToggle}>
                        <span className={styles.btnToggle}>
                          <span
                              className={showFull ? styles.btnToggleItemActive : styles.btnToggleItem}
                              onClick={showMinContent}
                          >
                            <span className={styles.btnToggleIco}>
                              <svg className={styles.svgIconContentMin}>
                                <use xlinkHref="#ico-content-min"></use>
                              </svg>
                            </span>
                            <span className={styles.btnToggleTitle}>Коротко</span>
                          </span>
                          <span
                              className={!showFull ? styles.btnToggleItemActive : styles.btnToggleItem}
                              onClick={showFullContent}
                          >
                            <span className={styles.btnToggleIco}>
                              <svg className={styles.svgIconContentMax} style={{fill: '#000'}}>
                                <use xlinkHref="#ico-content-max"></use>
                              </svg>
                            </span>

                            <span className={styles.btnToggleTitle}>Подробно</span>
                          </span>
                        </span>
                      </li>
                  }*/}
              </ul>

              <TaskIntro
                date={date}
                sign={sign}
                paidState={user.paidState}
                text={introHTML}
                json={showFull ? introJSON : introJSONMin}
                isFull={showFull}
                showFullContent={showFullContent}
                isTasks={tasks && tasks[0]}
              />

              {playlists && playlists.length ?  <Music playlists={playlists}/> : null}

              <div id='tasks'/>

              {tasks && tasks[0] && !hasEditorTasks &&
                <Exercises
                  forceSendReportEnable={forceSendReportEnable}
                  token={token}
                  tasks={tasks}
                  isVideo={isVideo}
                  status={status}
                  date={date}
                  dateString={dateString}
                  socTask={socTask}
                  sendLink={this.createLink}
                  sendReport={() => {
                   this.refs.sendReportModal.show()
                  }}
                />
              }
              {
                showBodyMeasures  &&
                <BodyParams bodyMeasures={userInfo.data.bodyMeasures}/>
              }

              {((tasks && tasks[0] && !status && this.state.status !== 'waiting') ||
                forceSendReportEnable) &&
                  <SendReport
                    isVideo={taskDay.isVideo}
                    onSubmit={(data) => this.createTask(data)}
                    forceSendReportEnable={forceSendReportEnable}
                    status={status}
										dateString={dateString}
                    date={date}
                  />
              }
              <Modal ref='successModal' contentStyle={contentStyle}>
                <h2>Отчет отправлен! В течениe некоторого времени его проверит твой тренер</h2>
                <br/>
                <div className={styles.btnAction} onClick={e => this.refs.successModal.hide()}>
                  Продолжить
                </div>
              </Modal>

              <Modal ref='loadingModal' contentStyle={contentStyle} backdrop={false}>
                <div className={styles.entryHeader}>
                  <h2 className={styles.entryTitleCenter}>Загружается...</h2>
                </div>
                <div className={styles.textCenter}>
                  <div className={styles.loaderMain}></div>
                </div>
              </Modal>
              <Modal ref='errorModal' contentStyle={contentStyle}>
                <h2>{this.state.errMsg}</h2>
                <br/>
                <button className={styles.btnAction} onClick={() => this.refs.errorModal.hide()}>
                  Продолжить
                </button>
              </Modal>

              {poll && poll.description  &&
                <Poll
                  poll={poll}
                  id={id}
                  isPollVoted={isPollVoted}
                  pollWasSend={pollWasSend}
                />
              }
            </div> : <Loader />}
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


      </Layout>
    )
  }
}

const mapStateToProps = state => {
  const { selectedProfile, recivedProfile, taskDayData, selectedDayId, showFull, showMobileLeftMenu, sign, userInfo } = state

  return {
    todayTask: state.todayTask,
    pollWasSend: state.pollWasSend,
    showFull,
    sign,
    userInfo,
    selectedProfile,
    showMobileLeftMenu,
    selectedDayId,
    taskDayData
  }
}

const mapDispatchToProps = dispatch => ({
  createWithMessage: bindActionCreators(createWithMessage, dispatch),
  setTypeId: bindActionCreators(setTypeId , dispatch),
  changeChatType: bindActionCreators(changeChatType , dispatch),
  clearRenderChat: bindActionCreators(clearRenderChat , dispatch),
  fetchProfileIfNeeded: bindActionCreators(fetchProfileIfNeeded, dispatch),
  showFullContent: bindActionCreators(
    () => dispatch({ type: 'SHOW_FULL_CONTENT', isFull: true }),
    dispatch
  ),
  showMinContent: bindActionCreators(
    () => dispatch({ type: 'SHOW_FULL_CONTENT', isFull: false }),
    dispatch
  ),
  showLeftMenu: bindActionCreators(
    () => dispatch({ type: 'SHOW_LEFT_MENU', show: true }),
    dispatch
  ),
  hideLeftMenu: bindActionCreators(
    () => dispatch({ type: 'SHOW_LEFT_MENU', show: false }),
    dispatch
  )
})

MainComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(MainComponent)

export default CSSModules(MainComponent, styles)
