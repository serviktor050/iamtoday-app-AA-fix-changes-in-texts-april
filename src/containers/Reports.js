import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux'
import moment from 'moment'
import { bindActionCreators } from 'redux'
import Layout from '../components/componentKit2/Layout'
import { api, domen } from '../config.js'

import {
  selectReports,
  invalidateReports,
  fetchReportsIfNeeded,
  fetchTaskDayIfNeeded
} from '../actions'
import LoadingView from '../components/componentKit/LoadingView'
import CSSModules from 'react-css-modules'
import styles from './reports.css'
/**
 *  Контейнер Reports.
 *  Используется для отображения страницы 'Зачетка' (/reports)
 *
 */
class Reports extends Component {
  /**
   * @memberof Reports
   * @prop {Object} propTypes - the props that are passed to this component
   * @prop {boolean} propTypes.isFetching Индикатор загрузки
   * @prop {func} propTypes. selectReports Выбор программы
   * @prop {array} propTypes.reports Зачеты
   * @prop {array} propTypes.activeAccordionItems Активные зачеты
   * @prop {object} propTypes.taskDay Данные для дня
   * @prop {string} propTypes.selectedReports Выбор зачетов
   * @prop {func} propTypes.fetchReportsIfNeeded Загрузка зачетов с сервера
   * @prop {func} propTypes.fetchTaskDayIfNeeded Загрузка дня с заданием с сервера
   *
   * */
  static propTypes = {
    taskDay: PropTypes.object.isRequired,
    isFetching: PropTypes.bool.isRequired,
    /**
     * Функция для выбора отчета
     * @memberof  Reports
     * @param {reports}  Зачеты.
     */
    selectReports:PropTypes.func.isRequired,
    reports:PropTypes.array.isRequired,
    activeAccordionItems:PropTypes.array.isRequired,
    selectedReports: PropTypes.string.isRequired,
    /**
     * Функция для получения данных с сервера для рендеринга страницы 'Зачетка'.
     * @memberof Reports
     * @param {string} Зачеты.
     */
    fetchReportsIfNeeded: PropTypes.func.isRequired,
    /**
     * Функция для получения данных с сервера для раздела 'Задания'.
     * @memberof Reports
     * @param {number} day - Номер дня.
     */
    fetchTaskDayIfNeeded: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired
  }

  componentDidMount() {
    const { fetchReportsIfNeeded, selectedReports, fetchTaskDayIfNeeded } = this.props
    fetchReportsIfNeeded(selectedReports)
    fetchTaskDayIfNeeded('reactjs')
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.selectedReports !== this.props.selectedReports) {
      const { fetchReportsIfNeeded, selectedReports } = nextProps
      fetchReportsIfNeeded(selectedReports)
    }
  }
