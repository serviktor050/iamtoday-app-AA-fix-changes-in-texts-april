import React from 'react';
import classNames from 'classnames/bind';

import styles from './styles.css';

const cx = classNames.bind(styles);

const TIME = ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00']

export const TimeBlock = ({ isExpanded, toggleExpand }) => {
  return (
    <div className={cx('timeBlock')}>
      {TIME.map((item, index) => {
        if (!isExpanded && (index > 0 && index < 6)) {
          return null
        }
        return (
          <div className={cx('timePeriod')}>
            {item}
            {index === 0 && <button className={cx('btn-expand', { 'btn-hide': isExpanded } )} onClick={_ => toggleExpand()} ></button>}
          </div>
        )
      })}
    </div>
  )
}
