import React from 'react'
import CSSModules from 'react-css-modules'
import styles from './calendar.css'

const Calendar = props => {
  const { children, onClick, onTrashClick, number } = props

  return (
    <li className={styles.minCalendarItem} onClick={onClick}>
      <span className={styles.minCalendarDateWrap}>
        <span className={styles.minCalendarDay}>{children}</span>
        <span className={styles.minCalendarDate}>{number}</span>
      </span>
      <div className={styles.minCalendarInfo}>
        <svg className={styles.svgIcoTrash} onClick={onTrashClick}>
          <use xlinkHref="#ico-trash"></use>
        </svg>
      </div>
    </li>
  )
}

export default CSSModules(Calendar, styles)
