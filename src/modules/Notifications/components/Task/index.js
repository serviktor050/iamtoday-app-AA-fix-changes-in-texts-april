import React from 'react';
import { browserHistory } from 'react-router';
import classNames from 'classnames/bind';
import moment from 'moment';

import styles from './styles.css';

const cx = classNames.bind(styles);


export function Task({ task }) {
  return (
    <div onClick={() => browserHistory.push('/calendar/tasks')} className={cx('item', 'item_task')} key={task.id}>
      <div className={cx('item__clock')}>
        <svg className={cx('item__icon')}>
          <use xlinkHref='#ico-clock' />
        </svg>
        <span className={cx('item__clock_time')}>{moment(task.dateStart).format('LT')}</span>
      </div>
      <div className={cx("info", { 'info_center': !task.description })}>
          <p className={cx("text")}>{task.name}</p>
          <p className={cx("desc")}>{task.description}</p>
        </div>
    </div>
  )
}