// <LoadingView title="Если вы видите это окно, значит мы делаем личный кабинет для вас удобнее! Напишите нам в чат тех подержки (внизу справа) или на почту sb@todayme.ru" taskBack={true}/>

  render() {
    const { dispatch, reports, userInfo, isFetching, taskDay, activeAccordionItems, location } = this.props
    const isEmpty = (!reports || reports.length === 0) && (!taskDay || !taskDay.data || taskDay.data.length === 0)

    const isAlfa = domen.isAlfa
    const isTele2Lk = domen.isTele2
    let calendar = []
    let id
    let role

    if (!isEmpty && taskDay && taskDay.data) {
      calendar = taskDay.data[0].calendar
      id = taskDay.data[0].id
      role = taskDay.data[0].user.role
    }

    const items = reports.map((report, index) => {
      let health, status, accordionState
      const adminName = report.userInfo.firstName + ' ' + report.userInfo.lastName

      switch (report.health) {
        case 'good':
          health = 'Отлично'
          break
        case 'middle':
          health = 'Так себе'
          break
        case 'bad':
          health = 'Не очень'
          break
        default:
          health = 'Так себе'
      }

      switch (report.status) {
        case 'done':
          status = 'Зачет'
          accordionState = styles.accordionStateDone
          break
        case 'missed':
          status = 'Не сдан'
          accordionState = styles.accordionStateCross
          break
        case 'waitingadmin':
        case 'waiting':
          status = 'Проверка'
          accordionState = styles.accordionStateWaiting
          break
        default:
          health = 'Так себе'
      }

      let isItemActive = activeAccordionItems.indexOf(index) !== -1

      return (
        <li key={index} className={isItemActive ? styles.accordionItemActive : styles.accordionItem} onClick={() => {
          if (isItemActive) {
            dispatch({ type: 'DELETE_ACCORDION_ITEM', item: index })
          } else {
            dispatch({ type: 'ADD_ACCORDION_ITEM', item: index })
          }
        }}>
          <div className={styles.accordionHeader}>
            <div className={accordionState}>{status}</div>
            <div className={styles.accordionDate}>{moment(report.date).format('YYYY-MM-DD')}</div>
            <div className={styles.accordionName}>{adminName}</div>
            {/* <div className="accordion__qty-msg">
             <svg className="svg-icon ico-msg">
             <use xlinkHref="#ico-msg"></use>
             </svg>
             <span className="num">5</span>
             </div> */}
            {/*<div className={styles.accordionBtn}>
              <div className={styles.accordionBtnTitle}>свернуть</div>
              <svg className={styles.svgIcoArrowAccordion}>
                <use xlinkHref="#ico-arrow-accordion"></use>
              </svg>
            </div>*/}

             <span className={styles.btnBase}>
                  <span className={styles.btnTitle}>Показать</span>

                  <span className={styles.btnIco}>
                    <svg className={styles.svgIconBoldArrowDown}>
                      <use xlinkHref="#ico-bold-arrow-down"></use>
                    </svg>
                  </span>
              </span>

          </div>
          <div className={styles.accordionContent}>
            <ul className={styles.chatContent}>
              {report.adminAnswer &&
                <li className={styles.chatMsgSomeone}>
                  {/* <div className="chat-msg__ava">
                   <img src={report.userInfo.photo} alt=""/>
                   </div> */}
                  <div className={styles.chatMsgContent} style={{ margin: '0px 50px' }}>
                    <p className={styles.chatMsgName}>{adminName}</p>
                    <div className={styles.chatMsgText}>{report.adminAnswer}</div>
                  </div>
                </li>
              }
              <li className={styles.chatMsgYouSystem}>
                <div className={styles.chatMsgContent} style={{ margin: '0px 50px' }}>
                  <div className={styles.chatMsgText}>
                    <div>{`${report.report} Состояние: ${health}`}</div>
                    {
                      report.video &&
                      <div>
                        <span>Видео:</span>
                        <a href={report.video}>{report.video}</a>
                      </div>
                    }
                    </div>
                </div>
                {/* <div className="chat-msg__ava">
                 <img src="/tmp/ava-you.png" alt=""/>
                 </div> */}
              </li>
              <br/>
            </ul>
          </div>
        </li>
      )
    })

    return (
      <Layout location={location} page={'reports'} prevSeasons={userInfo.data.prevSeasons}>
        {isEmpty
          ? (isFetching ? <LoadingView isTele2Lk={isTele2Lk} isAlfa={isAlfa} title="Загружается..."/> : <LoadingView isTele2Lk={isTele2Lk} isAlfa={isAlfa} title="Загружается..."/>)
          : <div>
                  {reports.length
                    ? <div className={styles.stageBoxNoPadding}>
                        <h1 className={styles.h1}>Отчеты за все дни</h1>
                        <ul className={styles.accordionReports}>
                         {items}
                        </ul>
                      </div>
                    : <div className={styles.stageBoxReport}>

                        <h1 className={styles.h1}>Это твоя зачетная книжка</h1>

                        <div className="">
                          <p className="">Здесь ты будешь заполнять отчеты о выполненных (или не выполненных) заданиях для тренера. Возможно Стас задаст тебе пару уточняющих вопросов. Заполняй отчет по каждому заданию и двигайся вперед к отличному настроению и финальным призам! Удачи!</p>
                        </div>

                      </div>
                  }
        </div>}
      </Layout>

    )
  }
}

const mapStateToProps = state => {
  const { selectedReports, userInfo, recivedReports, sign, selectedTaskDay, recivedTaskDay, activeAccordionItems } = state

  const {
    isFetching,
    reports
  } = recivedReports[selectedReports] || {
    isFetching: true,
    reports: []
  }

  const {taskDay} = recivedTaskDay[selectedTaskDay] || {
    isFetching: true,
    taskDay: {}
  }

  return {
    activeAccordionItems,
    userInfo,
    sign,
    taskDay,
    recivedTaskDay,
    selectedReports,
    isFetching,
    reports
  }
}

const mapDispatchToProps = dispatch => ({
  selectReports: bindActionCreators(selectReports, dispatch),
  invalidateReports: bindActionCreators(invalidateReports, dispatch),
  fetchReportsIfNeeded: bindActionCreators(fetchReportsIfNeeded, dispatch),
  fetchTaskDayIfNeeded: bindActionCreators(fetchTaskDayIfNeeded, dispatch),
  dispatch
})

Reports = connect(
  mapStateToProps,
  mapDispatchToProps
)(Reports)

export default CSSModules(Reports, styles)
