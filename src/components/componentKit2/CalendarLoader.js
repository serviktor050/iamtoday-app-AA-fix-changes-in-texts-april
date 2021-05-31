import React, { Component } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import { browserHistory } from 'react-router'
import Scroll from 'react-scroll'
import CSSModules from 'react-css-modules'
import styles from './calendarLoader.css'
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

class CalendarList extends Component {
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
          let top = document.body.scrollTop
          let toTop = document.getElementById('to-top')

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

  render() {
    let items = []
    for (var i = 0; i < 7; i++) {
      items.push(<li key={i} className={styles.minCalendarItem}>
        </li>
      )
    }

    return (
      <div className={styles.gridCellLayoutCalendar33}>
        <div className={styles.minCalendarWrap}>
          <span className={styles.minCalendarBtnPrevUnactive}>
            <svg className={styles.svgIconBoldArrowUpUnactive}>
              <use xlinkHref="#ico-bold-arrow-up"></use>
            </svg>
          </span>
          <ul id='calendar' className={styles.minCalendar}>
            {items.map(i => i)}
          </ul>
          <span className={styles.minCalendarBtnNextUnactive}>
            <svg className={styles.svgIconBoldArrowDownUnactive}>
              <use xlinkHref="#ico-bold-arrow-down"></use>
            </svg>
          </span>
        </div>
      </div>
    )
  }
}


export default CSSModules(CalendarList, styles)
