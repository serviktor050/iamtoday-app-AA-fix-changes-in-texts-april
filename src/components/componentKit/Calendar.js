import PropTypes from 'prop-types';
import React from 'react';
import moment from 'moment'
import CSSModules from 'react-css-modules'
import styles from './calendar.css'

const Calendar = ({ children, onClick, number, completeText, icon, status,
  date, admin, isSelected, isTooSoon, customName, customIcon, dynamicStatus, id }) => {
  let calendarIcon
  let calendarToolip
  let content
  let special
  let calendarClass = styles.minCalendarItem
  let icoStyle = styles.iSvg;


  switch (icon) {
    case 'ico-done':
      icoStyle = styles.icoDone
      break
    case 'ico-cross':
      icoStyle = styles.icoCross
      break
    case 'ico-waiting':
      icoStyle = styles.icoWaiting
      break
    case 'ico-gift':
      icoStyle = styles.icoGift
      break
    case 'ico-finish':
      icoStyle = styles.icoGift
      break
    default:
      break
  }

	if (isSelected) {
		calendarClass = styles.minCalendarItemIsSelectTele2
    if(moment(date).format('YYYY-MM-DD') === moment().format('YYYY-MM-DD')){
			icon = customIcon
			customIcon = null
		}
	} else if (moment(date).format('YYYY-MM-DD') === moment().format('YYYY-MM-DD')) {
		calendarClass = styles.minCalendarItemToday
		icon = customIcon
		customIcon = null
	}

  if (icon) {
    calendarIcon = (
      <div className={styles.minCalendarInfo}>
        <svg className={icoStyle}>
          <use xlinkHref={`#${icon}`}/>
        </svg>
      </div>
    )
  }

  if (isSelected && dynamicStatus && dynamicStatus.length) {
    calendarIcon = (
      <div className={styles.minCalendarInfo}>
        <svg className={styles.svgIconWaiting}>
          <use xlinkHref={'#ico-done'}/>
        </svg>
      </div>
    )
  }

  if (completeText && admin && status) {
    calendarToolip = (
      <div className={'calendar-toolip calendar-toolip--' + status}>
        <div className={styles.calendarToolipInner}>
          <p className={styles.calendarToolipTitle}>{completeText}</p>
          <p className={styles.calendarToolipDate}><span>{admin}</span></p>
        </div>
      </div>
    )
  }

  const style = isTooSoon ? { color: '#C8C9CF' } : {}

  const iconDay = customIcon ? <svg className={styles.iconDay}><use xlinkHref={'#' + customIcon}/></svg> : null

  content = (
    <span className={styles.minCalendarDateWrap}>

      <span className={styles.minCalendarDate} style={style}>{number}</span>
      <span
        className={styles.minCalendarDay}
      >
        {moment(date).format('YYYY-MM-DD') === moment().format('YYYY-MM-DD')
          ? 'Cегодня'
          : children
        }
      </span>
    </span>
  )

  if (customName.length) {
    special = (
      <p className={styles.minCalendarSpecialDay}>{customName}</p>
    )
    content = null;
    calendarIcon = null;
    calendarToolip = null;
  }
  if(iconDay){
		content = null;
		calendarIcon = null;
		calendarToolip = null;
		special = null;
  }

  return (
    <li id={id} className={calendarClass} onClick={onClick}>
      {content}
      {calendarIcon}
      {calendarToolip}
      {special}
			{iconDay}
    </li>
  )
}

Calendar.propTypes = {
  children: PropTypes.string.isRequired,
  icon: PropTypes.string,
  status: PropTypes.string,
  admin: PropTypes.string,
  completeText: PropTypes.string,
  date: PropTypes.string,
  onClick: PropTypes.func
}

export default CSSModules(Calendar, styles)
