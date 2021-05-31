import React, { useState } from 'react';
import classNames from 'classnames/bind';

import styles from './styles.css';
import { ShortTask } from '../../../ShortTask';
import { CalendarTaskWindow } from '../../../../../CalendarTaskWindow';

const cx = classNames.bind(styles);

export function MonthTask({ task, periodInfo }) {

  const [ isEditTaskWindow, setEditTaskWindow ] = useState(false);
  function toggleTaskWindow() {
    setEditTaskWindow(!isEditTaskWindow)
  }

  return (
    <div className={cx('monthTask')}>
      <ShortTask toggleTaskWindow={toggleTaskWindow} id={task.createTs} task={task} periodInfo={periodInfo} />
      {isEditTaskWindow && <CalendarTaskWindow toggleTaskWindow={toggleTaskWindow} taskInfo={task} />}
    </div>
  )
}
