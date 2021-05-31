import React from 'react';
import classNames from 'classnames/bind';
import moment from 'moment';
import { browserHistory } from 'react-router';

import styles from './styles.css';

const cx = classNames.bind(styles);

export function MenuNotification({ task }) {
  return (
    <div className={cx('menuNotification')} onClick={() => browserHistory.push('/calendar/tasks')} >
      <span className={cx('menuNotification__time')}>{moment(task.dateStart).format("LT")}</span>
      <p className={cx('menuNotification__name')}>{task.name}</p>
    </div>
  )
}
