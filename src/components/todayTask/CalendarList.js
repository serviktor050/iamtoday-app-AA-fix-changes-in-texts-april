import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux'
import moment from 'moment'
import { browserHistory } from 'react-router'
import Scroll from 'react-scroll'
import CSSModules from 'react-css-modules'
import styles from './calendarList.css'
import Calendar from '../componentKit/Calendar'
import * as actions from '../../actions'
import { PUBLIC_CHAT_ID, PRIVATE_CHAT_ID } from '../../actions'

const styleString = `
  position: fixed;
  width: 80px;
  overflow-y: auto;
  overflow-x: hidden;
  height: 90%;
  -webkit-overflow-scrolling: touch;
`
/**
 *  Компонент CalendarList.
 *  Используется для вывода календаря
 *
 */
class CalendarList extends Component {
  /**
   * @memberof  CalendarList
   * @prop {object} propTypes - the props that are passed to this component
   * @prop {func} propTypes.changeChatType Выбор чата
   * @prop {string} propTypes.status Статус зачета
   * @prop {number} propTypes.role Роль юзера
   * @prop {func} propTypes.clearRenderChat Очистка чата
   * @prop {object} propTypes.calendar Объект календаря
   * @prop {number} propTypes.dayId Номер дня
   *
   * */

  static propTypes = {
    changeChatType: PropTypes.func.isRequired,
    status: PropTypes.string,
    role: PropTypes.number.isRequired,
    clearRenderChat: PropTypes.func.isRequired,
    calendar: PropTypes.array,
    dayId: PropTypes.number.isRequired
  }
  componentDidMount() {
    const windowWidth = window.innerWidth
    if (document.getElementById('today') && (window.mobilecheck() || windowWidth < 1024)) {
      document.getElementById('calendar').scrollLeft = document.getElementById('today').getBoundingClientRect().left

      if (document.getElementById('menu')) {
        document.getElementById('menu').style.cssText = 'position: initial;'
      }

      document.getElementById('calendar').style.cssText = ''
    }

      window.addEventListener('scroll',() =>{
          let top = window.scrollY;
          let toTop = document.getElementById('to-top');


          if(toTop){
					
              if(top > document.body.clientHeight){
                  toTop.className = styles.btnGoBackShow
              } else {
                  toTop.className = styles.btnGoBack
              }
          }
      })

    // window.addEventListener('scroll', this.handleScroll)
    // window.addEventListener('resize', this.handleResize)
  }

  handleScroll(event) {
    const windowWidth = window.innerWidth
    if (event.srcElement.body.scrollTop > 54) {
      document.getElementById('menu').className = 'grid layout__menu-inner is-fixed'
      if (windowWidth < 1024) {
        document.getElementById('menu').style.cssText = 'position: initial;'
      } else {
        document.getElementById('menu').style.cssText = `position: fixed; width: 21%;`
      }
    } else {
      document.getElementById('menu').className = 'grid layout__menu-inner'
    }
  }

  handleResize(event) {
    const windowWidth = window.innerWidth
    if (windowWidth < 1024) {
      document.getElementById('menu').style.cssText = 'position: initial;'
      document.getElementById('calendar').style.cssText = ''
    } else {
      document.getElementById('menu').style.cssText = `position: fixed; width: 21%;`
      document.getElementById('calendar').style.cssText = styleString
    }
  }

  // componentWillUnmount() {
  //   window.removeEventListener('scroll', this.handleScroll)
  //   window.removeEventListener('resize', this.handleResize)
  // }

  render() {
    const { calendar,
      selectedTaskDay,
      recivedTaskDay,
      dispatch,
      dayId,
      role,
      none,
      chats,
      privateChatId,
      changeChatType,
      setTypeId,
      clearRenderChat,
      status,
      calendarOffset
    } = this.props
    let typeId
    if (recivedTaskDay[selectedTaskDay] && recivedTaskDay[selectedTaskDay].taskDay){
      typeId = recivedTaskDay[selectedTaskDay].taskDay.data[0].id
    }

    let bunchOfDays = []
    let todayIndex
    let offsetIfTodayIndexIsTooLow

    const TOTAL_NUMBER_ON_PAGE = 8
    const OFFSET = 5

    if (window.mobilecheck() || calendar.length < TOTAL_NUMBER_ON_PAGE) {
      bunchOfDays = calendar
    } else {
      calendar.map((item, i) => {
        if (item.dayId === dayId) {
          if (i > OFFSET) {
            todayIndex = i + calendarOffset - OFFSET
          } else {
            todayIndex = calendarOffset
          }
        }
      })

      offsetIfTodayIndexIsTooLow = todayIndex

      if (todayIndex < 0) {
        todayIndex = 0
      } else if (todayIndex >= calendar.length - OFFSET) {
        todayIndex = calendar.length - 1
      }

      const max = todayIndex < calendar.length - TOTAL_NUMBER_ON_PAGE ? todayIndex : calendar.length - TOTAL_NUMBER_ON_PAGE
      let i = max

      while(bunchOfDays.length < TOTAL_NUMBER_ON_PAGE && i < calendar.length) {
        bunchOfDays.push(calendar[i])
        i += 1
      }
    }

    return (
      <div className={styles.gridCellLayoutCalendar33}>
        <div id='calendar' className={styles.minCalendarWrap}>
            {!none ?
          <span
            className={todayIndex > 0
              ? styles.minCalendarBtnPrev
              : styles.minCalendarBtnPrevUnactive
            }
            onClick={() => {
              dispatch({ type: 'DECREASE_OFFSET', calendarOffset, todayIndex })
            }}
          >
            <svg
              className={todayIndex > 0
                ? styles.svgIconBoldArrowUp
                : styles.svgIconBoldArrowUpUnactive
              }
            >
              <use xlinkHref="#ico-bold-arrow-up"></use>
            </svg>
          </span>
                : null }
            {!none ?
          <ul id='calendar' className={styles.minCalendar}>
          {/* <ul id='calendar' className={styles.minCalendar} style={!window.mobilecheck() || window.innerWidth < 1024 ? style : {}}> */}
            {bunchOfDays.map((field, index) => {
              let isTooSoon = moment(field.date).isAfter(moment().format('YYYY-MM-DD')) && role !== 2
              if (moment().weekday() === 4 && moment().hour() >= 21) isTooSoon = false
              return (
                <Calendar
                  id={field.date === moment().format('YYYY-MM-DD') || field.dayId === dayId ? 'today' : 'day'}
                  onClick={() => {
                    browserHistory.push(`/task/${field.dayId}`)
                    if (!isTooSoon) {
                      dispatch({ type: 'SELECT_DAY_ID', id: field.dayId })
                      dispatch({ type: 'SELECT_DAY_DATE', date: field.date })
                      dispatch({ type: 'SET_OFFSET_ZERO' })
                      dispatch(actions.fetchTaskDayIfNeeded(selectedTaskDay))
                      setTypeId(field.dayId)
                      changeChatType(chats.chatType)
                      //clearRenderChat()
                    }
                  }}
                  key={index}
                  isTooSoon={isTooSoon}
                  isSelected={field.dayId === dayId}
                  number={field.number}
                  icon={field.icon}
                  customName={field.customName}
                  customIcon={field.customIcon}
                  status={field.status}
                  date={field.date}
                  admin={field.admin}
                  dynamicStatus={status}
                  completeText={field.completeText}>
                    {field.day}
                </Calendar>
              )
            })}
          </ul>
              : null }
            {!none ?
          <span
            className={todayIndex + OFFSET < calendar.length - 1
              ? styles.minCalendarBtnNext
              : styles.minCalendarBtnNextUnactive
            }
            onClick={() => dispatch({
              type: 'INCREASE_OFFSET',
              length: calendar.length,
              calendarOffset: offsetIfTodayIndexIsTooLow >= 0
                ? calendarOffset
                : -offsetIfTodayIndexIsTooLow - 7,
              todayIndex
            })}
          >
            <svg
              className={todayIndex + OFFSET < calendar.length - 1
                ? styles.svgIconBoldArrowDown
                : styles.svgIconBoldArrowDownUnactive
              }
            >
              <use xlinkHref="#ico-bold-arrow-down"></use>
            </svg>
          </span>
                : null }
          <div id="to-top"
            className={styles.btnGoBack}
            onClick={() => Scroll.animateScroll.scrollToTop()}
          >
            <svg className={styles.svgIconBoldArrowUp}>
              <use xlinkHref="#ico-bold-arrow-up"></use>
            </svg>
            <div className={styles.btnGoBackTitle}>вверх</div>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  const { recivedTaskDay, selectedTaskDay, calendarStyle, calendarOffset, chats } = state

  return {
    selectedTaskDay,
    chats,
    recivedTaskDay,
    calendarStyle,
    calendarOffset
  }
}

CalendarList = connect(
  mapStateToProps
)(CalendarList)

export default CSSModules(CalendarList, styles)
